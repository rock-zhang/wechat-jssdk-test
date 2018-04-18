# wechat-jssdk-test
获取jssdk config和获取微信支付测试数据

### Usage
在config.json中填入公众号或开发平台的相关配置数据。
```js
{
    "appid": "",
    "mch_id": "", // 商户号
    "appSecret": "",
    "appSecretKey": "", // 商户平台中设置的key
    "url": "test.example.com" // jssdk使用所在的url
}
```

- 获取jssdk config需要`appid`、`appSecret`、`url`，然后`npm run jssdk`;
- 获取支付信息需要`appid`、`mch_id`、`appSecretKey`，然后`npm run pay`;


### Note
- url为当前网页的URL，不包含#及其后面部分
- url所使用的域名需要在公众号中配置为`JS接口安全域名`，且域名需要已备案
- 获取access_token需要在公众号中配置当前IP到`IP白名单`
- ...


# jssdk开发调试
总体按照官方文档[JSSDK使用步骤](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115)的五个步骤走。
1. 步骤三使用上面`npm run jssdk`生成的数据；
2. 由于需要通过config中配置的url访问页面，选用`localtunnel`代理本地开发环境，以使在微信中访问本地资源；
3. 测试需要以`test.example.com`为入口；
4. 替换`test.example.com`页面中的资源为`http://test.guanmai.cn:1234`开头，在微信中打开`test.example.com`即可开始测试jssdk的接口啦；

### localtunnel使用
1. 在外网服务器搭建[localtunnel服务端](https://github.com/localtunnel/server)
```shell
# pick a place where the files will live
git clone git://github.com/defunctzombie/localtunnel-server.git
cd localtunnel-server
npm install

# server set to run on port 1234
bin/server --port 1234
```

2. 本地跑[localtunnel客户端](https://github.com/localtunnel/localtunnel)
```shell
lt --host http://test.example.com:1234 --port 9999 --subdomain test
```
`port`为本地服务端口，`subdomain`为url子域名部分

