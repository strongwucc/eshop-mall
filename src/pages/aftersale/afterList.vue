<template>
  <view class="container">
    <view class="navbar">
      <view class="nav-item nav-no" :class="{current: tabCurrentIndex === 0}" @click="tabClick(0)">
        <text>申请退换</text>
      </view>
      <view class="nav-item nav-yes" :class="{current: tabCurrentIndex === 1}" @click="tabClick(1)">
        <text>退换记录</text>
      </view>
    </view>
    <view class="navbar-padding"></view>
    <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
      <swiper-item class="tab-content">
        <scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadOrderData">
          <empty v-if="orderLoaded === true && orders.length === 0"></empty>
          <view class="after-item" v-for="(order, orderIndex) in orders" :key="order.order_id">
            <view class="order-title">
              <text class="order-label txt-gray">订单号</text>
              <text class="order-no">{{order.order_id}}</text>
              <text class="order-time txt-gray">{{order.createtime | formatTime(1)}}</text>
            </view>
            <view class="goods">
              <scroll-view class="goods-scroll" scroll-x>
                <image class="goods-item" v-for="(goods, goodsIndex) in order.goods_data" :key="goods.item_id" :src="goods.pic_url"></image>
              </scroll-view>
            </view>
            <view class="order-amount">
              <text class="total-count txt-gray">共{{order.itemnum}}件 合计 </text>
              <text class="total-amount">￥{{order.total_amount | formatMoney}}</text>
            </view>
            <view class="btn" @click="addReturn(order.order_id)">申请售后</view>
          </view>
          <uni-load-more :status="orderLoadingType"></uni-load-more>
        </scroll-view>
      </swiper-item>
      <swiper-item class="tab-content">
        <scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadRecordData">
          <empty v-if="recordLoaded === true && records.length === 0"></empty>
          <view class="record-item" v-for="(record, orderIndex) in records" :key="record.return_id">
            <view class="order-title">
              <text class="order-label txt-gray">订单号</text>
              <text class="order-no">{{record.order_id}}</text>
              <text class="order-time txt-gray">{{record.last_modify | formatTime(1)}}</text>
            </view>
            <view class="goods">
              <scroll-view class="goods-scroll" scroll-x>
                <image class="goods-item" v-for="(goods, goodsIndex) in record.product_data" :key="goods.bn" :src="goods.image_url"></image>
              </scroll-view>
            </view>
            <view class="act">
              <view class="status" :class="{warning: record.status === '5'}">{{returnStatusMap(record.status)}}</view><view class="btn" @click="returnDetail(record.return_id)">查看详情</view>
            </view>
          </view>
          <uni-load-more :status="recordLoadingType"></uni-load-more>
        </scroll-view>
      </swiper-item>
    </swiper>
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
      tabCurrentIndex: 0,
      orders: [],
      pageOrder: 1,
      orderLoadingType: "more",
      orderLoaded: false,
      records: [],
      pageRecord: 1,
      recordLoadingType: "more",
      recordLoaded: false
    };
  },
  onLoad(options) {},
  onShow() {
    let that = this;
    that.loadOrderData();
    // that.loadRecordData();
  },
  methods: {
    loadOrderData() {
      let that = this;
      if (that.orderLoadingType === "noMore") {
        return false;
      }
      that.orderLoadingType = "loading";
      that.$http
        .post(that.$api.user.afterList, { page: that.pageOrder })
        .then(res => {
          that.orderLoaded = true;
          if (res.return_code === "0000") {
            if (~~res.data.pager.current === ~~res.data.pager.total) {
              that.orderLoadingType = "noMore";
            } else {
              that.orderLoadingType = "more";
              that.pageOrder = that.pageOrder + 1;
            }
            that.orders = that.orders.concat(res.data.orders);
          } else {
            console.log(res);
            that.orderLoadingType = "more";
          }
        })
        .catch(error => {
          console.log(error);
          that.orderLoadingType = "more";
        });
    },
    loadRecordData() {
      let that = this;
      if (that.recordLoadingType === "noMore") {
        return false;
      }
      that.recordLoadingType = "loading";
      that.$http
        .post(that.$api.user.afterRec, { page: that.pageRecord })
        .then(res => {
          that.recordLoaded = true;
          if (res.return_code === "0000") {
            if (~~res.data.pager.current === ~~res.data.pager.total) {
              that.recordLoadingType = "noMore";
            } else {
              that.recordLoadingType = "more";
              that.pageRecord = that.pageRecord + 1;
            }
            that.records = that.records.concat(res.data.return_list);
          } else {
            console.log(res);
            that.recordLoadingType = "more";
          }
        })
        .catch(error => {
          console.log(error);
          that.recordLoadingType = "more";
        });
    },
    returnStatusMap (status) {
      let maps = {
        1: '未操作',
        2: '审核中',
        3: '接受申请',
        4: '完成',
        5: '拒绝',
        6: '已收货',
        7: '已质检',
        8: '补差价',
        9: '已拒绝退款'
      };

      return maps[~~status] || '';
    },
    /**
     * swiper 切换
     */
    changeTab(e) {
      let that = this;
      that.tabCurrentIndex = e.target.current;
      if (e.target.current === 0) {
        that.loadOrderData("tabChange");
      } else {
        that.loadRecordData("tabChange");
      }
    },
    /**
     * 顶部 tab 点击
     */
    tabClick(index) {
      let that = this;
      if (that.tabCurrentIndex === index) {
        return false;
      }

      that.tabCurrentIndex = index;
    },
    addReturn (orderId) {
      if (!orderId) {
        return false;
      }
      uni.navigateTo({
        url: '/pages/aftersale/addRec?orderId=' + orderId
      });
    },
    returnDetail (returnId) {
      console.log(returnId);
      if (!returnId) {
        return false;
      }
      uni.navigateTo({
        url: '/pages/aftersale/returnDetail?returnId=' + returnId
      });
    },
    refreshFromAdd () {
      let that = this;
      that.tabCurrentIndex = 1;
      that.records = [];
      that.pageRecord = 1;
      that.recordLoadingType = "more";
      that.recordLoaded = false;
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
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.navbar {
  flex: none;
  width: 100%;
  height: 120rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  .nav-item {
    flex: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 32rpx;
    color: $font-color-base;
    position: relative;
    &.current {
      font-weight: bold;
      color: $font-color-dark;
    }
    &.current::after {
      content: '';
      width: 40rpx;
      height: 8rpx;
      background: $base-color;
      border-radius: 4rpx;
      position: absolute;
      bottom: -20rpx;
      margin: 0 auto;
    }
  }
}
.navbar-padding {
  flex: none;
  width: 100%;
  height: 120rpx;
}
.swiper-box {
  flex: auto;
  width: 100%;
  background: $page-color-base;
  .tab-content {
    padding: 20rpx 30rpx;
    box-sizing: border-box;
  }
}
.list-scroll-content {
  height: 100%;
  .after-item, .record-item {
    background: #ffffff;
    padding: 30rpx;
    box-sizing: border-box;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .after-item, .record-item {
    flex-direction: column;
    align-items: flex-start;
    .txt-gray {
      color: $font-color-light;
    }
    .order-title {
      width: 100%;
      font-size: 24rpx;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      text {
        flex: none;
      }
      .order-no {
        flex: auto;
        margin-left: 10rpx;
      }
    }
    .goods {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 40rpx 0;
      box-sizing: border-box;
      width: 100%;
      .goods-scroll {
        height: 120rpx;
        width: 100%;
        white-space: nowrap;
      }
      image {
        width: 120rpx;
        height: 120rpx;
        margin-right: 20rpx;
      }
    }
    .order-amount {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      .total-amount {
        margin-left: 10rpx;
      }
    }
    .btn {
      align-self: flex-end;
      margin-top: 34rpx;
      width: 160rpx;
      height: 56rpx;
      border: 1px solid $uni-color-error;
      border-radius: 32rpx;
      font-size: 28rpx;
      color: $uni-color-error;
      text-align: center;
      line-height: 56rpx;
    }
    .act {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 32rpx;
      font-size: 26rpx;
      .status {
        flex: auto;
        &.warning {
          color: $uni-color-error;
        }
      }
      .btn {
        flex: none;
        margin-top: 0;
      }
    }
  }
}
</style>