<template>
  <view class="container">
    <view class="goods">
      <view class="left"><image :src="goodsData.image_default_url" mode="aspectFit"></image></view>
      <view class="right">
        <view class="name">{{goodsData.name || ''}}</view>
        <view class="spec" v-if="goodsData.spec_info">{{goodsData.spec_info}}</view>
        <view class="price-nums">
          <text class="price">￥{{goodsData.price | formatMoney}}</text>
          <text class="nums">x{{goodsData.number}}</text>
        </view>
      </view>
    </view>
    <view class="comments">
      <view class="title">评论</view>
      <view class="comment">
        <text class="yticon icon-huifu"></text>
        <textarea :value="comment" placeholder="欢迎发表宝贵评论，给其他小伙伴参考~" @input="commentInput"></textarea>
      </view>
      <view class="info">
        <text class="yticon icon-xuanzhong2" :class="{active: hiddenName}" @click="toggleHiddenName"></text>
        <text class="label">匿名评价</text>
        <text class="counter">
          <text class="current">{{commentCounter}}</text>
          <text class="total">/1000</text>
        </text>
      </view>
    </view>
    <view class="rates">
      <view class="title">评分</view>
      <view class="rate">
        <view class="rate-item" v-for="(typeItem, typeIndex) in goodsData.pointType" :key="typeItem.type_id">
          <text class="label">{{typeItem.name}}</text>
          <uni-rate class="rate-component" active-color="#fa436a" size="20" :custom-key="typeIndex" :value="5" max="5" @change="rateChange()"></uni-rate>
        </view>
      </view>
    </view>
    <view class="btn-padding"></view>
    <view class="btn">发表评论</view>
  </view>
</template>

<script>
import uniRate from '@/components/uni-rate/uni-rate.vue'
export default {
  components: {
    uniRate
  },
  data() {
    return {
      goodsData: {
        price: 0
      },
      comment: '',
      hiddenName: false
    };
  },
  computed: {
    commentCounter () {
      let that = this;
      return that.comment.length; 
    }
  },
  onLoad(options) {},
  onShow() {
    let that = this;
    try {
      let commentData = JSON.parse(uni.getStorageSync("comment"));
      if (commentData) { 
        that.goodsData = commentData;
      } else {
        that.$toast('出错啦!');
      }
    } catch (e) {
      that.$toast('出错啦!');
    }
  },
  methods: {
    toggleHiddenName () {
      let that = this;
      that.hiddenName = !that.hiddenName;
    },
    rateChange (e) {
      console.log(e);
      let that = this;
      that.$set(that.goodsData.pointType[e.key], 'value', e.value);
    },
    commentInput (e) {
      let that = this;
      let comment = e.detail.value;
      if (comment.length > 1000) {
        comment = comment.substring(0, 1000);
      }
      setTimeout(function () {
        that.comment = comment;
      }, 0);
    }
  }
};
</script>

<style lang="scss">
.container {
  background: $page-color-base;
  padding-top: 20rpx;
  font-size: 28rpx;
}
.goods, .comments, .rates {
  background: #ffffff;
}
.goods {
  padding: 30rpx;
  box-sizing: border-box;
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
    margin-left: 20rpx;
    flex: auto;
    min-height: 200rpx;
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
      margin-top: 36rpx;
      .price {
        font-weight: bold;
      }
      .nums {
        margin-left: 30rpx;
        font-size: 24rpx;
        color: $font-color-light;
      }
    }
  }
}
.comments, .rates {
  margin-top: 20rpx;
  padding: 0 0 30rpx 30rpx;
  box-sizing: border-box;
  .title {
    height: 92rpx;
    line-height: 92rpx;
    font-size: 32rpx;
    font-weight: bold;
    border-bottom: 1px solid $border-color-light;
  }
  .comment {
    padding: 30rpx 0;
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .icon-huifu {
      align-self: flex-start;
    }
    textarea {
      margin-left: 10rpx;
    }
  }
  .info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    text {
      flex: none;
      &.icon-xuanzhong2 {
        font-size: 48rpx;
        &.active {
          color: $uni-color-primary;
        }
      }
      &.label {
        margin-left: 10rpx;
      }
      &.counter {
        flex: auto;
        margin-right: 30rpx;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .total {
          color: $font-color-light;
        }
      }
    }
  }
  .rate {
    .rate-item {
      margin-top: 40rpx;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .label {
        margin-right: 10rpx;
      }
      .rate-component {
        margin-top: 10rpx;
      }
    }
  }
}
.btn-padding {
  height: 142rpx;
  width: 100%;
}
.btn {
  position: fixed;
  bottom: var(--window-bottom);
  height: 98rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  background: $base-color;
  color: #ffffff;
  font-size: 32rpx;
  font-weight: bold;
}
</style>