<template>
  <view class="container">
    <view class="user-section">
      <view class="user-info-box">
        <view class="portrait-box">
          <image
            class="portrait"
            :src="userInfo.avatar || '/static/avatar_default@2x.png'"
          ></image>
        </view>
        <view class="info-box">
          <text class="username">{{ userInfo.uname || "游客" }}</text>
        </view>
        <view class="setting" @click="navTo('/pages/set/set')">
          <!-- <text class="yticon icon-shezhi"></text> -->
          <image src="/static/icon_set@2x.png"></image>
        </view>
      </view>
      <view class="vip-card-box">
        <view class="tit">
          <text class="yticon icon-iLinkapp-"></text>
          {{ userInfo.levelname || "" }}
        </view>
      </view>
    </view>

    <view
      class="cover-container"
      :style="[
        {
          transform: coverTransform,
          transition: coverTransition,
        },
      ]"
      @touchstart="coverTouchstart"
      @touchmove="coverTouchmove"
      @touchend="coverTouchend"
    >
      <image class="arc" src="/static/arc.png"></image>

      <view class="tj-sction">
        <view
          class="tj-item"
          @click="navTo('/pages/balance/records')"
          hover-class="common-hover"
          :hover-stay-time="50"
        >
          <text class="num">{{ userInfo.advance | formatMoney }}</text>
          <text>余额</text>
        </view>
        <view
          class="tj-item"
          @click="navTo('/pages/user/coupons')"
          hover-class="common-hover"
          :hover-stay-time="50"
        >
          <text class="num">{{ userInfo.coupons || 0 }}</text>
          <text>优惠券</text>
        </view>
        <view
          class="tj-item"
          @click="navTo('/pages/score/records')"
          hover-class="common-hover"
          :hover-stay-time="50"
        >
          <text class="num">{{ userInfo.point || 0 }}</text>
          <text>积分</text>
        </view>
      </view>
      <!-- 订单 -->
      <view class="order-section">
        <view class="order-title" @click="navTo('/pages/order/order?state=0')">
          <text class="big">我的订单</text>
          <text class="small">全部订单</text>
          <text class="yticon icon-you"></text>
        </view>
        <view class="order-content">
          <view
            class="order-item"
            @click="navTo('/pages/order/order?state=1')"
            hover-class="common-hover"
            :hover-stay-time="50"
          >
            <!-- <text class="yticon icon-daifukuan"></text> -->
            <image src="/static/member_icon_daifukuan@2x.png"></image>
            <text class="txt">待付款</text>
          </view>
          <view
            class="order-item"
            @click="navTo('/pages/order/order?state=2')"
            hover-class="common-hover"
            :hover-stay-time="50"
          >
            <!-- <text class="yticon icon-daifahuo"></text> -->
            <image src="/static/member_icon_daifahuo@2x.png"></image>
            <text class="txt">待发货</text>
          </view>
          <view
            class="order-item"
            @click="navTo('/pages/order/order?state=3')"
            hover-class="common-hover"
            :hover-stay-time="50"
          >
            <!-- <text class="yticon icon-daishouhuo"></text> -->
            <image src="/static/member_icon_daishouhuo@2x.png"></image>
            <text class="txt">待收货</text>
          </view>
          <view
            class="order-item"
            @click="navTo('/pages/comment/noDiscuss')"
            hover-class="common-hover"
            :hover-stay-time="50"
          >
            <!-- <text class="yticon icon-comment"></text> -->
            <image src="/static/member_icon_daipingjia@2x.png"></image>
            <text class="txt">待评论</text>
          </view>
          <view
            class="order-item"
            @click="navTo('/pages/aftersale/afterList')"
            hover-class="common-hover"
            :hover-stay-time="50"
          >
            <!-- <text class="yticon icon-shouhoutuikuan"></text> -->
            <image src="/static/member_icon_tuihuanhuo@2x.png"></image>
            <text class="txt">退款/售后</text>
          </view>
        </view>
      </view>
      <view class="order-section">
        <view class="order-title">
          <text class="big">其他服务</text>
          <text class="small"></text>
        </view>
        <view class="order-content others">
          <view
            class="order-item"
            @click="navTo('/pages/balance/records')"
            hover-class="common-hover"
            :hover-stay-time="50"
          >
            <!-- <text class="yticon icon-qianbao"></text> -->
            <image src="/static/member_icon_chongzhi@2x.png"></image>
            <text class="txt">会员充值</text>
          </view>
          <view
            class="order-item"
            @click="navTo('/pages/comment/noDiscuss?tab=1')"
            hover-class="common-hover"
            :hover-stay-time="50"
          >
            <!-- <text class="yticon icon-pingjia"></text> -->
            <image src="/static/member_icon_pingjia@2x.png"></image>
            <text class="txt">我的评价</text>
          </view>
          <view
            class="order-item"
            @click="navTo('/pages/collection/goods')"
            hover-class="common-hover"
            :hover-stay-time="50"
          >
            <!-- <text class="yticon icon-shoucang2"></text> -->
            <image src="/static/member_icon_shoucang@2x.png"></image>
            <text class="txt">我的收藏</text>
          </view>
          <view
            class="order-item"
            @click="mySpread"
            hover-class="common-hover"
            :hover-stay-time="50"
          >
            <!-- <text class="yticon icon-qunzu"></text> -->
            <image src="/static/my_icon_fenxiao@2x.png"></image>
            <text class="txt">个人分销</text>
          </view>
          <view
            class="order-item"
            @click="navTo('/pages/address/address')"
            hover-class="common-hover"
            :hover-stay-time="50"
          >
            <!-- <text class="yticon icon-dizhi"></text> -->
            <image src="/static/my_icon_address@2x.png"></image>
            <text class="txt">地址管理</text>
          </view>
          <view
            class="order-item"
            @click="navTo('')"
            hover-class="common-hover"
            :hover-stay-time="50"
          >
            <!-- <text class="yticon icon-kefu"></text> -->
            <image src="/static/member_icon_fuwu@2x.png"></image>
            <text class="txt">联系客服</text>
          </view>
          <view
            class="order-item"
            @click="navTo('')"
            hover-class="common-hover"
            :hover-stay-time="50"
          >
            <!-- <text class="yticon icon-bangzhu"></text> -->
            <image src="/static/my_icon_help@2x.png"></image>
            <text class="txt">帮助中心</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
