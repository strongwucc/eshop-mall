import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    hasLogin: false,
    token: "",
    userInfo: {},
    cartInfo: {},
    searchKeys: [],
    historySearchKeys: [],
  },
  mutations: {
    login(state, token) {
      state.hasLogin = true;
      state.token = token;
      uni.setStorage({
        //缓存用户登陆状态
        key: "token",
        data: token,
      });
    },
    setUser(state, userInfo) {
      state.userInfo = userInfo;
      uni.setStorage({
        key: "userInfo",
        data: JSON.stringify(userInfo),
      });
    },
    setCart(state, cartInfo) {
      state.cartInfo = cartInfo;
      uni.setStorage({
        key: "cartInfo",
        data: JSON.stringify(cartInfo),
      });
    },
    logout(state) {
      state.hasLogin = false;
      state.token = "";
      state.userInfo = {};
      state.cartInfo = {};
      uni.removeStorage({
        key: "userInfo",
      });
      uni.removeStorage({
        key: "cartInfo",
      });
      uni.removeStorage({
        key: "token",
      });
    },
    setSearchKeys(state, searchKeys) {
      state.searchKeys = searchKeys;
      uni.setStorage({
        key: "searchKeys",
        data: JSON.stringify(searchKeys),
      });
    },
    setHistorySearchKeys(state, searchKeys) {
      state.historySearchKeys = searchKeys;
      uni.setStorage({
        key: "historySearchKeys",
        data: JSON.stringify(searchKeys),
      });
    },
  },
  actions: {
    getUserInfo: async function({ commit, state }) {
      return await new Promise((resolve, reject) => {
        if (state.hasLogin) {
          resolve(state.userInfo);
        } else {
          uni.getProvider({
            service: "oauth",
            success: (result) => {
              if (result.provider.length > 0) {
                let providerName = "";
                let provider = result.provider[0];
                switch (provider) {
                  case "weixin":
                    providerName = "微信";
                    break;
                  case "qq":
                    providerName = "QQ";
                    break;
                  case "sinaweibo":
                    providerName = "新浪微博";
                    break;
                  case "xiaomi":
                    providerName = "小米";
                    break;
                  case "alipay":
                    providerName = "支付宝";
                    break;
                  case "baidu":
                    providerName = "百度";
                    break;
                  case "toutiao":
                    providerName = "头条";
                    break;
                  case "apple":
                    providerName = "苹果";
                    break;
                }
                uni.login({
                  provider: provider,
                  // #ifdef MP-ALIPAY
                  scopes: "auth_user", //支付宝小程序需设置授权类型
                  // #endif
                  success: (res) => {
                    console.log("login success:", res);
                  },
                  fail: (err) => {
                    console.log("login fail:", err);
                    reject(err);
                  },
                });
              }
            },
            fail: (error) => {
              console.log("获取登录通道失败", error);
              reject(error);
            },
          });
        }
      });
    },
  },
});

export default store;
