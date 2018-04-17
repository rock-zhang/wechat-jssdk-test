var redis = require("redis");
var https = require('https');
var qs = require('qs');
var redisClient = redis.createClient(6379, 'localhost');
var wxConfig = require('./config.json');

function fetchAccessToken(cb) {
    var data = {
        grant_type: 'client_credential',
        appid: wxConfig.appid,
        secret: wxConfig.appSecret
    };
    var options = {
        hostname: 'api.weixin.qq.com',
        port: 443,
        path: '/cgi-bin/token?' + qs.stringify(data),
        method: 'GET'
    };

    var req = https.request(options, function (res) {
        res.setEncoding('utf-8');

        res.on('data', function (d) {
            var jsonData = JSON.parse(d);

            console.log('jsonData:', jsonData)
            if (jsonData.access_token) {
                redisClient.setex('accessToken', jsonData.expires_in, jsonData.access_token, function (err) {
                    if (err) {
                        console.error('accessToken写入redis失败：', err);
                    } else {
                        console.log('accessToken写入redis成功：', jsonData.access_token);
                        cb && cb(jsonData.access_token);
                    }
                });
            } else {
                console.log('fetchAccessToken errcode:', jsonData)
            }
        });
    });
    req.on('error', function (e) {
        console.error('fetchAccessToken error: ', e);
    });
    req.end();
};

exports.getAccessToken = function getAccessToken(cb) {
    redisClient.get('accessToken', function (err, accessToken) {
        if (err || !accessToken) {
            console.error('accessToken not found...， go fetch..');
            fetchAccessToken(cb);
        } else {
            console.log('accessToken：', accessToken);
            cb && cb(accessToken);
        }
    });
};
