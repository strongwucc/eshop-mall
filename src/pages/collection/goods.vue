<template>
  <view class="container">
    <scroll-view class="goods-scroll" v-if="goods.length > 0" scroll-y="true" @scrolltolower="loadGoods">
      <view class="goods-item" v-for="(goodsItem, goodsIndex) in goods" :key="goodsItem.goods_id" @click="goodsDetail(goodsItem.product_id)">
        <view class="left"><image :src="goodsItem.image_default_url"></image></view>
        <view class="right">
          <view class="name">{{goodsItem.name}}</view>
          <view class="action">
            <text class="price">￥{{goodsItem.price | formatMoney}}</text>
            <text class="yticon icon-shoucang2" @click.stop="cancelFav(goodsIndex)"></text>
          </view>
        </view>
      </view>
      <uni-load-more :status="loading"></uni-load-more>
    </scroll-view>
    <view class="empty" v-else-if="loaded && goods.length === 0">没有收藏商品哦~</view>
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
      goods: [],
      currentPage: 1,
      loading : "more",
      loaded: false,
      requesting: false
    };
  },
  onLoad(options) {},
  onShow() {
    let that = this;
    that.loadGoods();
  },
  methods: {
    /**
     * 收藏商品
     */
    loadGoods(e) {
      let that = this;
      if (that.loading !== 'more') {
        return false;
      }
      that.loading = 'loading';
      that.$http
        .post(that.$api.user.favs, { page: that.currentPage })
        .then(res => {
          that.loaded = true;
          console.log(res);
          if (res.return_code === "0000") {
            that.goods = that.goods.concat(res.data.favorite);
            if (res.data.pager.current >= res.data.pager.total) {
              that.loading = 'noMore';
            } else {
              that.loading = 'more';
              that.currentPage = that.currentPage + 1;
            }
          } else {
            that.loading = 'more';
            console.log(res);
          }
        })
        .catch(error => {
          that.loading = 'more'
          console.log(error);
        });
    },
    /**
     * 取消收藏
     */
    cancelFav(goodsIndex) {

      let that = this;
      if (that.requesting) {
        return false;
      }

      let goodsId = that.goods[goodsIndex].goods_id;

      that.requesting = true;

      that.$http
        .post(that.$api.user.removeFav, { gid: goodsId, type: "goods" })
        .then(res => {
          that.requesting = false;
          if (res.return_code === "0000") {
            that.$toast("已取消收藏");
            that.goods.splice(goodsIndex,1);
          } else {
            console.log(res.error);
            that.$toast("取消收藏失败");
          }
        })
        .catch(error => {
          that.requesting = false;
          console.log(error);
          that.$toast("取消收藏失败");
        });
    },
    /**
     * 商品详情
     */
    goodsDetail (productId) {
      uni.navigateTo({
        url: `/pages/product/product?id=${productId}`
      })
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
  background-color: $page-color-base;
  .goods-scroll {
    height: 100%;
    padding: 30rpx 30rpx 0;
    .goods-item {
      background-color: #ffffff;
      height: 200rpx;
      border-radius:24rpx;
      padding: 20rpx;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20rpx;
      .left {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex: none;
        image {
          width: 160rpx;
          height: 160rpx;
        }
      }
      .right {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        flex: auto;
        padding-left: 30rpx;
        box-sizing: border-box;
        font-size: 28rpx;
        .name {
          display: -webkit-box;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .action {
          width: 100%;
          margin-top: 74rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .price {
            font-size: 32rpx;
            font-weight: 500;
            color: $base-color;
          }
          .icon-shoucang2 {
            font-size: 32rpx;
            color: $base-color;
            width: 48rpx;
            height: 48rpx;
            line-height: 48rpx;
            text-align: center;
          }
        }
      }
    }
  }
  .empty {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>