<template>
  <view class="container">
    <view class="header">
      <view class="avatar">
        <image src="/static/avatar_default@2x.png"></image>
      </view>
      <view class="userinfo">
        <view class="up">
          <text class="name">小小小茜</text>
          <button class="goods">分享商品</button>
        </view>
        <view class="down">
          <text class="yticon"></text>
          <text class="mobile">189***5458</text>
        </view>
      </view>
    </view>
    <view class="columns">
      <view class="navs">
        <view class="nav-item">
          <text class="yticon"></text>
          <text class="txt">提现</text>
        </view>
        <view class="nav-item">
          <text class="yticon"></text>
          <text class="txt">订单</text>
        </view>
      </view>
      <view class="today">
        <view class="title">今日</view>
        <view class="items">
          <view class="item">
            <text class="value">0.00</text>
            <text class="label">今日收益(元)</text>
          </view>
          <view class="item">
            <text class="value">0</text>
            <text class="label">今日订单</text>
          </view>
          <view class="item">
            <text class="value">0.00</text>
            <text class="label">今日销售(元)</text>
          </view>
        </view>
      </view>
      <view class="total">
        <view class="title">累计</view>
        <view class="items">
          <view class="item">
            <text class="value">0.00</text>
            <text class="label">累计收益(元)</text>
          </view>
          <view class="item">
            <text class="value">0</text>
            <text class="label">累计订单</text>
          </view>
          <view class="item">
            <text class="value">0.00</text>
            <text class="label">累计销售(元)</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onLoad(options) {},
  onShow() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  background-color: $page-color-base;
  font-size: 28rpx;
  color: $font-color-gray;
}
.header {
  height: 320rpx;
  background: linear-gradient(
    134deg,
    rgba(255, 131, 106, 1) 0%,
    rgba(255, 61, 61, 1) 100%
  );
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 60rpx 40rpx 0 30rpx;
  box-sizing: border-box;
  .avatar,
  .userinfo {
    display: flex;
  }
  .avatar {
    flex: none;
    justify-content: center;
    align-items: center;
    image {
      width: 120rpx;
      height: 120rpx;
      border-radius: 25%;
    }
  }
  .userinfo {
    flex: auto;
    flex-direction: column;
    color: #ffffff;
    .up {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 34rpx;
      box-sizing: border-box;
      .name {
        font-size: 40rpx;
        font-weight: bold;
      }
      .goods {
        width: 160rpx;
        height: 60rpx;
        background: rgba(255, 255, 255, 1);
        border-radius: 32rpx;
        line-height: 60rpx;
        font-size: 28rpx;
        color: $base-color;
        padding: 0 24rpx;
        margin: 0;
      }
    }
    .down {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: 20rpx;
      padding-left: 26rpx;
      box-sizing: border-box;
      .yticon {
        width: 36rpx;
        height: 36rpx;
        margin-right: 4rpx;
      }
    }
  }
}
.columns {
  margin-top: -82rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0 30rpx;
  box-sizing: border-box;
  font-size: 24rpx;
  color: $font-color-gray;
  > view {
    background-color: #ffffff;
    width: 100%;
    margin-bottom: 20rpx;
    border-radius: 16rpx;
  }
  .navs {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 36rpx 0;
    box-sizing: border-box;
    .nav-item {
      flex: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .yticon {
        width: 64rpx;
        height: 64rpx;
      }
      .txt {
        margin-top: 10rpx;
      }
    }
    &::after {
      content: "";
      width: 2rpx;
      height: 60rpx;
      background-color: $page-color-base;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
    }
  }
  .today,
  .total {
    padding-left: 32rpx;
    box-sizing: border-box;
    .title {
      height: 82rpx;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: $font-color-dark;
      border: 1rpx solid $page-color-base;
      font-weight: bold;
    }
    .items {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      padding: 56rpx 0 60rpx;
      box-sizing: border-box;
      .item {
        flex: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .value {
          font-size: 36rpx;
          height: 64rpx;
          font-weight: 500;
          color: $font-color-dark;
        }
        .txt {
          margin-top: 10rpx;
        }
      }
    }
  }
}
</style>