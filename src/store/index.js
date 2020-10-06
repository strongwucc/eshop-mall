import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    hasLogin: false,
    token: '',
    userInfo: {},
    cartInfo: {},
    searchKeys: [],
    historySearchKeys: [],
    sysInfo: {},
  },
  mutations: {
    login(state, token) {
      state.hasLogin = true;
      state.token = token;
      uni.setStorage({ //缓存用户登陆状态
        key: 'token',
        data: token
      });
    },
    setUser(state, userInfo) {
      state.userInfo = userInfo;
      uni.setStorage({
        key: 'userInfo',
        data: JSON.stringify(userInfo)
      });
    },
    setSysInfo(state, sysInfo) {
      state.sysInfo = sysInfo;
      uni.setStorage({
        key: 'sysInfo',
        data: JSON.stringify(sysInfo)
      });
    },
    setCart(state, cartInfo) {
      state.cartInfo = cartInfo;
      uni.setStorage({
        key: 'cartInfo',
        data: JSON.stringify(cartInfo)
      });
    },
    logout(state) {
      state.hasLogin = false;
      state.token = '';
      state.userInfo = {};
      state.cartInfo = {};
      uni.removeStorage({
        key: 'userInfo'
      });
      uni.removeStorage({
        key: 'cartInfo'
      });
      uni.removeStorage({
        key: 'token'
      });
    },
    setSearchKeys(state, searchKeys) {
      state.searchKeys = searchKeys;
      uni.setStorage({
        key: 'searchKeys',
        data: JSON.stringify(searchKeys)
      });
    },
    setHistorySearchKeys(state, searchKeys) {
      state.historySearchKeys = searchKeys;
      uni.setStorage({
        key: 'historySearchKeys',
        data: JSON.stringify(searchKeys)
      });
    }
  },
  actions: {

  }
})

export default store