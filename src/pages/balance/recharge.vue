<template>
  <view class="container">
    <view class="header">
      <view class="title">您当前余额</view>
      <view class="advance">￥{{(userInfo.advance || 0) | formatMoney}}</view>
    </view>
    <view class="content">
      <view class="title">充值</view>
      <view class="items">
        <view
          class="item"
          v-for="(face, faceIndex) in faceValues"
          :key="face.faceId"
          :class="{active: face.selected}"
          @click="selectFace(faceIndex)"
        >
          <view class="face">{{face.faceValue}}元</view>
          <view class="amount">售价：{{face.faceAmount}}元</view>
        </view>
      </view>
    </view>
    <!-- #ifdef MP-WEIXIN -->
    <view class="btn" @click="minappPay">立即充值</view>
    <!-- #endif -->
    <!-- #ifndef MP-WEIXIN -->
    <view class="btn" @click="h5Pay">立即充值</view>
    <!-- #endif -->
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      faceValues: [
        {
          faceId: 1,
          faceAmount: 9,
          faceValue: 10,
          selected: true
        },
        {
          faceId: 2,
          faceAmount: 199,
          faceValue: 200,
          selected: false
        },
        {
          faceId: 3,
          faceAmount: 299,
          faceValue: 300,
          selected: false
        },
        {
          faceId: 4,
          faceAmount: 999,
          faceValue: 1000,
          selected: false
        }
      ],
      requesting: false,
      providerList: [],
      paying: false
    };
  },

  computed: {
    ...mapState(["userInfo"])
  },

  onLoad(options) {
    // #ifdef APP-PLUS
    let that = this;
    uni.getProvider({
      service: "payment",
      success: e => {
        console.log("payment success:" + JSON.stringify(e));
        let providerList = [];
        e.provider.map(value => {
          switch (value) {
            case "alipay":
              providerList.push({
                name: "支付宝",
                id: value,
                loading: false
              });
              break;
            case "wxpay":
              providerList.push({
                name: "微信",
                id: value,
                loading: false
              });
              break;
            default:
              break;
          }
        });
        that.providerList = providerList;
      },
      fail: e => {
        console.log("获取支付通道失败：", e);
      }
    });
    // #endif
  },

  onShow() {
    // #ifndef MP-WEIXIN
    let that = this;
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
  },

  methods: {
    // #ifdef MP-WEIXIN
    minappPay() {
      let that = this;
      that.$toast("暂不支持");
    },
    // #endif
    // #ifndef MP-WEIXIN
    onBridgeReady() {},
    formatH5PayData(html) {
      let regex = new RegExp(
        '\\"getBrandWCPayRequest\\"\\,(.+)\\,function\\(res\\)',
        "gi"
      );
      let res = regex.exec(html);
      return res[1] ? res[1] : false;
    },
    h5Pay() {
      let that = this;

      if (that.paying === true) {
        return false;
      }

      let money = 0;

      if (
        !that.faceValues.some(face => {
          if (face.selected) {
            money = face.faceValue;
            return true;
          }
          return false;
        })
      ) {
        that.$toast("请选择充值面额");
        return false;
      }

      let payData = {
        pay_object: "recharge",
        return_url: window.location.href,
        money: money,
        pay_app_id: "wxpay"
      };

      that.paying = true;
      uni.showLoading();
      that.$http
        .post(that.$api.user.doPayment, payData)
        .then(res => {
          that.paying = false;
          uni.hideLoading();
          console.log(res);
          let payData = that.formatH5PayData(res);
          if (payData === false) {
            that.$toast("充值失败");
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
        })
        .catch(error => {
          console.log(error);
          that.paying = false;
          uni.hideLoading();
          that.$toast("充值失败");
        });
    },
    // #endif
    selectFace(faceIndex) {
      let that = this;
      let newFaces = that.faceValues.map((face, index) => {
        if (index === faceIndex) {
          face.selected = true;
        } else {
          face.selected = false;
        }
        return face;
      });
      that.faceValues = newFaces;
    },
    doRecharge() {
      let that = this;
      if (that.requesting) {
        return false;
      }

      let faceId = 0;
      let amount = 0;

      if (
        !that.faceValues.some(face => {
          if (face.selected) {
            faceId = face.faceId;
            amount = face.faceAmount;
            return true;
          }
          return false;
        })
      ) {
        that.$toast("请选择充值面值");
        return false;
      }

      that.requesting = true;
      uni.showLoading();

      setTimeout(function() {
        uni.hideLoading();
        that.requesting = false;
      }, 2000);
    }
  }
};
</script>

<style lang="scss">
%flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.container {
  height: 100%;
  @extend %flex-center;
  justify-content: flex-start;
  font-size: 28rpx;
}
.header {
  flex: none;
  height: 240rpx;
  width: 100%;
  padding: 20rpx 28rpx 46rpx;
  box-sizing: border-box;
  border-bottom: 1rpx solid $border-color-light;
  .title {
    color: $font-color-disabled;
  }
  .advance {
    font-size: 60rpx;
    font-weight: 500;
    margin-top: 20rpx;
  }
}
.content {
  width: 100%;
  flex: auto;
  padding-top: 60rpx;
  .title {
    font-size: 32rpx;
    font-weight: bold;
    padding: 0 28rpx;
    box-sizing: border-box;
  }
  .items {
    padding-top: 6rpx;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    .item {
      width: 330rpx;
      height: 134rpx;
      background: rgba(247, 247, 247, 1);
      border-radius: 16rpx;
      @extend %flex-center;
      margin: 28rpx 28rpx 0 0;
      &:nth-child(2n) {
        margin-right: 0;
      }
      .face {
        font-size: 36rpx;
        font-weight: 500;
      }
      .amount {
        font-size: 24rpx;
        color: $font-color-disabled;
        margin-top: 12rpx;
      }
      &.active {
        background: rgba(255, 255, 255, 1);
        border: 1rpx solid rgba(225, 166, 112, 1);
        color: rgba(225, 166, 112, 1);
        .amount {
          color: rgba(225, 166, 112, 1);
        }
      }
    }
  }
}
.btn {
  flex: none;
  width: 690rpx;
  height: 88rpx;
  background: rgba(225, 166, 112, 1);
  border: 2rpx solid rgba(0, 0, 0, 0);
  border-radius: 88rpx;
  @extend %flex-center;
  color: #ffffff;
  margin-bottom: 60rpx;
}
</style>