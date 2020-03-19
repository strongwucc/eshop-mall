<template>
  <view class="container">
    <scroll-view class="goods-scroll" v-if="goods.length > 0" scroll-y="true" @scrolltolower="loadGoods">
      <view class="goods-item" v-for="(goodsItem, goodsIndex) in goods" :key="goodsItem.goods_id">
        <view class="left"><image :src="goodsItem.image_default_url"></image></view>
        <view class="right">
          <view class="name">{{goodsItem.name}}</view>
          <view class="price">￥{{goodsItem.price | formatMoney}}</view>
          <view class="action">
            <button @click="cancelFav(goodsIndex)">取消收藏</button>
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
            that.$toast("取消成功");
            that.goods.splice(goodsIndex,1);
          } else {
            console.log(res.error);
            that.$toast("取消失败");
          }
        })
        .catch(error => {
          that.requesting = false;
          console.log(error);
          that.$toast("取消失败");
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
  .goods-scroll {
    height: 100%;
    .goods-item {
      height: 200rpx;
      padding: 20rpx;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
        padding-left: 20rpx;
        .price {
          margin-top: 20rpx;
          color: $uni-color-primary;
        }
        .action {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;

          button {
            margin: 0;
            padding: 0 10rpx;
            height: 60rpx;
            line-height: 60rpx;
            background: $font-color-disabled;
            color: $page-color-light;
            font-size: 28rpx;
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