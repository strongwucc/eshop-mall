<template>
  <view class="container">
    <scroll-view class="index-scroll" scroll-y="true" @scroll="utils.scroll">
      <view id="mp-search-box" class="mp-search-box" @click="navToSearch">
        <text class="yticon icon-sousuo"></text>
        <input
          class="ser-input"
          type="text"
          placeholder="搜索您想找的商品"
          disabled="true"
        />
      </view>
      <view class="search-padding"></view>

      <view class="slide">
        <swiper
          class="slide-swiper"
          :autoplay="true"
          :interval="2000"
          :previous-margin="'30rpx'"
          :next-margin="'30rpx'"
          :current="slideCurrentIndex"
        >
          <swiper-item
            class="slide-swiper-item"
            v-for="(slide, slideIndex) in slides"
            :key="slide.id"
          >
            <text class="image-padding"></text>
            <image :src="slide.link"></image>
            <text class="image-padding"></text>
          </swiper-item>
        </swiper>
      </view>

      <view class="categorys">
        <view
          class="category-item"
          v-for="(category, categoryIndex) in categorys"
          :key="category.catId"
          @click="navToGoodsList(category.catId)"
        >
          <image :src="category.logo"></image>
          <text>{{ category.title }}</text>
        </view>
      </view>

      <view class="adv">
        <image src="/static/temp/adv_banner@2x.png"></image>
      </view>

      <view
        class="index-goods"
        :class="{ 'first-index-goods': dataIndex === 0 }"
        v-for="(data, dataIndex) in indexGoods"
        :key="dataIndex"
      >
        <view class="title">{{ data.title }}</view>
        <scroll-view class="goods" scroll-x="true">
          <block v-for="(goods, goodsIndex) in data.goods" :key="goods.goodsId">
            <view class="goods-item" @click="navToDetailPage(goods)">
              <image
                :src="goods.goodsPic || ''"
                lazy-load="true"
                mode="aspectFit"
              ></image>
              <text class="name">{{ goods.goodsName || "" }}</text>
              <text class="price"
                >￥{{ goods.goodsSalePrice | formatMoney }}</text
              >
            </view>
          </block>
        </scroll-view>
      </view>

      <view class="tabs">
        <view
          id="tab-nav-box"
          class="navs"
          :data-search-height="searchHeight"
          :data-nav-top="tabNavTop"
        >
          <view
            class="nav-item"
            v-for="(tab, tabIndex) in tabList"
            :key="tab.state"
            :class="{ current: tabCurrentIndex === tab.state }"
            @click="clickTab(tab.state)"
          >
            <text>{{ tab.text }}</text>
          </view>
        </view>
        <view class="content">
          <swiper
            class="tab-swiper"
            :current="tabCurrentIndex"
            duration="300"
            @change="changeTab"
            :style="{ height: tabList[tabCurrentIndex].height }"
          >
            <swiper-item
              class="tab-swiper-item"
              v-for="(tab, tabIndex) in tabList"
              :key="tab.state"
            >
              <view
                class="goods-item"
                v-for="(goods, goodsIndex) in tab.goodsList"
                :key="goods.goodsId"
                @click="navToDetailPage(goods)"
              >
                <view class="image">
                  <image
                    :src="goods.goodsPic || ''"
                    lazy-load="true"
                    mode="aspectFit"
                  ></image>
                </view>
                <view class="name">{{ goods.goodsName || "" }}</view>
                <view class="price">
                  <text class="sale"
                    >￥{{ goods.goodsSalePrice | formatMoney }}</text
                  >
                  <text class="market"
                    >￥{{ goods.goodsMarketPrice | formatMoney }}</text
                  >
                </view>
              </view>
            </swiper-item>
          </swiper>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script module="utils" lang="wxs">

  function scroll(event, ins) {
	var scrollTop = event.detail.scrollTop;
	var tabNav = ins.selectComponent('#tab-nav-box');
	var tabNavData = tabNav.getDataset();
	if (tabNavData.navTop && tabNavData.searchHeight) {
		if ((tabNavData.navTop - tabNavData.searchHeight) <= scrollTop) {
			tabNav.addClass('is-sticky');
		} else {
			tabNav.removeClass('is-sticky');
		}
	}
    return false
  }
  module.exports = {
    scroll: scroll
}
</script>

