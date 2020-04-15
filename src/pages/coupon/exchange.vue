<template>
  <view class="container">
    <view class="header">
      <text class="label">我的积分</text>
      <text class="score">{{userInfo.point || 0}}</text>
    </view>
    <view class="coupons">
      <template v-if="coupons.length > 0">
        <view class="title">您可兑换以下优惠券</view>
        <view class="items">
          <view class="item" v-for="(coupon, couponIndex) in coupons" :key="couponIndex">
            <view class="up">
              <view class="left">
                <text class="name">{{coupon.cpns_name || ''}}</text>
                <text class="notice">所需积分 <text class="red">{{coupon.cpns_point || 0}}</text></text>
                <text class="time">有效期至{{coupon.time.to_time | formatTime(1)}}</text>
              </view>
              <view class="right">
                <view class="btn" @click="exchange(coupon.cpns_id, couponIndex)">去兑换</view>
              </view>
            </view>
            <view class="down"></view>
          </view>
        </view>
      </template>
      <view v-else class="empty">尚无可兑换的优惠券</view>
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import empty from "@/components/empty";
export default {
  components: { empty },
  data() {
    return {
      usage: 0,
      coupons: [],
      requesting: false
    };
  },
  computed: {
    ...mapState(["userInfo"])
  },
  onLoad(options) {
    let that = this;
    that.getExchangeCoupons();
  },
  onShow() {},
  methods: {
    ...mapMutations(['setUser']),
    /**
     * 获取可兑换优惠券
     */
    getExchangeCoupons() {
      let that = this;
      that.$http
        .post(that.$api.user.couponExchange)
        .then(res => {
          if (res.return_code === "0000") {
            that.usage = ~~res.data.site_point_usage;
            that.coupons = that.coupons.concat(res.data.list);
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 兑换优惠券
     */
    exchange(cpnsId, couponIndex) {
      let that = this;
      if (that.requesting === true) {
        return false;
      }

      that.requesting = true;
      uni.showLoading();
      that.$http
        .post(that.$api.user.exchange, { cpnsId: cpnsId })
        .then(res => {
          that.requesting = false;
          uni.hideLoading();
          if (res.return_code === "0000") {
            that.setUser(Object.assign({}, that.userInfo, {point: that.userInfo.point - that.coupons[couponIndex].cpns_point}));
            that.$toast("兑换成功");
          } else {
            that.$toast(res.error);
          }
        })
        .catch(error => {
          that.requesting = false;
          uni.hideLoading();
          that.$toast("兑换失败");
        });
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
  background-color: $page-color-base;
  @extend %flex-center;
  justify-content: flex-start;
  font-size: 28rpx;
}
.header {
  flex: none;
  height: 240rpx;
  background: rgba(255, 255, 255, 1);
  width: 100%;
  @extend %flex-center;
  .label {
    color: $font-color-disabled;
  }
  .score {
    font-size: 60rpx;
    font-weight: 500;
    margin-top: 20rpx;
  }
}
.coupons {
  width: 100%;
  flex: auto;
  padding: 40rpx 30rpx 0;
  box-sizing: border-box;
  @extend %flex-center;
  justify-content: flex-start;
  position: relative;
  .title {
    flex: none;
    font-weight: bold;
    width: 100%;
    padding-bottom: 40rpx;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .items {
    flex: auto;
    width: 100%;
    @extend %flex-center;
    justify-content: flex-start;
    .item {
      font-size: 24rpx;
      background-color: #ffffff;
      width: 100%;
      padding: 30rpx 20rpx 12rpx 30rpx;
      box-sizing: border-box;
      border-radius: 16rpx;
      margin-bottom: 20rpx;
      .up { 
        display: flex;
        justify-content: space-around;
        align-items: center;
        .left {
          flex: auto;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          >text {
            width: 100%;
            text-align: left;
          }
          .name {
            font-size: 32rpx;
            font-weight: bold;
          }
          .notice {
            margin-top: 20rpx;
            // color: $base-color;
            .red {
              // color: $base-color;
            }
          }
          .time {
            margin-top: 10rpx;
          }
        }
        .right {
          flex: none;
          padding: 0 10rpx;
          box-sizing: border-box;
          .btn {
            width: 140rpx;
            height: 52rpx;
            background: $base-color;
            border-radius: 60rpx;
            color: #ffffff;
            @extend %flex-center;
          }
        }
      }
    }
  }
  .empty {
    height: 100%;
    @extend %flex-center;
    color: $font-color-disabled;
  }
}
</style>