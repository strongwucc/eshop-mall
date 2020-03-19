<template>
  <view class="container">
    <view class="types">
      <view class="title">请选择取消订单的原因（必选）：</view>
      <view class="values">
        <radio-group @change="radioChange">
          <label v-for="(item, index) in reasonMap" :key="item.type">
            <view>
              <radio :value="item.type" :checked="item.type === reasonType" color="#fa436a" />
            </view>
            <view>{{item.txt}}</view>
          </label>
        </radio-group>
      </view>
    </view>
    <view class="desc">
      <textarea v-model="reasonDesc" placeholder="你还想说什么？（50个字以内）"></textarea>
    </view>
    <view class="btn" @click="doCancel">提交</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderId: "",
      sourceUrl: "/pages/order/order?state=0",
      reasonMap: [
        { type: 0, txt: "不想要了" },
        { type: 1, txt: "支付不成功" },
        { type: 2, txt: "价格较贵" },
        { type: 3, txt: "缺货" },
        { type: 4, txt: "等待时间过长" },
        { type: 5, txt: "拍错了" },
        { type: 6, txt: "订单信息填写错误" },
        { type: 7, txt: "其他" }
      ],
      reasonType: 0,
      reasonDesc: "",
      requesting: false
    };
  },
  onLoad(options) {
    let that = this;
    if (options.order_id) {
      that.orderId = options.order_id;
    }
  },
  onShow() {},
  methods: {
    radioChange(e) {
      console.log(e);
      let that = this;
      let reasonType = ~~e.detail.value;
      that.reasonType = reasonType;
    },
    doCancel() {
      let that = this;
      if (that.requesting === true) {
        return false;
      }

      if (that.reasonType === 7 && that.reasonDesc === "") {
        that.$toast("请输入详细原因");
        return false;
      }

      that.requesting = true;

      that.$http
        .post(that.$api.user.orderCancel, {
          order_id: that.orderId,
          reason_type: that.reasonType,
          reason_desc: that.reasonDesc
        })
        .then(res => {
          if (res.return_code === '0000') {
            that.$toast("取消成功");
            that.$prevPage().refreshList(that.orderId);
            setTimeout(function () {
              uni.navigateBack();
            }, 1000);
          } else {
            console.log(res);
            that.$toast("取消失败");
          }
        })
        .catch(error => {
          console.log(error);
          that.$toast("取消失败");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  .types {
    width: 100%;
    padding: 20rpx 100rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .title {
      width: 100%;
      font-weight: bold;
    }
    .values {
      width: 100%;
      radio-group {
        label {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-top: 40rpx;
        }
      }
    }
  }
  .desc {
    margin-top: 20rpx;
    border: $page-color-base 1rpx solid;
    padding: 20rpx;
  }
  .btn {
    position: fixed;
    bottom: calc(20rpx + var(--window-bottom));
    height: 88rpx;
    width: 300rpx;
    background: $uni-color-primary;
    color: $page-color-light;
    line-height: 88rpx;
    text-align: center;
    border-radius: 44rpx;
  }
}
</style>