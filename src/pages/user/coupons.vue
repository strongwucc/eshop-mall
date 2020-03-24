<template>
  <view class="container">
    <scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadCoupons">
      <empty v-if="loaded === true && coupons.length === 0"></empty>
      <view class="coupon-item" v-for="(coupon, couponIndex) in coupons" :key="coupon.cpns_id">
        <view class="left">
          <text class="title">{{coupon.coupons_info.cpns_name}}</text>
          <text class="code">优惠券码：{{coupon.memc_code}}</text>
          <text class="time">有效期至：{{coupon.time.to_time|formatTime(1)}}</text>
        </view>
        <view class="right">
          <text class="unused" v-if="coupon.memc_used_times === '0'" >可使用</text>
          <text class="used" v-else>已使用</text>
        </view>
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
      loaded: false
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
    }
  }
};
</script>

<style lang="scss">
page {
  height: 100%;
}
.container {
  height: 100%;
  padding: 20rpx;
  box-sizing: border-box;
  background: $page-color-base;
  .list-scroll-content {
    height: 100%;
    .coupon-item {
      background: #ffffff;
      margin-bottom: 20rpx;
      padding: 20rpx;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        flex: auto;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        text {
          width: 100%;
          height: 60rpx;
          line-height: 60rpx;
          text-align: left;
          &.title {
            font-weight: bold;
          }
        }
      }
      .right {
        flex: none;
        display: flex;
        justify-content: center;
        align-items: center;
        .unused {
          color: $uni-color-success;
        }
        .used {
          color: $font-color-disabled;
        }
      }
    }
  }
}
</style>