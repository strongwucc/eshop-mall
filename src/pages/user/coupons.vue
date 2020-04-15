<template>
  <view class="container">
    <scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadCoupons">
      <empty v-if="loaded === true && coupons.length === 0"></empty>
      <view class="coupon-item" v-for="(coupon, couponIndex) in coupons" :key="coupon.cpns_id">
        <view class="up">
          <view class="left">
            <text class="name">{{coupon.coupons_info.cpns_name || ''}}</text>
            <text class="notice">优惠券码： <text class="red">{{coupon.memc_code || ''}}</text></text>
            <text class="time">有效期至：{{coupon.time.to_time|formatTime(1)}}</text>
          </view>
          <view class="right">
            <view class="btn disabled" v-if="coupon.time.to_time < now">已过期</view>
            <view class="btn" @click="useCoupon" v-else-if="~~coupon.memc_used_times === 0">去使用</view>
            <view class="btn disabled" v-else-if="coupon.memc_used_times > 0">已使用</view>
          </view>
        </view>
        <view class="down"></view>
      </view>
      <uni-load-more :status="loadingType"></uni-load-more>
    </scroll-view>
  </view>
</template>

<script>
import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
import empty from "@/components/empty";
export default {
  components: {
    uniLoadMore,
    empty
  },
  data() {
    return {
      coupons: [],
      page: 1,
      loadingType: "more",
      loaded: false,
      now: Date.parse(new Date()).toString().substring(0, 10)
    };
  },
  onLoad(options) {},
  onShow() {
    let that = this;
    that.loadCoupons();
  },
  methods: {
    /**
     * 获取优惠券
     */
    loadCoupons() {
      let that = this;
      if (that.loadingType === 'noMore') {
        return false;
      }
      that.loadingType = "loading";
      that.$http
        .post(that.$api.user.coupons, { page: that.page })
        .then(res => {
          that.loaded = true;
          if (res.return_code === "0000") {
            if (res.data.length > 0) {
              that.coupons = that.coupons.concat(res.data);
              that.page = that.page + 1;
              that.loadingType = 'more';
            } else {
              that.loadingType = 'noMore';
            }
          } else {
            that.loadingType = "more";
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    useCoupon () {
      let that = this;
      uni.switchTab({
        url: '/pages/index/index'
      });
    }
  }
};
</script>

<style lang="scss">
page {
  height: 100%;
}
%flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.container {
  height: 100%;
  padding: 20rpx;
  box-sizing: border-box;
  background: $page-color-base;
  .list-scroll-content {
    height: 100%;
    .coupon-item {
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
            &.disabled {
              background-color: $font-color-disabled;
            }
          }
        }
      }
    }
  }
}
</style>