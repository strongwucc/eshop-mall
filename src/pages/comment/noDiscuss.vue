<template>
  <view class="container">
    <view class="navbar">
      <view class="nav-item nav-no" :class="{current: tabCurrentIndex === 0}" @click="tabClick(0)">
        <text>待评商品</text>
      </view>
      <view class="nav-item nav-yes" :class="{current: tabCurrentIndex === 1}" @click="tabClick(1)">
        <text>已评商品</text>
      </view>
    </view>
    <view class="navbar-padding"></view>
    <swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
      <swiper-item class="tab-content">
        <scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadDiscuss">
          <empty v-if="discussLoaded === true && discussGoods.length === 0"></empty>
          <view class="discuss-item" v-else v-for="(goods, goodsIndex) in discussGoods" :key="goods.goods_id">
            <view class="left">
              <image :src="goods.image_default_url" mode="aspectFit" :lazy-load="true"></image>
            </view>
            <view class="right">
              <view class="name">{{goods.name}}</view>
              <view class="spec" v-if="goods.spec_info">规格：{{goods.spec_info}}</view>
              <view class="price-nums">
                <text class="price">￥{{goods.price | formatMoney}}</text>
                <text class="nums">x{{goods.number}}</text>
              </view>
              <view class="btn">
                <button @click="toComment(goods)">评论</button>
              </view>
            </view>
          </view>
          <uni-load-more :status="discussLoadingType"></uni-load-more>
        </scroll-view>
      </swiper-item>
      <swiper-item class="tab-content">
        <scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadComment">
          <empty v-if="commentLoaded === true && comments.length === 0"></empty>
          <view class="comment-item" v-else v-for="(comment, commentIndex) in comments" :key="comment.comment_id">
            <view class="comment">
              <view class="left"><image :src="'/static/missing-face.png'"></image></view>
              <view class="right">
                <view class="author-comment">
                  <view class="name">{{comment.author}}</view>
                  <view class="stars"><uni-rate active-color="#fa436a" disabled="true" size="20" :value="comment.pointData.avg" max="5"></uni-rate></view>
                  <view class="content">{{comment.comment}}</view>
                  <view class="time">{{comment.time | formatTime}}</view>
                </view>
                <view class="reply-comment" v-for="(reply, replyIndex) in comment.items" :key="reply.comment_id">
                  <view class="name">商家回复</view>
                  <view class="content">{{reply.comment}}</view>
                  <view class="time">{{reply.time | formatTime}}</view>
                </view>
              </view>
            </view>
            <view class="goods">
              <view class="left"><image :src="comment.goodsData.image_default_url" mode="aspectFit" :lazy-load="true"></image></view>
              <view class="right">
                <view class="name">{{comment.goodsData.name || ''}}</view>
                <view class="price">￥{{comment.goodsData.price}}</view>
              </view>
            </view>
          </view>
          <uni-load-more :status="commentLoadingType"></uni-load-more>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
