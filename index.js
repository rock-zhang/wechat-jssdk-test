var getJsapiTicket = require('./get_jsapi_ticket').getJsapiTicket;
var wxConfig = require('./config_dda.json');
var { getSign, createNonceStr, createTimestamp } = require('./util');

getJsapiTicket(function (jsapi_ticket) {
    const data = {
        jsapi_ticket: jsapi_ticket,
        noncestr: createNonceStr(),
        timestamp: createTimestamp(),
        url: wxConfig.url
    };

    const sdkConfig = {
        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: wxConfig.appid, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.noncestr, // 必填，生成签名的随机串
        signature: getSign(data),// 必填，签名，见附录1
        jsApiList: ['checkJsApi', 'chooseImage', 'uploadImage', 'previewImage', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'uploadVoice', 'translateVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    };

    console.log(sdkConfig);
});

