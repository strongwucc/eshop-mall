/**
 * 接口配置信息
 */

module.exports = {
  auth: {
    login: 'login',                                 // 登录
    sendSms: 'sendSms',                             // 发送短信
    signup: 'create',                               // 注册
    resetPwdSms: 'resetPwdCode',                    // 找回密码短信
    resetPassWord: 'resetPassWord'                  // 密码重置
  },
	user: {
		center: 'member',                               // 个人中心
    balance: 'balance',                             // 预存款账户查询
    integralRecords: 'pointHistory',                // 历史积分
    changePwd: 'saveSecurity',                      // 修改密码
    orders: 'orders',                               // 订单列表
    order: 'orderDetail',                           // 订单明细
    orderCancel: 'doCancel',                        // 取消订单
    favs: 'favorite',                               // 收藏列表
    removeFav: 'delFav',                            // 删除收藏
    addrs: 'receiver',                              // 收货地址
    searchArea: 'getAreaSelect',                    // 收货地区
    addAddr: 'addReceiver',                         // 添加收货地址
    removeAddr: 'delRec',                           // 删除收货地址
	},
  cart: {
    cart: 'cart',                                   // 购物车信息
    add: 'cartAddGoods',                            // 添加购物车
  },
  goods: {
    // category: 'goodsCat',                           // 商品分类
    category: 'categoryList',                       // 商品分类
    gallery: 'gallery',                             // 商品列表（根据分类）
    detail: 'goodsDetail',                          // 商品信息
    intro: 'goodsDetailIntro',                      // 商品详细介绍
  },
}

