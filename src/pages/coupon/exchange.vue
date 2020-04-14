<template>
  <view class="container">积分兑换优惠券</view>
</template>

<script>
export default {
  data() {
    return {
      usage: 0,
      coupons: [],
      requesting: false
    };
  },
  onLoad(options) {
    let that = this;
    that.getExchangeCoupons();
  },
  onShow() {},
  methods: {
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
    exchange(cpnsId) {
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
</style>