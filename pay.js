const https = require('https');
const qs = require('qs');
var xml2js = require('xml2js');
const wxConfig = require('./config.json');
const { getNonceStr, json2xml } = require('./util');
var crypto = require('crypto');

//签名
var getSign = function (json, appSecretKey) {
    var tmpArr = [], str;
    for (var i in json) {
        tmpArr.push(i + '=' + json[i]);
    }
    str = tmpArr.join('&') + '&' + 'key=' + appSecretKey;
    str = crypto.createHash('md5').update(str).digest('hex');
    return str.toUpperCase();
};

function wechatPrepay() {
    const data = {
        appid: wxConfig.appid,
        body: '小农女-充值',
        mch_id: wxConfig.mch_id,
        nonce_str: getNonceStr(),
        notify_url: 'http://test.guanmai.cn/v587',
        out_trade_no: 'T01230234211',
        spbill_create_ip: '203.195.209.90',
        total_fee: 1, //sum,
        trade_type: 'APP'
    };

    const payData = { ...data, sign: getSign(data, wxConfig.appSecretKey) };
    console.log('payData', payData)

    let content = json2xml(payData);

    const options = {
        hostname: 'api.mch.weixin.qq.com',
        port: 443,
        path: '/pay/unifiedorder',
        method: 'POST',
        agent: false,
        rejectUnauthorized: false,
        headers: {
            'Content-Type': 'application/xml;charset=utf-8',
            // 'Content-Length': content.length
            // 'Content-Type': 'text/xml;',
            // 'Content-Length': content.length
        }
    };

    var req = https.request(options, function (res) {
        res.setEncoding('utf-8');

        res.on('data', function (d) {
            console.log(d);
            var parseString = xml2js.parseString;
            parseString(d, function (err, result) {
                if (!err && result.xml.prepay_id) {
                    var resData = {
                        'appid': wxConfig.appid,
                        'noncestr': getNonceStr(),
                        'package': 'Sign=WXPay',
                        'partnerid': wxConfig.mch_id,
                        'prepayid': result.xml.prepay_id[0],
                        'timestamp': (Math.floor((new Date).getTime() / 1000) + '')
                    };

                    resData.sign = getSign(resData, wxConfig.appSecretKey);
                    console.log(resData);
                } else {
                    console.error('prepay error: ', err)
                }
            });
        });
    });

    req.on('error', function (e) {
        console.error('wechatPrepay error：', e);
    });

    req.write(content);

    req.end();
};


wechatPrepay();