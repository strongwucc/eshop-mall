<template>
  <view class="container">
    <view class="status-info">{{orderInfo.tip}}</view>
    <view class="addr-info">
      <view class="up">
        <text class="name">{{orderInfo.consignee.name || ''}}</text>
        <text class="mobile">{{orderInfo.consignee.mobile || ''}}</text>
      </view>
      <view class="down">{{orderInfo.consignee.addr || ''}}</view>
    </view>
    <view class="goods-list">
      <view class="goods-item" v-for="(goods, goodsIndex) in orderInfo.goods_data" :v-for="goods.item_id">
        <view class="left">
          <image :src="goods.pic_url"></image>
        </view>
        <view class="right">
          <text class="name">{{goods.name}}</text>
          <text class="spec">{{goods.products.spec_info || ''}}</text>
          <text class="price-nums">
            <text class="price">{{goods.price | formatMoney}}</text>
            <text class="nums">数量：{{goods.quantity}}</text>
          </text>
        </view>
      </view>
    </view>
    <view class="order-info">
      <view class="info-item">
        <text class="label">订单编号：</text>
        <text class="txt">{{orderInfo.order_id}}</text>
      </view>
      <view class="info-item">
        <text class="label">下单时间：</text>
        <text class="txt">{{orderInfo.createtime | formatTime}}</text>
      </view>
      <view class="info-item">
        <text class="label">支付方式：</text>
        <text class="txt">{{orderInfo.payment.app_name}}</text>
      </view>
      <view class="info-item" v-if="orderInfo.pay_status > 0">
        <text class="label">支付时间：</text>
        <text class="txt">{{orderInfo.last_modified | formatTime}}</text>
      </view>
      <view class="info-item">
        <text class="label">配送方式：</text>
        <text class="txt">{{orderInfo.shipping.shipping_name || ''}}</text>
      </view>
      <view class="info-item">
        <text class="label">期望配送时间：</text>
        <text class="txt">{{orderInfo.consignee.r_time || ''}}</text>
      </view>
    </view>
    <view class="amount-info">
      <view class="info-item">
        <text class="label">商品总额：</text>
        <text class="txt">{{orderInfo.cost_item | formatMoney}}</text>
      </view>
      <view class="info-item">
        <text class="label">运费：</text>
        <text class="txt">{{orderInfo.shipping.cost_shipping | formatMoney}}</text>
      </view>
      <view class="info-item">
        <text class="label">优惠金额：</text>
        <text class="txt">{{orderInfo.pmt_order | formatMoney}}</text>
      </view>
      <view class="info-item">
        <text class="label">积分抵扣：</text>
        <text class="txt">{{orderInfo.order_chgpointmoney | formatMoney}}</text>
      </view>
      <view class="info-item">
        <text class="label">总金额：</text>
        <text class="txt">{{orderInfo.cur_amount | formatMoney}}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderId: "",
      orderInfo: {},
      payStatusMap: {
        "0": "待付款",
        "1": "已付款",
        "2": "已付款至到担保方",
        "3": "部分付款",
        "4": "部分退款",
        "5": "全额退款"
      },
      shipStatusMap: {
        "0": "未发货",
        "1": "已发货",
        "2": "部分发货",
        "3": "部分退货",
        "4": "已退货"
      }
    };
  },
  onLoad(options) {
    let that = this;
    if (options.order_id) {
      that.orderId = options.order_id;
    }
  },
  onShow() {
    let that = this;
    that.loadData();
  },
  methods: {
    loadData() {
      let that = this;

      that.$http
        .post(that.$api.user.order, { order_id: that.orderId })
        .then(res => {
          if (res.return_code === "0000") {
            that.orderInfo = Object.assign(
              res.data.order,
              that.orderStatus(
                res.data.order.status,
                res.data.order.pay_status,
                res.data.order.ship_status
              )
            );
            console.log(res.data);
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    orderStatus(status, payStatus, shipStatus) {
      let tip = "";
      payStatus = ~~payStatus;
      shipStatus = ~~shipStatus;

      if (status === "finish") {
        tip = "订单已完成";
      } else if (status === "dead") {
        tip = "订单已取消";
      } else if (payStatus === 0) {
        tip = "订单待付款";
      } else {
        tip = `订单${that.payStatusMap[payStatus]}[${that.shipStatusMap[shipStatusMap]}]`;
      }
      return { tip };
    }
  }
};
</script>

<style lang="scss">
</style>