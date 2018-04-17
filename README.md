# wechat-jssdk-test
获取jssdk config和获取微信支付测试数据

# Usage
在config.json中填入公众号或开发平台的相关配置数据。
```js
{
    "appid": "",
    "mch_id": "", // 商户号
    "appSecret": "",
    "appSecretKey": "", // 商户平台中设置的key
    "url": "" // jssdk使用所在的url
}
```

- 获取jssdk config需要`appid`、`appSecret`、`url`，然后`npm run jssdk`;
- 获取支付信息需要`appid`、`mch_id`、`appSecretKey`，然后`npm run pay`;


# Note
- url所使用的域名需要在公众号中配置为`JS接口安全域名`
- 获取access_token需要在公众号中配置当前IP到`IP白名单`
- ...