import empty from "@/components/empty";
import uniRate from '@/components/uni-rate/uni-rate.vue'
export default {
  components: {
    uniLoadMore,
    empty,
    uniRate
  },
  data() {
    return {
      tabCurrentIndex: 0,
      pointType: [],
      discussGoods: [],
      discussPage: 1,
      discussLoadingType: "more",
      discussLoaded: false,
      comments: [],
      commentPage: 1,
      commentLoadingType: "more",
      commentLoaded: false
    };
  },
  onLoad(options) {},
  onShow() {
    let that = this;
    that.loadDiscuss();
    // that.loadComment();
  },
  methods: {
    /**
     * 未评论商品
     */
    loadDiscuss(source) {
      let that = this;

      if (source === "tabChange" && that.discussLoaded === true) {
        //tab切换只有第一次需要加载数据
        return false;
      }

      if (that.discussLoadingType === "noMore") {
        return false;
      }
      that.discussLoadingType = "loading";
      that.$http
        .post(that.$api.user.noDiscuss, { page: that.discussPage })
        .then(res => {
          that.discussLoaded = true;
          if (res.return_code === "0000") {
            if (~~res.data.pager.current === ~~res.data.pager.total) {
              that.discussLoadingType = "noMore";
            } else {
              that.discussLoadingType = "more";
            }

            if (that.pointType.length === 0) {
              that.pointType = res.data.comment_goods_type.map(typeItem => {
                let {type_id, name} = typeItem;
                return {type_id, name, value: 5};
              });
            }

            let discussData = res.data.goods.map(goodsItem => {
              let orderData = {};
              res.data.list.some(orderItem => {
                if (goodsItem.goods_id === orderItem.goods_id) {
                  orderData = orderItem;
                  return true;
                }
                return false;
              })
              return Object.assign(goodsItem, orderData);
            });

            that.discussGoods = that.discussGoods.concat(discussData);
          } else {
            console.log(res);
            that.discussLoadingType = "more";
          }
        })
        .catch(error => {
          console.log(error);
          that.discussLoadingType = "more";
        });
    },
    /**
     * 已评论数据
     */
    loadComment(source) {
      let that = this;

      if (source === "tabChange" && that.commentLoaded === true) {
        //tab切换只有第一次需要加载数据
        return false;
      }

      if (that.commentLoadingType === "noMore") {
        return false;
      }
      that.commentLoadingType = "loading";
      that.$http
        .post(that.$api.user.comments, { page: that.commentPage })
        .then(res => {
          that.commentLoaded = true;
          if (res.return_code === "0000") {
            if (~~res.data.pager.current === ~~res.data.pager.total) {
              that.commentLoadingType = "noMore";
            } else {
              that.commentLoadingType = "more";
            }
            let comments = res.data.commentList.map(commentItem => {
              let commentData = {};
              let goodsData = res.data.goodsList[commentItem.type_id] || {};
              let pointData = res.data.goods_point[commentItem.type_id] || {};
              return Object.assign(commentItem, {goodsData,pointData});
            });
            that.comments = that.comments.concat(comments);
          } else {
            console.log(res);
            that.commentLoadingType = "more";
          }
        })
        .catch(error => {
          console.log(error);
          that.commentLoadingType = "more";
        });
    },
    /**
     * 去评论
     */
    toComment (goods) {
      let that = this;
      let data = Object.assign({}, goods, {pointType: that.pointType});

      try {
        uni.setStorageSync('comment', JSON.stringify(data));
      } catch (e) {
        that.$toast('出错啦!');
        return false;
      }

      uni.navigateTo({
        url: '/pages/comment/comment'
      });
    },
    /**
     * swiper 切换
     */
    changeTab(e) {
      let that = this;
      that.tabCurrentIndex = e.target.current;
      if (e.target.current === 0) {
        that.loadDiscuss("tabChange");
      } else {
        that.loadComment("tabChange");
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
  .discuss-item, .comment-item {
    background: #ffffff;
    padding: 30rpx;
    box-sizing: border-box;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .discuss-item {
    .left {
      flex: none;
      image {
        width: 200rpx;
        height: 200rpx;
      }
    }
    .right {
      flex: auto;
      min-height: 200rpx;
      margin-left: 20rpx;
      display: flex;
      font-size: 32rpx;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      .name {
        height: 76rpx;
        overflow: hidden;
      }
      .price-nums {
        margin-top: 36rpx;
      }
      .price {
        font-weight: bold;
      }
      .spec, .nums {
        font-size: 24rpx;
        color: $font-color-base;
      }
      .nums {
        margin-left: 30rpx;
      }
      .btn {
        width: 100%;
        margin-top: 16rpx;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        button {
          padding: 0;
          margin: 0;
          background: #ffffff;
          box-sizing: border-box;
          width: 160rpx;
          height: 56rpx;
          line-height: 56rpx;
          border: 1px solid $base-color;
          border-radius: 32rpx;
          font-size:28rpx;
          color:$base-color;
        }
      }
    }
  }
  .comment-item {
    flex-direction: column;
    justify-content: flex-start;
    font-size: 28rpx;
    .comment {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .left {
        flex: none;
        align-self: flex-start;
        image {
          width: 60rpx;
          height: 60rpx;
        }
      }
      .right {
        flex: auto;
        margin-left: 18rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        >view {
          width: 100%;
          border-bottom: 1px solid $border-color-dark;
          &:last-child {
            border-bottom: none;
          }
        }
        .author-comment {
          .name {
            margin-top: 10rpx;
          }
        }
        .reply-comment {
          .name {
            margin-top: 30rpx;
          }
          .content {
            margin-top: 20rpx;
          }
        }
        .name {
          font-weight: bold;
        }
        .stars {
          margin: 20rpx 0 20rpx;
        }
        .content {
          line-height: 42rpx;
        }
        .time {
          font-size: 24rpx;
          color: $font-color-light;
          margin: 10rpx 0 32rpx;
        }
      }
    }
    .goods {
      background: $page-color-base;
      border-radius: 16rpx;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx;
      box-sizing: border-box;
      .left {
        flex: none;
        image {
          width: 120rpx;
          height: 120rpx;
        }
      }
      .right {
        margin-left: 20rpx;
        flex: auto;
        view {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          &.price {
            margin-top: 34rpx;
          }
        }
      }
    }
  }
}
</style>