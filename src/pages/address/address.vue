<template>
  <view class="content b-t">
    <view class="list b-b" v-for="(item, index) in addrs" :key="index" @click="checkAddress(item)">
      <view class="wrapper">
        <view class="address-box">
          <text v-if="item.def_addr === '1'" class="tag">默认</text>
          <text class="address">{{item.name}} {{item.area_str}} {{item.addr}}</text>
        </view>
        <view class="u-box">
          <text class="name">{{item.name}}</text>
          <text class="mobile">{{item.mobile}}</text>
        </view>
      </view>
      <text class="yticon icon-bianji" @click.stop="addAddress('edit', item)"></text>
    </view>
    <button class="add-btn" @click="addAddress('add')">新增地址</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      source: 0,
      addrs: []
    };
  },
  onLoad(option) {
    let that = this;

    if (option.source) {
      that.source = ~~option.source;
    }

    that.getAddrs();
  },
  methods: {
    /**
     * 收货地址列表
     */
    getAddrs() {
      let that = this;
      that.$http
        .post(that.$api.user.addrs)
        .then(res => {
          if (res.return_code === "0000") {
            if (res.data.receiver.length > 0) {
              let addrs = res.data.receiver.map(addr => {
                addr.area_str = addr.area.split(':')[1].split('/').join('');
                return addr;
              });
              that.addrs = addrs;
            }
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //选择地址
    checkAddress(item) {
      let that = this;
      if (that.source === 1) {
        that.$prevPage().addr = item;
        uni.navigateBack();
      }
    },
    addAddress(type, item) {
      uni.navigateTo({
        url: `/pages/address/addressManage?type=${type}&data=${JSON.stringify(
          item
        )}`
      });
    },
    //添加或修改成功之后回调
    refreshList() {
      let that = this;
      that.getAddrs();
    }
  }
};
</script>

<style lang='scss'>
page {
  padding-bottom: 120rpx;
}
.content {
  position: relative;
}
.list {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
  background: #fff;
  position: relative;
}
.wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.address-box {
  display: flex;
  align-items: center;
  .tag {
    font-size: 24rpx;
    color: $base-color;
    margin-right: 10rpx;
    background: #fffafb;
    border: 1px solid #ffb4c7;
    border-radius: 4rpx;
    padding: 4rpx 10rpx;
    line-height: 1;
    flex: none;
  }
  .address {
    flex: 1;
    font-size: 30rpx;
    color: $font-color-dark;
  }
}
.u-box {
  font-size: 28rpx;
  color: $font-color-light;
  margin-top: 16rpx;
  .name {
    margin-right: 30rpx;
  }
}
.icon-bianji {
  display: flex;
  align-items: center;
  height: 80rpx;
  font-size: 40rpx;
  color: $font-color-light;
  padding-left: 30rpx;
}

.add-btn {
  position: fixed;
  left: 30rpx;
  right: 30rpx;
  bottom: 16rpx;
  z-index: 95;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 690rpx;
  height: 80rpx;
  font-size: 32rpx;
  color: #fff;
  background-color: $base-color;
  border-radius: 10rpx;
  box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
}
</style>