import listCell from "@/components/mix-list-cell";
import { mapState, mapMutations } from "vuex";
let startY = 0,
  moveY = 0,
  pageAtTop = true;
export default {
  components: {
    listCell,
  },
  data() {
    return {
      coverTransform: "translateY(0px)",
      coverTransition: "0s",
      moving: false,
    };
  },
  onLoad(options) {},
  onShow() {
    let that = this;
    that.loadUser();
  },
  // #ifndef MP
  onNavigationBarButtonTap(e) {
    const index = e.index;
    if (index === 0) {
      this.navTo("/pages/set/set");
    } else if (index === 1) {
      // #ifdef APP-PLUS
      const pages = getCurrentPages();
      const page = pages[pages.length - 1];
      const currentWebview = page.$getAppWebview();
      currentWebview.hideTitleNViewButtonRedDot({
        index,
      });
      // #endif
      uni.navigateTo({
        url: "/pages/notice/notice",
      });
    }
  },
  // #endif
  computed: {
    ...mapState(["hasLogin", "token", "userInfo"]),
  },
  methods: {
    ...mapMutations(["login", "setUser"]),
    /**
     * 加载用户信息
     */
    loadUser() {
      let that = this;
      let userInfo = that.userInfo;

      if (Object.keys(userInfo).length === 0) {
        try {
          userInfo = uni.getStorageSync("userInfo");
          if (userInfo) {
            that.setUser(JSON.parse(userInfo));
          }
        } catch (e) {
          console.log(e);
        }
      }

      let token = that.token;
      if (!token) {
        try {
          token = uni.getStorageSync("token");
          if (token) {
            that.login(token);
          }
        } catch (e) {
          console.log(e);
        }
      }

      if (!userInfo && that.hasLogin) {
        that.getUserInfo();
      }
    },

    /**
     * 获取用户信息
     */
    getUserInfo() {
      let that = this;
      that.$http
        .post(that.$api.user.center)
        .then((res) => {
          that.setUser(res.data.member);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    /**
     * 统一跳转接口,拦截未登录路由
     * navigator标签现在默认没有转场动画，所以用view
     */
    navTo(url) {
      if (!this.hasLogin) {
        url = "/pages/public/login";
      }
      uni.navigateTo({
        url,
      });
    },

    /**
     *  会员卡下拉和回弹
     *  1.关闭bounce避免ios端下拉冲突
     *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
     *    transition设置0.1秒延迟，让css来过渡这段空窗期
     *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
     */
    coverTouchstart(e) {
      if (pageAtTop === false) {
        return;
      }
      this.coverTransition = "transform .1s linear";
      startY = e.touches[0].clientY;
    },
    coverTouchmove(e) {
      moveY = e.touches[0].clientY;
      let moveDistance = moveY - startY;
      if (moveDistance < 0) {
        this.moving = false;
        return;
      }
      this.moving = true;
      if (moveDistance >= 80 && moveDistance < 100) {
        moveDistance = 80;
      }

      if (moveDistance > 0 && moveDistance <= 80) {
        this.coverTransform = `translateY(${moveDistance}px)`;
      }
    },
    coverTouchend() {
      if (this.moving === false) {
        return;
      }
      this.moving = false;
      this.coverTransition = "transform 0.3s cubic-bezier(.21,1.93,.53,.64)";
      this.coverTransform = "translateY(0px)";
    },
    mySpread() {
      uni.getStorage({
        key: "login_status",
        success: function(res) {
          let access_token = res.data;
          uni.getStorage({
            key: "login_status_expires_time",
            success: function(res) {
              let expires_time = res.data;
              window.location.href =
                // "http://183.66.65.235:81/#/user/user_promotion?access_token=" +
                "http://shop0001.spread.miour.cn/#/user/user_promotion?access_token=" +
                access_token +
                "&expires_time=" +
                expires_time;
            },
          });
        },
      });
    },
  },
};
</script>
<style lang="scss">
page {
  height: 100%;
}
.container {
  height: 100%;
  background: $page-color-base;
}
%flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
%section {
  display: flex;
  justify-content: space-around;
  align-content: center;
  background: #fff;
  // border-radius: 10rpx;
}
.user-section {
  height: 520rpx;
  padding: 100rpx 30rpx 0;
  position: relative;
  .bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    filter: blur(1px);
    opacity: 0.7;
  }
}
.user-info-box {
  height: 180rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
  .portrait-box {
    flex: none;
    .portrait {
      width: 130rpx;
      height: 130rpx;
      border: 5rpx solid #fff;
      border-radius: 50%;
    }
  }
  .info-box {
    flex: auto;
    .username {
      font-size: $font-lg + 6rpx;
      color: $font-color-dark;
      margin-left: 20rpx;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
  }

  .setting {
    flex: none;
    .icon-shezhi {
      font-size: 48rpx;
    }
    image {
      width: 48rpx;
      height: 48rpx;
    }
  }
}

.vip-card-box {
  display: flex;
  flex-direction: column;
  color: #f7d680;
  height: 240rpx;
  background: linear-gradient(to left, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8));
  border-radius: 16rpx 16rpx 0 0;
  overflow: hidden;
  position: relative;
  padding: 20rpx 24rpx;
  .card-bg {
    position: absolute;
    top: 20rpx;
    right: 0;
    width: 380rpx;
    height: 260rpx;
  }
  .b-btn {
    position: absolute;
    right: 20rpx;
    top: 16rpx;
    width: 132rpx;
    height: 40rpx;
    text-align: center;
    line-height: 40rpx;
    font-size: 22rpx;
    color: #36343c;
    border-radius: 20px;
    background: linear-gradient(to left, #f9e6af, #ffd465);
    z-index: 1;
  }
  .tit {
    font-size: $font-base + 2rpx;
    color: #f7d680;
    margin-bottom: 28rpx;
    .yticon {
      color: #f6e5a3;
      margin-right: 16rpx;
    }
  }
  .e-b {
    font-size: $font-sm;
    color: #d8cba9;
    margin-top: 10rpx;
  }
}
.cover-container {
  background: $page-color-base;
  margin-top: -150rpx;
  padding: 0 30rpx;
  position: relative;
  padding-bottom: 20rpx;
  .arc {
    position: absolute;
    left: 0;
    top: -34rpx;
    width: 100%;
    height: 36rpx;
  }
}
.tj-sction {
  @extend %section;
  .tj-item {
    @extend %flex-center;
    flex-direction: column;
    height: 140rpx;
    font-size: $font-sm;
    color: #75787d;
  }
  .num {
    font-size: $font-lg;
    color: $font-color-dark;
    margin-bottom: 8rpx;
  }
}
.order-section {
  margin-top: 20rpx;
  .order-title {
    @extend %section;
    padding: 28rpx;
    box-sizing: border-box;
    justify-content: space-between;
    text {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .big {
      font-size: 32rpx;
      font-weight: bold;
      flex: none;
    }
    .small {
      font-size: 24rpx;
      color: $font-color-light;
      flex: auto;
      justify-content: flex-end;
      margin-right: 18rpx;
    }
    .icon-you {
      color: $font-color-light;
      flex: none;
      // margin-top: 8rpx;
    }
  }
  .order-content {
    @extend %section;
    padding: 28rpx 0;
    // margin-top: 20rpx;
    .order-item {
      @extend %flex-center;
      width: 120rpx;
      height: 120rpx;
      border-radius: 10rpx;
      font-size: $font-sm;
      color: $font-color-dark;
      image {
        width: 56rpx;
        height: 56rpx;
      }
      .txt {
        margin-top: 10rpx;
      }
    }
    .yticon {
      font-size: 48rpx;
      margin-bottom: 18rpx;
      color: #fa436a;
    }
    .icon-shouhoutuikuan {
      font-size: 44rpx;
    }
    &.others {
      flex-wrap: wrap;
      justify-content: flex-start;
      padding: 28rpx 0 28rpx 28rpx;
      box-sizing: border-box;
      .order-item {
        margin-right: 40rpx;
      }
    }
  }
}
</style>
