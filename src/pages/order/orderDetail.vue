<template>
  <view class="container">
    <view class="status-info">{{orderInfo.tip}}</view>
    <view class="addr-info">
      <view class="up">
        <text class="yticon icon-shouhuodizhi"></text>
        <text class="name">{{orderInfo.consignee.name || ''}}</text>
        <text class="mobile">{{orderInfo.consignee.mobile || ''}}</text>
      </view>
      <view class="down">{{orderInfo.consignee.addr || ''}}</view>
    </view>
    <view class="goods-list">
      <view class="goods-item" v-for="(goods, goodsIndex) in orderInfo.goods_data" :key="goods.item_id">
        <view class="left">
          <image :src="goods.pic_url"></image>
        </view>
        <view class="right">
          <view class="name">{{goods.name}}</view>
          <view class="spec">{{goods.products.spec_info || ''}}</view>
          <view class="price-nums">
            <text class="price">￥{{goods.price | formatMoney}}</text>
            <text class="nums">数量：{{goods.quantity}}</text>
          </view>
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
        <text class="txt">￥{{orderInfo.cost_item | formatMoney}}</text>
      </view>
      <view class="info-item">
        <text class="label">运费：</text>
        <text class="txt">￥{{orderInfo.shipping.cost_shipping | formatMoney}}</text>
      </view>
      <view class="info-item">
        <text class="label">优惠金额：</text>
        <text class="txt">-￥{{orderInfo.pmt_order | formatMoney}}</text>
      </view>
      <view class="info-item">
        <text class="label">积分抵扣：</text>
        <text class="txt">-￥{{orderInfo.order_chgpointmoney | formatMoney}}</text>
      </view>
      <view class="info-item">
        <text class="label">总金额：</text>
        <text class="txt">￥{{orderInfo.cur_amount | formatMoney}}</text>
      </view>
    </view>
    <view class="pay-btn" v-if="orderInfo.pay_status === '0' && orderInfo.status === 'active'">
      <view class="left">
        <text class="label">需付</text>
        <text class="amount">￥{{orderInfo.cur_amount | formatMoney}}</text>
      </view>
      <view class="right" @click="pay">去付款</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderId: "",
      orderInfo: {
        shipping: {

        }
      },
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
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    orderStatus(status, payStatus, shipStatus) {
      let that = this;
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
        tip = `订单${that.payStatusMap[payStatus]}[${that.shipStatusMap[shipStatus]}]`;
      }
      return { tip };
    },
    /**
		 * 去支付
		 */
		pay () {
      let that = this;
			uni.navigateTo({
				url: '/pages/money/pay?order_id=' + that.orderId
			});
		},
  }
};
</script>

<style lang="scss">
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 120rpx 30rpx 128rpx;
  background: $page-color-base;
  font-size: 28rpx;
  .status-info {
    position: fixed;
    top: var(--window-top);
    height: 120rpx;
    width: 100%;
    font-size:48rpx;
    font-weight:bold;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 44rpx;
    box-sizing: border-box;
    background: #ffffff;
  }
  .addr-info, .goods-list, .order-info, .amount-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 30rpx;
    background: #ffffff;
    border-radius:16rpx;
  }
  .addr-info {
    padding: 44rpx 30rpx;
    box-sizing: border-box;
    align-items: flex-start;
    .up {
      margin-bottom: 20rpx;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .name, .mobile {
        margin-left: 20rpx;
      }
    }
    .down {
      padding-left: 44rpx;
      box-sizing: border-box;
      color: $font-color-disabled;
    }
  }
  .goods-list {
    justify-content: flex-start;
    .goods-item {
      width: 100%;
      padding: 20rpx 30rpx;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .left {
        flex: none;
        image {
          width: 140rpx;
          height: 140rpx;
          border-radius: 8rpx;
        }
      }
      .right {
        flex: auto;
        margin-left: 20rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        .name {
          font-weight: bold;
          width: 100%;
        }
        .spec {
          width: 100%;
          color: $font-color-disabled;
          margin-top: 20rpx;
        }
        .price-nums {
          width: 100%;
          margin-top: 20rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .price {
            color: $uni-color-primary;
          }
        }
      }
    }
  }
  .order-info, .amount-info {
    color: $font-color-light;
    .info-item {
      width: 100%;
      padding: 30rpx 30rpx 0;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .label {
        font-weight: bold;
      }
      &:last-child {
        padding-bottom: 30rpx;;
      }
    }
  }
  .amount-info {
    .info-item {
      justify-content: space-between;
      &:last-child {
        justify-content: flex-end;
        .txt {
          font-size: 32rpx;
          color: $uni-color-primary;
        }
      }
    }
  }
  .pay-btn {
    position: fixed;
    bottom: var(--window-bottom);
    width: 100%;
    height: 98rpx;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background: #ffffff;
    .right {
      height: 100%;
      width: 280rpx;
      flex: none;
      display: flex;
      justify-content: center;
      align-items: center;
      background:linear-gradient(92deg,$uni-color-primary 0%,$uni-color-error 100%);
      color: rgba(255,255,255,1);
      font-size: 32rpx;
    }
    .left {
      height: 100%;
      flex: auto;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 36rpx;
      box-sizing: border-box;
      .amount {
        font-size: 40rpx;
        color: $uni-color-primary;
      }
    }
  }
}
</style>