<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      searchHeight: 0,
      searchContent: "",
      slideCurrentIndex: 0,
      slides: [],
      categorys: [],
      indexGoods: [],
      tabCurrentIndex: 0,
      tabNavTop: 0,
      tabList: [
        {
          state: 0,
          text: "促销商品",
          loadingType: "more",
          currentPage: 1,
          height: 0,
          goodsList: [],
        },
        {
          state: 1,
          text: "最新商品",
          loadingType: "more",
          currentPage: 1,
          height: 0,
          goodsList: [],
        },
        {
          state: 2,
          text: "最热商品",
          loadingType: "more",
          currentPage: 1,
          height: 0,
          goodsList: [],
        },
      ],
    };
  },
  onLoad() {
    this.loadHomePageData();
  },
  onShow() {},
  methods: {
    ...mapMutations(["setSearchKeys"]),
    _formatData(data) {
      if (data === null || typeof data[Symbol.iterator] !== "function") {
        return false;
      }
      let that = this;

      data.forEach((item) => {
        if (item.widgets_type === "main_slide" && that.slides.length === 0) {
          let slideData = Object.values(item.data.pic);
          that.slides = [].concat(slideData);
        } else if (item.widgets_type === "index_tab_goods") {
          if (item.widgets === "cuxiao_goods") {
            let cuxiaoGoods = Object.values(item.data.goodsRows);
            that.tabList[0].height =
              Math.ceil(cuxiaoGoods.length / 2) * 585 + 20 + "rpx";
            that.tabList[0].goodsList = [].concat(cuxiaoGoods);
          } else if (item.widgets === "new_goods") {
            let newGoods = Object.values(item.data.goodsRows);
            that.tabList[1].height =
              Math.ceil(newGoods.length / 2) * 585 + 20 + "rpx";
            that.tabList[1].goodsList = [].concat(newGoods);
          } else if (item.widgets === "hot_goods") {
            let hotGoods = Object.values(item.data.goodsRows);
            that.tabList[2].height =
              Math.ceil(hotGoods.length / 2) * 585 + 20 + "rpx";
            that.tabList[2].goodsList = [].concat(hotGoods);
          }
        } else if (
          item.widgets_type === "goodscat" &&
          that.categorys.length === 0
        ) {
          let categorys = item.data.map((cateItem) => {
            return {
              catId: cateItem.cat_id,
              title: cateItem.title,
              logo: cateItem.logo,
            };
          });
          that.categorys = [].concat(categorys);
        } else if (item.widgets_type === "index_goods") {
          let title = item.params.block_name;
          let goods = Object.values(item.data.goodsRows);
          that.indexGoods.push({ title, goods });
        } else if (item.widgets_type === "search") {
          if (item.data.search) {
            that.setSearchKeys(item.data.search);
          }
        }
      });

      // 获取搜索框和 nav 的位置
      that.$nextTick(() => {
        let query = uni.createSelectorQuery();
        query.select("#mp-search-box").boundingClientRect();
        query.select("#tab-nav-box").boundingClientRect();
        query.exec(function(res) {
          if (res && res[0]) {
            console.log(res[0]);
            that.searchHeight = res[0].height;
          }
          if (res && res[1]) {
            console.log(res[1]);
            that.tabNavTop = res[1].top;
          }
        });
      });
    },
    activeSearch() {
      let that = this;
      that.searchDisabled = true;
    },
    disabledSearch() {
      let that = this;
      that.searchDisabled = false;
    },
    navToSearch() {
      uni.navigateTo({
        url: `/pages/public/search`,
      });
    },
    goSearch() {
      let that = this;
      if (!that.searchContent) {
        that.$toast("输入关键字搜索");
        return false;
      }
      uni.navigateTo({
        url: `/pages/product/list?s=${that.searchContent}`,
      });
    },
    // #ifdef H5

    // #endif
    loadHomePageData() {
      let that = this;
      uni.showLoading();
      that.$http
        .post(that.$api.index.index)
        .then((res) => {
          uni.hideLoading();
          if (res.return_code === "0000") {
            that._formatData(res.data);
          } else {
            console.log(res);
          }
        })
        .catch((error) => {
          uni.hideLoading();
          console.log(error);
        });
    },
    //tab 切换
    changeTab(e) {
      let that = this;
      that.tabCurrentIndex = e.target.current;
    },
    // tab 点击
    clickTab(tabCurrentIndex) {
      let that = this;
      that.tabCurrentIndex = tabCurrentIndex;
    },
    navToGoodsList(tid) {
      uni.navigateTo({
        url: `/pages/product/list?tid=${tid}`,
      });
    },
    //详情页
    navToDetailPage(item) {
      let pIdRegx = new RegExp("product-(\\d+)\\.html", "gi");
      let pId = pIdRegx.exec(item.goodsLink)[1] || 0;
      if (!pId) {
        that.$toast("商品不存在");
        return false;
      }
      uni.navigateTo({
        url: `/pages/product/product?id=${pId}`,
      });
    },
  },
};
</script>

