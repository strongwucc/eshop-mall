<template>
  <view class="container" :class="{'no-padding': step > 1}">
    <view class="step-0" v-show="step === 0">
      <view class="return-type change" @click="selectReturnType(1)">
        <text class="label">我要换货</text>
        <text class="yticon icon-you"></text>
      </view>
      <view class="return-type return" @click="selectReturnType(2)">
        <text class="label">我要退货</text>
        <text class="yticon icon-you"></text>
      </view>
    </view>
    <view class="step-1" v-show="step === 1">
      <view class="scroll-container">
        <scroll-view class="reason-scroll" scroll-y>
          <view class="targets">
            <view class="title" @click="selectProduct">
              <text class="star">*</text>
              <text class="notice">
                选择
                <template v-if="returnType === 1">换货</template>
                <template v-if="returnType === 2">退货</template>商品
              </text>
              <text class="quantity">
                <template v-if="products.length === 0">暂未选择商品</template>
                <template v-else>已选{{totalCounter}}件</template>
              </text>
              <text class="yticon icon-you"></text>
            </view>
            <view class="goods" v-if="totalCounter > 0">
            <!-- <view class="goods"> -->
              <scroll-view class="goods-scroll" scroll-x enable-flex="true">
                <view class="selected-item" v-for="(product, productIndex) in products" :key="product.product_id">
                  <template v-if="product.quantity > 0">
                    <image :src="product.image_url"></image>
                    <!-- <text class="nums">x{{product.quantity}}</text> -->
                  </template>
                </view>
              </scroll-view>
            </view>
          </view>
          <view class="reasons">
            <view class="simple">
              <view class="label">
                <text class="star">*</text>
                <text class="txt">
                  <template v-if="returnType === 1">换货</template>
                  <template v-if="returnType === 2">退货</template>理由
                </text>
              </view>
              <view class="input">
                <input type="text" v-model="title" placeholder="简单描述换货理由" />
              </view>
            </view>
            <view class="long">
              <view class="label">详情描述</view>
              <textarea :value="content" placeholder="请描述遇到的问题" @input="contentInput"></textarea>
              <view class="counter">
                <text class="cur">{{contentCounter}}</text>
                <text class="total">/100字</text>
              </view>
            </view>
            <view class="image">
              <text class="yticon icon-image"></text>
              <text class="txt">上传图片</text>
            </view>
          </view>
        </scroll-view>
      </view>
      <view class="action">
        <view class="notice">
          <text class="yticon icon-xuanzhong2"></text>
          <text class="txt">同意</text>
          <text class="content">《售后服务须知》</text>
        </view>
        <view class="btn">提交申请</view>
      </view>
    </view>
    <view class="goods-container" v-show="step === 2" :class="{show: showGoods, hide: !showGoods}">
      <view class="title">
        <text class="quantity">已选{{totalCounter}}件</text>
        <text class="reset" @click="_resetProduct">重置</text>
      </view>
      <view class="product-list">
        <scroll-view class="product-scroll" scroll-y >
          <view class="product-item" v-for="(product, productIndex) in order.goods_list" :key="product.product_id">
            <view class="left">
              <image :src="product.image_url" lazy-load="true" mode="aspectFit"></image>
            </view>
            <view class="right">
              <view class="name">{{product.products.name}}</view>
              <view class="spec">{{product.products.spec_info || ''}}</view>
              <view class="price-nums">
                <text class="price">￥{{product.price | formatMoney}}</text>
                <text class="nums">x{{product.quantity}}</text>
              </view>
              <view class="numbers">
                <uni-number-box 
                  :min="0"
                  :max="product.quantity"
                  :value="products[productIndex].quantity"
                  :isMax="products[productIndex].quantity >= product.quantity ? true : false"
                  :isMin="products[productIndex].quantity === 0"
                  :index="productIndex"
                  @eventChange="numberChange"
							  ></uni-number-box>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
      <view class="btn" @click="confirmProduct">确定</view>
    </view>
  </view>
</template>

