<template>
  <view class="container">
    <scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadComment">
      <empty v-if="commentLoaded === true && comments.length === 0"></empty>
      <view class="comment-item" v-else v-for="(comment, commentIndex) in comments" :key="comment.comment_id">
        <view class="comment">
          <view class="left"><image :src="'/static/avatar_default@2x.png'"></image></view>
          <view class="right">
            <view class="author-comment">
              <view class="name">{{comment.author | siteMobile}}</view>
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
      </view>
      <uni-load-more :status="commentLoadingType"></uni-load-more>
    </scroll-view>
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
      goodsId: 0,
      comments: [],
      commentPage: 1,
      commentLoadingType: "more",
      commentLoaded: false
    };
  },
  onLoad(options) {
    let that = this;
    that.goodsId = options.gid || 0;
  },
  onShow() {
    let that = this;
    that.loadComment();
  },
  methods: {
    /**
     * 评论
     */
    loadComment(source) {
      let that = this;

      if (that.commentLoaded === true) {
        return false;
      }

      if (that.commentLoadingType === "noMore") {
        return false;
      }
      that.commentLoadingType = "loading";
      that.$http
        .post(that.$api.goods.comments, { goods_id: that.goodsId, page: that.commentPage })
        .then(res => {
          that.commentLoaded = true;
          if (res.return_code === "0000") {
            if (~~res.data.discusscurrent >= ~~res.data.discusstotalpage) {
              that.commentLoadingType = "noMore";
            } else {
              that.commentLoadingType = "more";
              that.commentPage = that.commentPage + 1;
            }

            if (res.data.list.discuss && res.data.list.discuss.length > 0) {
              let comments = res.data.list.discuss;
              that.comments = that.comments.concat(comments);
            }
          } else {
            console.log(res);
            that.commentLoadingType = "more";
          }
        })
        .catch(error => {
          console.log(error);
          that.commentLoadingType = "more";
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
  background-color: $page-color-base;
}
.list-scroll-content {
  height: 100%;
  padding: 20rpx 30rpx;
  box-sizing: border-box;
  .comment-item {
    background: #ffffff;
    padding: 30rpx;
    box-sizing: border-box;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  }
}
</style>