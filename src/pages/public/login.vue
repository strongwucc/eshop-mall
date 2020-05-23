<template>
  <view class="container">
    <view class="left-bottom-sign"></view>
    <view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
    <view class="right-top-sign"></view>
    <!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
    <view class="wrapper">
      <view class="left-top-sign">LOGIN</view>
      <view class="welcome">欢迎回来！</view>
      <view class="input-content">
        <view class="input-item">
          <text class="tit">手机号码</text>
          <input
            type="number"
            :value="mobile"
            placeholder="请输入手机号码"
            maxlength="11"
            data-key="mobile"
            @input="inputChange"
          />
        </view>
        <view class="input-item">
          <text class="tit">密码</text>
          <input
            type="mobile"
            :value="password"
            placeholder="8-18位不含特殊字符的数字、字母组合"
            placeholder-class="input-empty"
            maxlength="20"
            password
            data-key="password"
            @input="inputChange"
            @confirm="toLogin"
          />
        </view>
      </view>
      <button class="confirm-btn" @click="toLogin" :disabled="requesting">
        登录
      </button>
      <view class="forget-section" @click="forgetPwd">忘记密码?</view>
    </view>
    <view class="register-section">
      还没有账号?
      <text @click="toRegist">马上注册</text>
    </view>
  </view>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      mobile: "",
      password: "",
      requesting: false,
    };
  },
  onLoad() {},
  methods: {
    ...mapMutations(["login"]),
    inputChange(e) {
      const key = e.currentTarget.dataset.key;
      this[key] = e.detail.value;
    },
    navBack() {
      uni.navigateBack();
    },
    toRegist() {
      uni.navigateTo({
        url: "/pages/public/signup",
      });
    },
    forgetPwd() {
      uni.redirectTo({
        url: "/pages/public/forgetStep1",
      });
    },
    /**
     * 登录
     */
    toLogin() {
      let that = this;
      if (that.requesting) {
        return false;
      }
      if (/^1[0-9]{10,10}$/.test(that.mobile) === false) {
        that.$toast("请输入正确的手机号");
        return false;
      }
      if (!that.password) {
        that.$toast("请输入密码");
        return false;
      }

      that.requesting = true;
      uni.showLoading();
      that.$http
        .post(that.$api.auth.login, {
          uname: that.mobile,
          password: that.password,
        })
        .then((res) => {
          that.requesting = false;
          uni.hideLoading();
          if (res.return_code === "0000") {
            that.login(res.data.session_id);
            that.$toast("登录成功");
            that.loginSpread(that.mobile, that.password);
            that.navBack();
          } else {
            console.log(res);
            that.$toast(res.error);
          }
        })
        .catch((error) => {
          that.requesting = false;
          uni.hideLoading();
          console.log(error);
          that.$toast("登录失败");
        });
    },
    loginSpread(uname, password) {
      uni.request({
        url: "http://shop0001.spread.miour.cn/api/login",
        data: {
          account: uname,
          password: password,
        },
        header: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        method: "POST",
        success: ({ data }) => {
          console.log(data);
          if (data.data.token) {
            uni.setStorage({
              key: "login_status",
              data: data.data.token,
              success: function() {
                console.log("success");
              },
            });
            uni.setStorage({
              key: "login_status_expires_time",
              data: data.data.expires_time,
              success: function() {
                console.log("success");
              },
            });
          }
        },
      });
    },
  },
};
</script>

<style lang="scss">
page {
  background: #fff;
}
.container {
  padding-top: 115px;
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #fff;
}
.wrapper {
  position: relative;
  z-index: 90;
  background: #fff;
  padding-bottom: 40rpx;
}
.back-btn {
  position: absolute;
  left: 40rpx;
  z-index: 9999;
  padding-top: var(--status-bar-height);
  top: 40rpx;
  font-size: 40rpx;
  color: $font-color-dark;
}
.left-top-sign {
  font-size: 120rpx;
  color: $page-color-base;
  position: relative;
  left: -16rpx;
}
.right-top-sign {
  position: absolute;
  top: 80rpx;
  right: -30rpx;
  z-index: 95;
  &:before,
  &:after {
    display: block;
    content: "";
    width: 400rpx;
    height: 80rpx;
    background: #b4f3e2;
  }
  &:before {
    transform: rotate(50deg);
    border-radius: 0 50px 0 0;
  }
  &:after {
    position: absolute;
    right: -198rpx;
    top: 0;
    transform: rotate(-50deg);
    border-radius: 50px 0 0 0;
    /* background: pink; */
  }
}
.left-bottom-sign {
  position: absolute;
  left: -270rpx;
  bottom: -320rpx;
  border: 100rpx solid #d0d1fd;
  border-radius: 50%;
  padding: 180rpx;
}
.welcome {
  position: relative;
  left: 50rpx;
  top: -90rpx;
  font-size: 46rpx;
  color: #555;
  text-shadow: 1px 0px 1px rgba(0, 0, 0, 0.3);
}
.input-content {
  padding: 0 60rpx;
}
.input-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 30rpx;
  background: $page-color-light;
  height: 120rpx;
  border-radius: 4px;
  margin-bottom: 50rpx;
  &:last-child {
    margin-bottom: 0;
  }
  .tit {
    height: 50rpx;
    line-height: 56rpx;
    font-size: $font-sm + 2rpx;
    color: $font-color-base;
  }
  input {
    height: 60rpx;
    font-size: $font-base + 2rpx;
    color: $font-color-dark;
    width: 100%;
  }
}

.confirm-btn {
  width: 630rpx;
  height: 76rpx;
  line-height: 76rpx;
  border-radius: 50px;
  margin-top: 70rpx;
  background: $uni-color-primary;
  color: #fff;
  font-size: $font-lg;
  &:after {
    border-radius: 100px;
  }
}
.forget-section {
  font-size: $font-sm + 2rpx;
  color: $font-color-spec;
  text-align: center;
  margin-top: 40rpx;
}
.register-section {
  position: absolute;
  left: 0;
  bottom: 50rpx;
  width: 100%;
  font-size: $font-sm + 2rpx;
  color: $font-color-base;
  text-align: center;
  text {
    color: $font-color-spec;
    margin-left: 10rpx;
  }
}
</style>
