<template>
  <view class="container">
    <view class="inputs">
      <view class="input-item">
        <label for="mobile">手机号：</label>
        <input id="mobile" :value="mobile" @input="mobileChange" placeholder="请输入手机号" />
      </view>
      <view class="input-item">
        <label for="code">验证码：</label>
        <input id="code" v-model="code" placeholder="请输入验证码" />
        <button class="can" v-show="mobileIsOk && !showTimer" @click="sendSms">发送验证码</button>
        <button class="cannot" v-show="!mobileIsOk">发送验证码</button>
        <button class="active" v-show="showTimer">{{seconds}}秒后重发</button>
      </view>
    </view>
    <view class="action">
      <button @click="next">下一步</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      mobile: "",
      code: "",
      mobileIsOk: false,
      showTimer: false,
      seconds: 10,
      timer: null,
      requesting: false
    };
  },
  onLoad(options) {},
  onShow() {},
  methods: {
    /**
     * 手机号输入监听
     */
    mobileChange(e) {
      let that = this;
      that.mobileIsOk = /^1[0-9]{10,10}$/.test(e.detail.value) ? true : false;
      that.mobile = e.detail.value;
    },
    /**
     * 发送短信
     */
    sendSms() {
      let that = this;

      if (that.requesting) {
        return false;
      }

      if (that.mobile === "" || that.mobileIsOk === false) {
        return false;
      }

      that.requesting = true;

      that.$http
        .post(that.$api.auth.sendSms, { uname: that.mobile, type: "forgot" })
        .then(res => {
          that.requesting = false;
          if (res.return_code === "0000") {
            that.$toast("发送成功");
            that.showTimer = true;
            that.timer = setInterval(() => {
              if (that.seconds <= 1) {
                clearInterval(that.timer);
                that.showTimer = false;
              }
              that.seconds--;
            }, 1000);
          } else {
            that.$toast(res.error);
          }
        })
        .catch(error => {
          that.requesting = false;
          console.log(error);
          that.$toast("发送失败");
        });
    },
    next() {
      let that = this;

      if (that.requesting === true) {
        return false;
      }

      if (that.mobile === "" || that.mobileIsOk === false) {
        that.$toast("请输入正确的手机号");
        return false;
      }

      if (that.code === "") {
        that.$toast("请输入验证码");
        return false;
      }

      that.requesting = true;

      that.$http
        .post(that.$api.auth.resetPwdCode, {
          forgotvcode: that.code,
          forgot: that.mobile,
          send_type: "forgot"
        })
        .then(res => {
          that.requesting = false;
          if (res.return_code === "0000") {
            console.log(res.data);
            uni.navigateTo({
              url: `/pages/public/forgetStep2?account=${res.data.account}&key=${res.data.key}`
            });
          } else {
            that.$toast(res.error);
          }
        })
        .catch(error => {
          that.requesting = false;
          console.log(error);
          that.$toast("操作失败");
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
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: $page-color-base;
  .inputs {
    padding: 20rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    .input-item {
      background: #ffffff;
      height: 88rpx;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      label {
        flex: none;
        width: 200rpx;
        text-align: right;
      }
      input {
        flex: auto;
      }
      button {
        flex: none;
        margin: 0 10rpx;
        height: 60rpx;
        line-height: 60rpx;
        padding: 0 10rpx;
        background: $font-color-disabled;
        color: $page-color-light;
        text-align: center;
        font-size: 28rpx;
        &.can {
          background: $uni-color-primary;
        }
      }
    }
  }
  .action {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    button {
      margin: 20rpx;
      padding: 0;
      font-size: 28rpx;
      height: 88rpx;
      width: 100%;
      background: $uni-color-primary;
      color: $page-color-light;
      line-height: 88rpx;
      text-align: center;
      border-radius: 10rpx;
    }
  }
}
</style>