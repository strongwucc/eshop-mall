/**
 * 配置编译环境和线上环境之间的切换
 *
 * rootUrl 域名地址
 * baseUrl 基础地址
 * imgBaseUrl 图片所在域名地址
 * wxAppid 微信 appid
 *
 */
let rootUrl = "";
let baseUrl = "";
let imgBaseUrl = "";
// let wxAppid = "wxe413db41714cb4c7";
let wxAppid = "wxa32e1b967ddb4f70";
let wxOauthUrl = "https://open.weixin.qq.com/connect/oauth2/authorize";
let wxAccessTokenUrl = "https://api.weixin.qq.com/sns/oauth2/access_token";
let wxRefreshTokenUrl = "https://api.weixin.qq.com/sns/oauth2/refresh_token";
let wxUserInfoUrl = "https://api.weixin.qq.com/sns/userinfo";
let wxCheckTokenUrl = "https://api.weixin.qq.com/sns/auth";
let wxRedirect = "";
let aliRedirect = "";

if (process.env.NODE_ENV === "development") {
  // #ifndef H5
  rootUrl = "https://shop0001.sh.miour.cn/";
  // rootUrl = 'https://api.yaliantong.com/'
  // #endif
  // #ifdef H5
  rootUrl = "https://shop0001.sh.miour.cn/";
  // #endif
  baseUrl = rootUrl + "index.php/openapi/wxapp_rpc/";
  imgBaseUrl = rootUrl + "";
  wxRedirect = "";
  aliRedirect = "";
} else if (process.env.NODE_ENV === "production") {
  // rootUrl = "https://api.yaliantong.com/";
  rootUrl = "https://shop0001.sh.miour.cn/";
  baseUrl = rootUrl + "index.php/openapi/wxapp_rpc/";
  imgBaseUrl = rootUrl + "";
  wxRedirect = "";
  aliRedirect = "";
}

module.exports = {
  rootUrl: rootUrl,
  baseUrl: baseUrl,
  imgBaseUrl: imgBaseUrl,
  wxAppid: wxAppid,
  wxOauthUrl: wxOauthUrl,
  wxAccessTokenUrl: wxAccessTokenUrl,
  wxRefreshTokenUrl: wxRefreshTokenUrl,
  wxUserInfoUrl: wxUserInfoUrl,
  wxCheckTokenUrl: wxCheckTokenUrl,
  wxRedirect: wxRedirect,
  aliRedirect: aliRedirect,
};
