<template>
  <view class="container">
    <view class="inputs">
      <view class="input-item">
        <label for="newPwd">新密码：</label>
        <input id="newPwd" v-model="newPwd" :password="true" placeholder="请输入新密码" />
      </view>
      <view class="input-item">
        <label for="confirmPwd">再输一次：</label>
        <input id="confirmPwd" v-model="confirmPwd" :password="true" placeholder="请再输一次" />
      </view>
    </view>
    <view class="action">
      <button @click="submit">提交</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      account: "",
      key: "",
      newPwd: "",
      confirmPwd: "",
      requesting: false
    };
  },
  onLoad(options) {
    let that = this;
    if (options.account) {
      that.account = options.account;
    }
    if (options.key) {
      that.key = options.key;
    }
  },
  onShow() {},
  methods: {
    submit() {
      let that = this;

      if (that.requesting === true) {
        return false;
      }

      if (that.newPwd === "") {
        that.$toast("请输入新密码");
        return false;
      }

      if (that.confirmPwd === "") {
        that.$toast("请再输入一次");
        return false;
      }

      if (that.confirmPwd !== that.newPwd) {
        that.$toast("两次密码输入不一致");
        return false;
      }

      that.requesting = true;

      that.$http
        .post(that.$api.user.resetPassWord, {
          account: that.account,
          key: that.key,
          login_password: that.newPwd,
          psw_confirm: that.confirmPwd
        })
        .then(res => {
          if (res.return_code === "0000") {
            that.$toast("重置密码成功");
            setTimeout(function() {
              uni.navigateTo({
                url: "/pages/public/login"
              });
            }, 1000);
          } else {
            console.log(res);
            that.$toast("重置密码失败");
          }
        })
        .catch(error => {
          console.log(error);
          that.$toast("重置密码失败");
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