<style lang="scss">
.mp-search-box {
  background-color: #ffffff;
  width: 100%;
  padding: 22rpx 29rpx 21rpx 30rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: var(--window-top);
  z-index: 99;
  color: rgba(187, 187, 187, 1);
  font-size: 24rpx;
  .icon-sousuo {
    position: absolute;
    top: 40rpx;
    left: 60rpx;
  }
  .ser-input {
    flex: 1;
    height: 64rpx;
    line-height: 64rpx;
    text-align: left;
    border-radius: 32px;
    background: rgba(238, 238, 238, 1);
    padding-left: 67rpx;
  }
}

.search-padding {
  height: 106rpx;
  width: 100%;
}

page {
  height: 100%;
}

.container {
  height: 100%;
  background-color: $page-color-base;
}

.index-scroll {
  height: 100%;
}

.slide,
.categorys,
.adv,
.index-goods {
  background-color: #ffffff;
}

.is-sticky {
  /* #ifndef APP-PLUS-NVUE */
  display: flex;
  position: -webkit-sticky;
  /* #endif */
  position: sticky;
  top: var(--window-top);
  z-index: 99;
}

.slide {
  padding: 20rpx 0;
  box-sizing: border-box;
  .slide-swiper {
    height: 335rpx;
    .slide-swiper-item {
      display: flex;
      justify-content: center;
      align-items: center;
      image {
        flex: auto;
        height: 100%;
        border-radius: 16rpx;
      }
      text {
        flex: none;
        width: 15rpx;
      }
    }
  }
}

.categorys {
  padding: 9rpx 0 40rpx 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .category-item {
    font-size: 24rpx;
    color: $font-color-light;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 50rpx 44rpx 0 0;
    &:nth-child(5n) {
      margin-right: 0;
    }
    image {
      width: 96rpx;
      height: 114rpx;
    }
  }
}

.adv {
  image {
    width: 100%;
    height: 214rpx;
  }
}

.index-goods {
  padding: 0 0 40rpx 30rpx;
  box-sizing: border-box;
  font-size: 24rpx;
  .title {
    font-size: 32rpx;
    font-weight: bold;
    padding: 27rpx 0;
    box-sizing: border-box;
  }
  .goods {
    margin-top: 13rpx;
    white-space: nowrap; // 滚动必须加的属性
    .goods-item {
      width: 176rpx;
      display: inline-block;
      margin-right: 20rpx;
      image {
        width: 176rpx;
        height: 176rpx;
        border-radius: 12rpx;
      }
      .name {
        white-space: normal;
        margin-top: 20rpx;
        width: 176rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .price {
        display: inline-block;
        font-size: 28rpx;
        text-align: left;
        margin-top: 15rpx;
        color: $base-color;
        width: 100%;
      }
    }
  }
}

.tabs {
  margin-top: 20rpx;
  background-color: $page-color-base;
  .navs {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
    background-color: $page-color-base;
    &.is-sticky {
      background-color: #ffffff;
      /*  #ifndef  H5  */
      top: calc(106rpx + var(--window-top));
      /*  #endif  */
      /*  #ifdef  H5  */
      top: 106rpx;
      /*  #endif  */
    }
    .nav-item {
      flex: auto;
      height: 85rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      &.current {
        font-size: 32rpx;
        font-weight: bold;
        position: relative;
        text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        text::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          display: inline-block;
          width: 30rpx;
          height: 8rpx;
          background: linear-gradient(
            270deg,
            rgba(255, 131, 106, 1) 0%,
            rgba(255, 96, 96, 1) 100%
          );
          border-radius: 4rpx;
          margin-top: 6rpx;
        }
      }
    }
  }
  .content {
    padding: 0 31rpx;
    box-sizing: border-box;
    margin-top: 20rpx;
    flex: auto;
    width: 100%;
    .tab-swiper {
      height: 100%;
      .tab-swiper-item {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        align-content: flex-start;
        flex-wrap: wrap;
        .goods-item {
          background-color: #ffffff;
          border-radius: 16rpx;
          overflow: hidden;
          padding-bottom: 30rpx;
          box-sizing: border-box;
          font-size: 28rpx;
          width: 335rpx;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          margin-top: 22rpx;
          &:nth-child(2n-1) {
            margin-right: 20rpx;
          }
          > view {
            width: 100%;
          }
          .image {
            image {
              width: 335rpx;
              height: 335rpx;
            }
          }
          .name {
            margin-top: 30rpx;
            padding: 0 44rpx 0 30rpx;
            box-sizing: border-box;
            width: 335rpx;
            height: 70rpx;
            line-height: 35rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .price {
            margin-top: 40rpx;
            padding-left: 20rpx;
            box-sizing: border-box;
            .sale {
              font-size: 36rpx;
              color: $base-color;
            }
            .market {
              font-size: 20rpx;
              color: $font-color-disabled;
              text-decoration: line-through;
              margin-left: 20rpx;
            }
          }
        }
      }
    }
  }
}
</style>
