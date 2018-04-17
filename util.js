var jssha = require('jssha');

//签名
exports.getSign = function (json) {
    const tmpArr = [];
    const shaObj = new jssha('SHA-1', 'TEXT');
    let str, i;

    for (i in json) {
        tmpArr.push(i + '=' + json[i]);
    }

    str = tmpArr.join('&');
    shaObj.update(str);

    return shaObj.getHash('HEX');
    // json.signature = shaObj.getHash('HEX');

    // return json;
};

exports.createNonceStr = function () {
    return Math.random().toString(36).substr(2, 15);
};

exports.createTimestamp = function () {
    return parseInt(new Date().getTime() / 1000) + '';
};

//json转xml
exports.json2xml = function (json) {
    var tmpArr = ['<xml>'];
    for (var i in json) {
        tmpArr.push('<' + i + '>' + json[i] + '</' + i + '>');
    }
    tmpArr.push('</xml>');
    return tmpArr.join('');
};

var json2string = function (json) {
    var tmpArr = [];
    for (var i in json) {
        tmpArr.push(i + '=' + encodeURIComponent(json[i]));
    }
    return tmpArr.join('&');
}

//生成随机串
exports.getNonceStr = function () {
    return Math.floor(Math.pow(10, 12) * Math.random()) + '';
};
