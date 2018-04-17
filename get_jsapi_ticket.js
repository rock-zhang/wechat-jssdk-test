var redis = require("redis");
var https = require('https');
var qs = require('qs');
var redisClient = redis.createClient(6379, 'localhost');

var getAccessToken = require('./get_access_token').getAccessToken;

function fetchJsapiTicket(accessToken, cb) {
    var data = {
        access_token: accessToken,
        type: 'jsapi'
    };
    var options = {
        hostname: 'api.weixin.qq.com',
        port: 443,
        path: '/cgi-bin/ticket/getticket?' + qs.stringify(data),
        method: 'GET'
    };

    var req = https.request(options, function (res) {
        res.setEncoding('utf-8');

        res.on('data', function (d) {
            var jsonData = JSON.parse(d);

            redisClient.setex('jsapiTicket', jsonData.expires_in, jsonData.ticket, function (err) {
                if (err) {
                    console.error('jsapiTicket写入redis失败：', err);
                } else {
                    console.log('jsapiTicket写入redis成功：', jsonData.ticket);
                    cb && cb(jsonData.ticket);
                }
            });
        });
    });
    req.on('error', function (e) {
        console.error('fetchJsapiTicket error：', e);
    });
    req.end();
};

exports.getJsapiTicket = function getJsapiTicket(cb) {
    redisClient.get('jsapiTicket', function (err, jsapiTicket) {
        if (err || !jsapiTicket) {
            console.error('jsapiTicket not found...， go fetch..');
            getAccessToken(function (accessToken) {
                fetchJsapiTicket(accessToken, cb);
            });
        } else {
            console.log('jsapiTicket', jsapiTicket);
            cb && cb(jsapiTicket)
        }
    });
};