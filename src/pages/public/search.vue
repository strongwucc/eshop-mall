<template>
  <view class="container">
    <view class="navbar">
      <view class="back">
        <text class="yticon icon-zuo"></text>
      </view>
      <view class="input">
        <text class="yticon icon-sousuo"></text>
        <input
          type="text"
          :value="searchKey"
          placeholder="搜索关键字"
          @input="inputSearch"
          @confirm="submitSearch"
        />
        <text class="yticon icon-shanchu4" v-show="searchKey.length > 0" @click="resetKey"></text>
      </view>
    </view>
    <view class="content" v-if="historySearchKeys.length > 0 || searchKeys.length > 0">
      <view
        class="history"
        :class="{'border-bottom-exist': searchKeys.length > 0}"
        v-if="historySearchKeys.length > 0"
      >
        <view class="title">
          <text class="yticon icon-lishijilu"></text>
          <text class="txt">搜索历史</text>
          <text class="yticon icon-iconfontshanchu1" @click="clearHistory"></text>
        </view>
        <view class="items" :class="{'show-beyond': historyDetail}">
          <template v-for="(item, itemIndex) in historySearchKeys" :key="item">
            <view
              class="item"
              :class="{'beyond': itemIndex > showCount}"
              @click="searchByKey(item)"
            >{{item}}</view>
          </template>
        </view>
        <view class="more" v-if="historySearchKeys.length > showCount" @click="toggleHistoryDetail">
          <text class="txt">更多搜索历史</text>
          <text class="yticon icon-shang" :class="{'hiding': !historyDetail}"></text>
          <text class="yticon icon-xia" :class="{'hiding': historyDetail}"></text>
        </view>
      </view>
      <view class="hot" v-if="searchKeys.length > 0">
        <view class="title">
          <text class="yticon icon-hot"></text>
          <text class="txt">热门搜索</text>
        </view>
        <view class="items" :class="{'show-beyond': hotDetail}">
          <template v-for="(item, itemIndex) in searchKeys" :key="item">
            <view
              class="item"
              :class="{'beyond': itemIndex > showCount}"
              @click="searchByKey(item.top_link_title)"
            >{{item.top_link_title}}</view>
          </template>
        </view>
        <view class="more" v-if="searchKeys.length > showCount" @click="toggleHotDetail">
          <text class="txt">更多热门搜索</text>
          <text class="yticon icon-shang" :class="{'hiding': !hotDetail}"></text>
          <text class="yticon icon-xia" :class="{'hiding': hotDetail}"></text>
        </view>
      </view>
    </view>
    <view class="empty" v-else>暂无搜索记录</view>
  </view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      searchKey: "",
      historyDetail: false,
      hotDetail: false,
      showCount: 9
    };
  },
  computed: {
    ...mapState(["searchKeys", "historySearchKeys"])
  },
  methods: {
    ...mapMutations(["setHistorySearchKeys"]),
    inputSearch(e) {
      let that = this;
      that.searchKey = e.detail.value;
    },
    submitSearch(e) {
      let searchKey = e.detail.value;
      if (!searchKey) {
        return false;
      }
      let that = this;
      that.searchByKey(searchKey);
    },
    resetKey() {
      let that = this;
      that.searchKey = "";
    },
    searchByKey(key) {
      let that = this;
      let oldHistory = that.historySearchKeys;
      let existIndex = oldHistory.indexOf(key);
      oldHistory.unshift(key);
      if (existIndex !== -1) {
        oldHistory.splice(existIndex, 1);
      }

      uni.navigateTo({
        url: `/pages/product/list?s=${key}`,
        success: function() {
          that.setHistorySearchKeys(oldHistory);
        }
      });
    },
    clearHistory() {
      let that = this;
      that.setHistorySearchKeys([]);
    },
    toggleHistoryDetail() {
      let that = this;
      that.historyDetail = !that.historyDetail;
    },
    toggleHotDetail() {
      let that = this;
      that.hotDetail = !that.hotDetail;
    }
  }
};
</script>

<style lang="scss">
%flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.container {
  min-height: 100%;
  padding-top: var(--status-bar-height);
  position: relative;
}
.navbar {
  height: 64rpx;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .back {
    .icon-zuo {
      @extend %flex-center;
      width: 76rpx;
      font-size: 42rpx;
      font-weight: 500;
      height: 100%;
    }
  }
  .input {
    height: 100%;
    width: 460rpx;
    height: 64rpx;
    background: $border-color-light;
    border-radius: 64rpx;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 30rpx;
    box-sizing: border-box;
    input {
      padding-left: 20rpx;
      font-size: 26rpx;
      flex: auto;
    }
    .yticon {
      flex: none;
      color: $font-color-light;
      font-size: 32rpx;
    }
  }
}
.content {
  width: 100%;
  padding: 0 30rpx;
  box-sizing: border-box;
  font-size: 24rpx;
  .history,
  .hot {
    padding: 60rpx 0 40rpx;
    box-sizing: border-box;
    position: relative;
    .title {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .txt {
        font-size: 28rpx;
        font-weight: bold;
        padding-left: 14rpx;
        box-sizing: border-box;
        flex: auto;
      }
      .icon-lishijilu,
      .icon-hot {
        font-size: 36rpx;
        color: $font-color-spec;
        flex: none;
      }
      .icon-hot {
        color: $base-color;
      }
      .icon-iconfontshanchu1 {
        font-size: 36rpx;
        color: $font-color-light;
        flex: none;
      }
    }
    .items {
      margin-top: 36rpx;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      .item {
        @extend %flex-center;
        padding: 0 40rpx;
        box-sizing: border-box;
        height: 56rpx;
        background: $page-color-base;
        opacity: 0.8;
        border-radius: 30rpx;
        margin: 0 30rpx 30rpx 0;
        &.beyond {
          display: none;
        }
      }
      &.show-beyond {
        .beyond {
          display: flex;
        }
      }
    }
    .more {
      @extend %flex-center;
      margin-top: 60rpx;
      color: $font-color-disabled;
      .yticon {
        font-size: 32rpx;
        @extend %flex-center;
        color: $font-color-disabled;
        padding-top: 10rpx;
        box-sizing: border-box;
        &.hiding {
          display: none;
        }
      }
    }
  }
  .border-bottom-exist::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    content: "";
    -webkit-transform: scaleY(0.3);
    transform: scaleY(0.3);
    border-top: 1px solid $font-color-disabled;
  }
}
.empty {
  @extend %flex-center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  font-size: 24rpx;
  color: $font-color-disabled;
}
</style>