<template>
  <view class="app">
    <view class="price-box">
      <text>支付金额</text>
      <text class="price">{{ orderInfo.total_amount | formatMoney }}</text>
    </view>

    <view class="pay-type-list">
      <!-- <view class="type-item b-b" @click="changePayType(1)">
				<text class="icon yticon icon-weixinzhifu"></text>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 1' />
					</radio>
				</label>
			</view>
			<view class="type-item b-b" @click="changePayType(2)">
				<text class="icon yticon icon-alipay"></text>
				<view class="con">
					<text class="tit">支付宝支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 2' />
					</radio>
				</label>
      </view>-->
      <view
        class="type-item"
        v-for="(payment, paymentIndex) in payments"
        :key="payment.app_id"
        @click.capture.stop="changePayType(paymentIndex)"
      >
        <text
          class="icon yticon"
          :class="{
            'icon-weixinzhifu': payment.app_id === 'weixinscan',
            'icon-qianbao': payment.app_id === 'deposit',
          }"
        ></text>
        <view class="con">
          <text class="tit">{{ payment.app_display_name }}</text>
          <text v-if="payment.app_id === 'deposit'">
            <text class="notice" v-if="orderInfo.total_amount > deposit"
              >余额不足，</text
            >
            可用余额 ¥{{ deposit | formatMoney }}
          </text>
        </view>
        <label class="radio">
          <radio
            :value="payment.app_id"
            :color="_radioColor(payment)"
            :checked="payment.app_id === orderInfo.payinfo.pay_app_id"
          />
        </label>
      </view>
    </view>

    <text class="mix-btn" @click="confirm">确认支付</text>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderId: "",
      orderInfo: {
        total_amount: 0.0,
      },
      availablePayments: ["weixinscan", "deposit"],
      payments: [],
      deposit: 0.0,
      paying: false,
    };
  },
  computed: {},
  onLoad(options) {
    let that = this;
    if (options.order_id) {
      that.orderId = options.order_id;
    }
  },

  onShow() {
    let that = this;
    // #ifdef H5
    if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener(
          "WeixinJSBridgeReady",
          that.onBridgeReady,
          false
        );
      } else if (document.attachEvent) {
        document.attachEvent("WeixinJSBridgeReady", that.onBridgeReady);
        document.attachEvent("onWeixinJSBridgeReady", that.onBridgeReady);
      }
    }
    // #endif
    that.loadData();
  },

  methods: {
    // #ifdef H5
    onBridgeReady() {},
    formatH5PayData(html) {
      let regex = new RegExp(
        '\\"getBrandWCPayRequest\\"\\,(.+)\\,function\\(res\\)',
        "gi"
      );
      let res = regex.exec(html);
      return res[1] ? res[1] : false;
    },
    // #endif
    _radioColor(payment) {
      let that = this;
      return payment.app_id === "deposit" &&
        that.orderInfo.total_amount > that.deposit
        ? "#C0C4CC"
        : "#fa436a";
    },
    loadData() {
      let that = this;
      that.$http
        .post(that.$api.user.pay, { order_id: that.orderId })
        .then((res) => {
          console.log(res);
          if (res.return_code === "0000") {
            that.deposit = parseFloat(res.data.deposit_money);
            that.orderInfo = res.data.order;
            that.payments = res.data.payments.filter((payment) => {
              if (that.availablePayments.indexOf(payment.app_id) === -1) {
                return false;
              }
              return true;
            });
          } else {
            console.log(res);
            that.$toast(res.error);
          }
        })
        .catch((error) => {
          console.log(error);
          that.$toast("出错啦");
        });
    },
    //选择支付方式
    changePayType(paymentIndex) {
      let that = this;
      let { app_id, app_name } = that.payments[paymentIndex];
      let orderInfo = that.orderInfo;

      if (app_id === orderInfo.payinfo.pay_app_id) {
        return false;
      }

      if (app_id === "deposit" && that.orderInfo.cur_amount > that.deposit) {
        that.$toast("可用余额不足！");
        return false;
      }

      that.$http
        .post(that.$api.user.changePayment, {
          order_id: that.orderId,
          app_id: app_id,
        })
        .then((res) => {
          if (res.return_code === "0000") {
            that.$set(that.orderInfo, "payinfo", {
              ...orderInfo.payinfo,
              pay_app_id: app_id,
              pay_name: app_name,
            });
          } else {
            console.log(res);
            that.$toast("更换失败");
          }
        })
        .catch((error) => {
          console.log(error);
          that.$toast("更换失败");
        });
    },
    //确认支付
    confirm: async function() {
      let that = this;

      if (that.paying === true) {
        return false;
      }

      if (!that.orderId) {
        return false;
      }

      if (!that.orderInfo.cur_amount) {
        return false;
      }

      if (!that.orderInfo.payinfo.pay_app_id) {
        return false;
      }

      if (
        that.orderInfo.payinfo.pay_app_id === "deposit" &&
        that.orderInfo.cur_amount > that.deposit
      ) {
        that.$toast("可用余额不足！");
        return false;
      }

      // 如果是微信支付则需要获取code

      let payData = {
        order_id: that.orderId,
        cur_money: that.orderInfo.cur_amount,
        pay_app_id: that.orderInfo.payinfo.pay_app_id,
      };

      that.paying = true;
      uni.showLoading();
      that.$http
        .post(that.$api.user.doPayment, payData)
        .then((res) => {
          that.paying = false;
          uni.hideLoading();
          console.log(res);
          if (that.orderInfo.payinfo.pay_app_id === "deposit") {
            if (res.return_code === "0000") {
              uni.redirectTo({
                url: "/pages/money/paySuccess?order_id=" + that.orderId,
              });
            } else {
              console.log(res);
              that.$toast(res.error);
            }
          }
          if (that.orderInfo.payinfo.pay_app_id === "wxpay") {
            // #ifdef H5
            let payData = that.formatH5PayData(res);
            if (payData === false) {
              that.$toast("支付失败");
            } else {
              WeixinJSBridge.invoke(
                "getBrandWCPayRequest",
                JSON.parse(payData),
                function(payRes) {
                  console.log(payRes);
                  if (payRes.err_msg == "get_brand_wcpay_request:ok") {
                    // 使用以上方式判断前端返回,微信团队郑重提示：
                    //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                  }
                }
              );
            }
            // #endif
            // #ifdef MP-WEIXIN

            // #endif
          }
        })
        .catch((error) => {
          console.log(error);
          that.paying = false;
          uni.hideLoading();
          that.$toast("支付失败");
        });
    },
  },
};
</script>