<script>
import uniNumberBox from '@/components/uni-number-box.vue'
export default {
  components: {
    uniNumberBox
  },
  data() {
    return {
      step: 1,
      orderId: "",
      returnType: 1,
      order: {
        goods_list: []
      },
      products: [],
      title: "",
      content: "",
      showGoods: false
    };
  },
  computed: {
    contentCounter () {
      let that = this;
      return that.content.length || 0;
    },
    totalCounter () {
      let counter = 0;
      let that = this;
      that.products.forEach(product => {
        counter += ~~product.quantity;
      })
      return counter;
    }
  },
  onLoad(options) {
    let that = this;
    that.orderId = options.orderId || "";
  },
  onShow() {
    let that = this;
    that.loadAddData();
  },
  methods: {
    _resetProduct () {
      let that = this;
      let products = that.order.goods_list.map(goodsItem => {
        let {product_id, image_url} = goodsItem;
        return {product_id, image_url, quantity: 0};
      });
      that.products = products;
    },
    /**
     * 获取订单信息
     */
    loadAddData() {
      let that = this;
      that.$http
        .post(that.$api.user.addRec, { order_id: that.orderId })
        .then(res => {
          if (res.return_code === "0000") {
            that.order = Object.assign({}, that.order, res.data.order);
            that._resetProduct();
          } else {
            console.log(res);
            that.$toast("订单信息获取失败");
          }
        })
        .catch(error => {
          console.log(error);
          that.$toast("出错啦");
        });
    },
    /**
     * 选择退换货
     */
    selectReturnType(returnType) {
      let that = this;
      that.returnType = ~~returnType;
      that.step = 1;
    },
    selectProduct () {
      let that = this;
      that.step = 2;
      that.$nextTick(() => {
        that.showGoods = true;
      });
    },
    contentInput (e) {
      let that = this;
      let content = e.detail.value.substring(0, 100);

      setTimeout(function () {
        that.content = content;
      }, 0);
    },
    numberChange (e) {
      let that = this;
      that.products[e.index]['quantity'] = ~~ e.number;
      console.log(e);
    },
    confirmProduct () {
      let that = this;
      that.step = 1;
      that.$nextTick(() => {
        that.showGoods = false;
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
  background: $page-color-base;
  font-size: 28rpx;
  padding-top: 20rpx;
  &.no-padding {
    padding-top: 0;
  }
}
.step-0,
.step-1,
.goods-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 28rpx;
}
.step-0 {
  margin: 0 30rpx;
  background: #ffffff;
  border-radius: 16rpx;
  height: 242rpx;
  padding-left: 30rpx;
  box-sizing: border-box;
  .return-type {
    width: 100%;
    padding-right: 30rpx;
    box-sizing: border-box;
    flex: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &:first-child {
      border-bottom: 2rpx solid $page-color-base;
    }
    .icon-you {
      color: $font-color-light;
      font-weight: bold;
    }
  }
}
.step-1 {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  .star {
    color: $base-color;
    margin-right: 20rpx;
  }
  .scroll-container, .action {
    width: 100%;
  }
  .scroll-container {
    flex: auto;
    height: 100rpx;
    padding: 0 30rpx;
    box-sizing: border-box;
    .reason-scroll {
      height: 100%;
    }
  }
  .targets, .reasons {
    width: 100%;
    border-radius: 16rpx;
    background: #ffffff;
  }
  .targets {
    .title {
      height: 108rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 34rpx 0 20rpx;
      box-sizing: border-box;
      text {
        flex: none;
      }
      .quantity {
        color: $font-color-light;
        flex: auto;
        padding-right: 18rpx;
        box-sizing: border-box;
        text-align: right;
      }
      .icon-you {
        margin-top: 10rpx;
      }
    }
    .goods {
      .goods-scroll {
        height: 120rpx;
        white-space: nowrap;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .selected-item {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 10rpx;
          image {
            width: 120rpx;
            height: 120rpx;
          }
          .nums {
            color: $font-color-light;
          }
        }
      }
    }
  }
  .reasons {
    margin-top: 20rpx;
    padding-bottom: 40rpx;
    box-sizing: border-box;
    .simple {
      .label {
        padding: 30rpx 20rpx;
        box-sizing: border-box;
      }
      .input {
        margin-left: 44rpx;
        padding-bottom: 22rpx;
        box-sizing: border-box;
        border-bottom: 2rpx solid $page-color-base;
      }
    }
    .long {
      padding: 30rpx 30rpx 0 44rpx;
      box-sizing: border-box;
      .label {
        padding-bottom: 30rpx;
        box-sizing: border-box;
      }
      .counter {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .total {
          color: $font-color-light;
        }
      }
    }
    .image {
      width: 160rpx;
      height: 160rpx;
      margin: 58rpx 44rpx 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: $font-color-light;
      border: 2rpx solid $page-color-base;
      .icon-image {
        font-size: 48rpx;
      }
      .txt {
        font-size: 24rpx;
        margin-top: 12rpx;
      }
    }
  }
  .action {
    flex: none;
    display: flex;
    flex-direction: column;
    >view {
      width: 100%;
    }
    .notice {
      height: 88rpx;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      box-shadow:0px -2rpx 20rpx rgba(0,0,0,0.05);
      .icon-xuanzhong2 {
        font-size: 40rpx;
        color: $font-color-light;
        margin: 0 10rpx 0 20rpx;
      }
      .content {
        margin-left: 10rpx;
        color: $font-color-spec;
      }
    }
    .btn {
      height: 98rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32rpx;
      background: $base-color;
      color: #ffffff;
    }
  }
}
.goods-container {
  height: 100%;
  justify-content: flex-start;
  transition: transform .3s;
  transform: translateX(100%);
  &.show {
    transform: translateX(0);
  }
  &.hide {
    transform: translateX(100%);
  }
  >view {
    width: 100%;
  }
  .title {
    background: #ffffff;
    flex: none;
    height: 120rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx;
    box-sizing: border-box;
    .quantity {
      color: $font-color-light;
    }
  }
  .product-list {
    flex: auto;
    height: 100rpx;
    padding: 20rpx;
    box-sizing: border-box;
    .product-scroll {
      height: 100%;
      background: #ffffff;
      border-radius: 16rpx;
      .product-item {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 40rpx 30rpx 46rpx;
        box-sizing: border-box;
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
          .name {
            height: 76rpx;
            overflow: hidden;
          }
          .spec {
            margin-top: 10rpx;
            color: $font-color-light;
            font-size: 24rpx;
          }
          .price-nums {
            margin-top: 34rpx;
            .nums {
              color: $font-color-light;
              font-size: 24rpx;
              margin-left: 20rpx;
            }
          }
          .numbers {
            position: relative;
            height: 120rpx;
            display: flex;
            justify-content: flex-end;
            align-items: center;
          }
        }
      }
    }
  }
  .btn {
    flex: none;
    height: 98rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32rpx;
    background: $base-color;
    color: #ffffff;
  }
}
</style>