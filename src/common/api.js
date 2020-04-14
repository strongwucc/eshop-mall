/**
 * 接口配置信息
 */

module.exports = {
  auth: {
    login: 'login', // 登录
    sendSms: 'sendSms', // 发送短信
    signup: 'create', // 注册
    resetPwdCode: 'resetPwdCode', // 找回密码短信验证
    resetPassWord: 'resetPassWord' // 密码重置
  },
  user: {
    center: 'member', // 个人中心
    balance: 'balance', // 预存款账户查询
    coupons: 'myCoupons', // 我的优惠券
    integralRecords: 'pointHistory', // 历史积分
    changePwd: 'saveSecurity', // 修改密码
    orders: 'orders', // 订单列表
    order: 'orderDetail', // 订单明细
    pay: 'paycenter', // 去支付
    changePayment: 'changePayment', // 更换支付方式
    doPayment: 'dopayment', // 确认支付
    orderCancel: 'doCancel', // 取消订单
    favs: 'favorite', // 收藏列表
    addFav: 'goodsFav', // 添加收藏
    removeFav: 'delFav', // 删除收藏
    defAddr: 'defAddr', // 默认收货地址
    addrs: 'receiver', // 收货地址
    addAddr: 'addReceiver', // 添加收货地址
    removeAddr: 'delRec', // 删除收货地址
    comments: 'comments', // 我的评论
    asks: 'asks', // 我的咨询
    noDiscuss: 'noDiscuss', // 未评论商品
    toComment: 'toComment', // 评论
    afterRec: 'afterRec', // 退换货记录
    afterList: 'afterList', // 申请退换货列表
    addRec: 'addRec', // 增加退换货记录
    returnSave: 'returnSave', // 保存退换货记录
    returnDetail: 'returnDetail', // 退换货详情
    couponExchange: 'couponExchange', // 可兑换优惠券
    exchange: 'exchange', // 兑换优惠券
  },
  cart: {
    cart: 'cart', // 购物车信息
    add: 'cartAddGoods', // 添加购物车
    update: 'updateCart', // 更新购物车
    remove: 'removeCart', // 删除、清空购物车
    checkout: 'checkout', // 结算
    total: 'total', // 结算总额
    order: 'createOrder', // 创建订单
  },
  goods: {
    // category: 'goodsCat',                           // 商品分类
    category: 'categoryList', // 商品分类
    gallery: 'gallery', // 商品列表（根据分类）
    detail: 'goodsDetail', // 商品信息
    intro: 'goodsDetailIntro', // 商品详细介绍
    comments: 'goodsComments', // 商品评论
  },
  ectools: {
    searchArea: 'getAreaSelect', // 收货地区
    regions: 'getAreaMap', // 收货地区映射
    dlytype: 'getDlytype', // 快递信息
    payment: 'getPayments', // 支付方式
  },
  index: {
    index: 'index', // 首页数据
  }
}