<style lang="scss">
.app {
  width: 100%;
}

.price-box {
  background-color: #fff;
  height: 265rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
  color: #909399;

  .price {
    font-size: 50rpx;
    color: #303133;
    margin-top: 12rpx;
    &:before {
      content: "￥";
      font-size: 40rpx;
    }
  }
}

.pay-type-list {
  margin-top: 20rpx;
  background-color: #fff;
  padding-left: 60rpx;

  .type-item {
    height: 120rpx;
    padding: 20rpx 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 60rpx;
    font-size: 30rpx;
    position: relative;
  }

  .icon {
    width: 100rpx;
    font-size: 52rpx;
  }
  .icon-qianbao {
    color: #fe8e2e;
  }
  .icon-weixinzhifu {
    color: #36cb59;
  }
  .icon-alipay {
    color: #01aaef;
  }
  .tit {
    font-size: $font-lg;
    color: $font-color-dark;
    margin-bottom: 4rpx;
  }
  .con {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: $font-sm;
    color: $font-color-light;
    .notice {
      color: $base-color;
    }
  }
}
.mix-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 630rpx;
  height: 80rpx;
  margin: 80rpx auto 30rpx;
  font-size: $font-lg;
  color: #fff;
  background-color: $base-color;
  border-radius: 10rpx;
  box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
}
</style>
