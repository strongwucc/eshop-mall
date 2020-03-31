<template>
  <view class="container">
    <view class="status">
      <text class="title">{{detail.status || ''}}</text>
      <template v-if="detail.comment">
        <text class="content" v-for="(comment, commentIndex) in detail.comment" :key="comment.time">{{comment.content}}</text>
      </template>
    </view>
    <view class="goods">
      <view class="goods-item" v-for="(product, productIndex) in detail.product_data" :key="product.bn">
        <view class="left">
          <image :src="product.image_url" mode="aspectFit"></image>
        </view>
        <view class="right">
          <view class="name">{{_getName(product.name)}}</view>
          <view class="spec">{{_getSpecFromName(product.name)}}</view>
          <view class="price-nums">
            <text class="price">￥{{product.price | formatMoney}}</text>
            <text class="nums">x{{product.num || 0}}</text>
          </view>
        </view>
      </view >
    </view>
    <view class="order">
      <view class="order-item order-id">
        <text class="label">订单号</text>
        <text class="content">{{detail.order_id}}</text>
        <text class="yticon icon-shang" v-show="showDetail" @click="toggleShowDetail"></text>
        <text class="yticon icon-xia" v-show="!showDetail" @click="toggleShowDetail"></text>
      </view>
      <view class="order-item">
        <text class="label">申请时间</text>
        <text class="content">{{detail.add_time | formatTime}}</text>
      </view>
      <view class="order-item">
        <text class="label">退换类型</text>
        <text class="content">{{_getType(detail.type)}}</text>
      </view>
      <view class="detail-container" v-show="showDetail">
        <view class="order-item">
          <text class="label">退换理由</text>
          <text class="content">{{detail.title}}</text>
        </view>
        <view class="order-item">
          <text class="label">退换描述</text>
          <text class="content detail-content">{{detail.content}}退换描述退换描述退换描述退换描述退换描述退换描述退换描述退换描述退换描述退换描述退换描述退换描述退换描述退换描述</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      returnId: '',
      detail: {
        product_data: []
      },
      showDetail: false
    };
  },
  onLoad(options) {
    let that = this;
    that.returnId = options.returnId || '';
  },
  onShow() {
    let that = this;
    that.loadDetail();
  },
  methods: {
    _getType (type) {
      let maps = {
        1: '换货',
        2: '退货'
      };

      return maps[~~type] || '';
    },
    _getName (name) {
      let reg = new RegExp("(.+)\\(", "i");
      return reg.exec(name)[1] || '';
    },
    _getSpecFromName (name) {
      let reg = new RegExp("\\((.+)\\)", "i");
      return reg.exec(name)[1] || '';
    },
    loadDetail () {
      let that = this;
      that.$http.post(that.$api.user.returnDetail, {return_id: that.returnId}).then(res => {
        if (res.return_code === '0000') {
          console.log(res.data);
          that.detail = Object.assign({}, that.detail, res.data.return_item);
        } else {
          console.log(res);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    toggleShowDetail () {
      let that = this;
      that.showDetail = !that.showDetail;
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
  background: $page-color-base;
  padding: 20rpx 30rpx;
  box-sizing: border-box;
  font-size: 28rpx;
  .status, .goods, .order {
    background: rgba(255, 255, 255, 1);
    border-radius: 16rpx;
    padding: 40rpx 30rpx;
    box-sizing: border-box;
  }
  .status {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    .title {
      color: $base-color;
      font-size: 36rpx;
      font-weight: bold;
    }
    .content {
      margin-top: 10rpx;
      color: $font-color-light;
    }
  }
  .goods {
    margin-top: 20rpx;
    .goods-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        flex: none;
        image {
          width: 200rpx;
          height: 200rpx;
        }
      }
      .right {
        flex: auto;
        min-height: 200rpx;
        margin-left: 20rpx;
        .name {
          height: 76rpx;
          overflow: hidden;
        }
        .spec {
          margin-top: 10rpx;
          font-size: 24rpx;
          color: $font-color-light;
        }
        .price-nums {
          margin-top: 34rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .price {
            font-size: 32rpx;
          }
          .nums {
            font-size: 24rpx;
            color: $font-color-light;
          }
        }
      }
    }
  }
  .order {
    padding-bottom: 0;
    margin-top: 20rpx;
    font-size: 26rpx;
    .order-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      min-height: 74rpx;
      border-bottom: 26rpx;
      .label {
        width: 104rpx;
        flex: none;
        text-align: left;
        color: $font-color-light;
      }
      .content {
        flex: auto;
        text-align: left;
        margin-left: 48rpx;
      }
    }
    .detail-container {
      .detail-content {
        padding-bottom: 40rpx;
        box-sizing: border-box;
      }
    }
  }
}
</style>