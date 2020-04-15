<template>
  <view class="container">
    <view class="header">
      <!-- <view class="explain" @click="toggleRuleMask">积分说明</view> -->
      <view class="btn" @click="exchangeCoupon">积分兑换</view>
      <view class="label">
        <!-- <text class="line"></text> -->
        <text class="txt">我的积分</text>
        <!-- <text class="line"></text> -->
      </view>
      <view class="score">{{total}}</view>
      <!-- <view class="label">
        <text class="line"></text>
        <text class="txt">我的积分</text>
        <text class="line"></text>
      </view> -->
    </view>
    <view class="title">积分交易明细</view>
    <view class="records">
      <scroll-view class="records-scroll" :scroll-y="true" :lower-threshold="1" @scrolltolower="getRecords" v-if="records.length > 0">
        <view class="record-item" v-for="(item, itemIndex) in records" :key="item.log_id">
          <view class="left">
            <view class="title">{{item.reason}}</view>
            <view class="time">交易时间：{{item.addtime | formatTime(1)}}</view>
          </view>
          <view class="right">
            <text>{{item.change_point}}</text>
          </view>
        </view>
      </scroll-view>
      <view class="empty" v-else>还没有积分纪录哦~</view>
    </view>
    <!-- 积分规则面板 -->
		<view class="mask" :class="ruleMaskState===0 ? 'none' : ruleMaskState===1 ? 'show' : ''" @click="toggleRuleMask">
			<view class="mask-content" @click.stop.prevent="stopPrevent">
				<!-- 积分规则面板 -->
        <view class="title">积分说明</view>
        <view class="content">
          <view class="content-item">
            <text class="label">积分规则：</text>
            <text class="rule">消费1元获得1积分</text>
          </view>
          <view class="content-item">
            <text class="label">积分抵扣：</text>
            <text class="rule">100积分抵扣1元消</text>
          </view>
        </view>
			</view>
      <view class="mask-close" @click="toggleRuleMask">X</view>
		</view>
  </view>
</template>

<script>
export default {
  
  data () {
    return {
      total: 0.00,
      records: [],
      currentPage: 1,
      totalPage: 0,
      hasMore: true,
      ruleMaskState: 0
    }
  },

  computed: {
  },

  onLoad (options) {

  },

  onShow () {
    let that = this;
    that.getRecords();
  },

  methods: {
    /**
     * 查询余额使用记录
     */
    getRecords() {
      let that = this;
      if (that.hasMore === false) {
        return false;
      }
      that.$http.post(that.$api.user.integralRecords, {page: that.currentPage}).then(res => {
        if (res.return_code === '0000') {
          that.records = that.records.concat(res.data.historys);
          that.total = res.data.total;
          that.totalPage = res.data.pager.total;
          if (res.data.pager.current >= res.data.pager.total) {
            that.hasMore = false;
          } else {
            that.currentPage = ~~ res.data.pager.current + 1;
          }
        } else {
          console.log(res);
        }
      }).catch(error => {
        console.log(error);
      });
    },
    /**
     * 查看规则
     */
    toggleRuleMask () {
      let that = this;
      let state = that.ruleMaskState ? 0 : 1;
      that.ruleMaskState = 2;
      setTimeout(function () {
        that.ruleMaskState = state;
      }, 200);

    },
    stopPrevent () {},
    exchangeCoupon () {
      let that = this;
      uni.navigateTo({
        url: '/pages/coupon/exchange'
      });
    }
  },

}
</script>

<style lang="scss">
page {
  background: $page-color-base;
  height: 100%;
}
.container {
  height: 100%;
  font-size: 28rpx;
  color: $font-color-dark;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .header {
    flex: none;
    width: 690rpx;
    height: 300rpx;
    margin: 30rpx auto;
    background: $base-color;
    box-shadow: 0px 12rpx 30rpx $base-color;
    border-radius: 32rpx;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    text-align: center;
    .explain {
      align-self: flex-end;
      padding: 21rpx 26rpx;
      box-sizing: border-box;
    }
    .btn {
      width:160rpx;
      height:56rpx;
      line-height: 56rpx;
      background:rgba(255,255,255,1);
      border-radius:30rpx;
      font-size:28rpx;
      color:$base-color;
      align-self: flex-end;
      margin: 40rpx 40rpx 0 0;
    }
    .score,
    .label {
      margin-left: 62rpx;
    }
    .score {
      font-size: 76rpx;
      margin-top: 24rpx;
      color: #ffffff;
    }
    .label {
      // margin-top: 15rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      color:rgba(255,255,255,.7);
      .txt {
        margin: 0 11rpx;
      }
      .line {
        width:34rpx;
        height:1px;
        background:$page-color-base;
      }
    }
  }
  >.title {
    flex: none;
    height: 80rpx;
    width: 100%;
    padding: 0 28rpx;
    box-sizing: border-box;
    line-height: 80rpx;
  }

  .records {
    width: 100%;
    height: 100rpx;
    flex: auto;
    background-color: #ffffff;
    .records-scroll {
      height: 100%;
      .record-item {
        height: 159rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 28rpx;
        box-sizing: border-box;
        border-bottom: $page-color-base 1rpx solid;
        .left {
          display: flex;
          flex-direction: column;
          align-items: left;
          justify-content: center;
          .title {
            font-size:30rpx;
          }
          .time {
            font-size:22rpx;
            color: $font-color-disabled;
            margin-top: 10rpx;
          }
        }
        .right {
          font-size: 38rpx;
          color: $uni-color-primary;
        }
      }
    }
    .empty {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: $font-color-disabled;
    }
  }

  .mask {
    position: fixed;
    top: var(--window-top);
    bottom: 0;
    width: 100%;
    background: rgba(0,0,0,0);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9995;
    transition: .3s;
    &.none {
      display: none;
    }
    &.show {
      background: rgba(0,0,0,.4);
      .mask-content {
        transform: scale(1);
      }
    }
    .mask-content {
      width: 559rpx;
      height: 350rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      background: #ffffff;
      transition: .1s;
      transform: scale(0);
      .title {
        flex: none;
        width: 100%;
        height: 74rpx;
        background: $uni-color-primary;
        opacity: 1;
        border-radius: 8rpx 8rpx 0rpx 0rpx;
        font-size:32rpx;
        line-height:74rpx;
        text-align: center;
      }
      .content {
        flex: auto;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .content-item {
          margin-bottom: 16rpx;
          .label {
            color: $uni-color-primary;
          }
        }
      }
    }
    .mask-close {
      margin-top: 56rpx;
      width: 68rpx;
      height: 68rpx;
      background: $font-color-light;
      border-radius: 50%;
      color: $font-color-disabled;
      line-height: 68rpx;
      text-align: center;
    }
  }

}
</style>