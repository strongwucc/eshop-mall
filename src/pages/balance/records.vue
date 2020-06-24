<template>
  <view class="container">
    <view class="header">
      <!-- <view class="btn" @click="recharge">充值</view> -->
      <view class="btn"></view>
      <view class="label">
        <!-- <text class="line"></text> -->
        <text class="txt">余额（元）</text>
        <!-- <text class="line"></text> -->
      </view>
      <view class="money">￥{{(total || 0.00) | formatMoney}}</view>
    </view>
    <view class="title">余额交易明细</view>
    <view class="records">
      <scroll-view
        class="records-scroll"
        :scroll-y="true"
        :lower-threshold="1"
        @scrolltolower="getRecords"
        v-if="records.length > 0"
      >
        <view class="record-item" v-for="(item, itemIndex) in records" :key="item.log_id">
          <view class="left">
            <view class="title">{{item.message}}</view>
            <view class="time">交易时间：{{item.mtime | formatTime(1)}}</view>
          </view>
          <view class="right">
            <text v-if="item.import_money > 0">+{{item.import_money | formatMoney}}</text>
            <text v-else-if="item.explode_money > 0">-{{item.explode_money | formatMoney}}</text>
          </view>
        </view>
      </scroll-view>
      <view class="empty" v-else>还没有交易纪录哦~</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      total: 0.0,
      records: [],
      currentPage: 1,
      totalPage: 0,
      hasMore: true
    };
  },

  computed: {},

  onLoad(options) {},

  onShow() {
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
      that.$http
        .post(that.$api.user.balance, { page: that.currentPage })
        .then(res => {
          if (res.return_code === "0000") {
            that.records = that.records.concat(res.data.advlogs);
            that.total = res.data.total;
            that.totalPage = res.data.pager.total;
            if (res.data.pager.current >= res.data.pager.total) {
              that.hasMore = false;
            } else {
              that.currentPage = ~~res.data.pager.current + 1;
            }
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    recharge() {
      let that = this;
      uni.navigateTo({
        url: "/pages/balance/recharge"
      });
    }
  }
};
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
    background: rgba(225, 166, 112, 1);
    box-shadow: 0 12rpx 30rpx rgba(225, 166, 112, 0.4);
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
      width: 160rpx;
      height: 56rpx;
      line-height: 56rpx;
      // background: rgba(104, 62, 32, 1);
      border-radius: 30rpx;
      font-size: 28rpx;
      color: rgba(242, 242, 242, 1);
      align-self: flex-end;
      margin: 40rpx 40rpx 0 0;
    }
    .money,
    .label {
      margin-left: 62rpx;
    }
    .money {
      font-size: 76rpx;
      margin-top: 24rpx;
      color: #ffffff;
    }
    .label {
      // margin-top: 15rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      color: rgba(255, 255, 255, 0.7);
      .txt {
        margin: 0 11rpx;
      }
      .line {
        width: 34rpx;
        height: 1px;
        background: $page-color-base;
      }
    }
  }
  > .title {
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
            font-size: 30rpx;
          }
          .time {
            font-size: 22rpx;
            color: $font-color-disabled;
            margin-top: 10rpx;
          }
        }
        .right {
          font-size: 38rpx;
          color: rgba(225, 166, 112, 1);
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
}
</style>