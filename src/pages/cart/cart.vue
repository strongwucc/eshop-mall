<template>
  <view class="container">
    <!-- 空白页 -->
    <view v-if="loaded && (cartInfo.items_count === 0)" class="empty">
      <image src="/static/emptyCart.jpg" mode="aspectFit"></image>
      <view v-if="hasLogin" class="empty-tips">
        空空如也
        <navigator
          class="navigator"
          v-if="hasLogin"
          url="../index/index"
          open-type="switchTab"
        >随便逛逛></navigator>
      </view>
      <view v-else class="empty-tips">
        空空如也
        <view class="navigator" @click="navToLogin">去登陆></view>
      </view>
    </view>
    <template v-else>
      <view class="unempty">
        <!-- 促销信息 -->
        <view class="promotion" v-if="unuseRule.length > 0 || useRule.length > 0">
          <view class="used item" v-if="useRule.length > 0">
            <view class="title">
              <text class="notice">您已参与</text>
              <text class="coudan" @click="couDan">再逛逛</text>
            </view>
            <view class="rules">
              <view class="rule-item" v-for="(rule, ruleIndex) in useRule" :key="rule.rule_id">
                <text class="icon">{{rule.desc_tag}}</text>
                <text class="content">
                  {{rule.name}}，已减
                  <text class="red">{{rule.discount_amount | formatMoney}}</text>
                </text>
              </view>
            </view>
          </view>
          <view class="unused item" v-if="unuseRule.length > 0">
            <view class="title">
              <text class="notice">您可参与</text>
              <text class="coudan" @click="couDan">去凑单</text>
            </view>
            <view class="rules">
              <view class="rule-item" v-for="(rule, ruleIndex) in unuseRule" :key="ruleIndex">
                <text class="icon">{{rule.desc_tag}}</text>
                <text class="content">{{rule.name}}</text>
              </view>
            </view>
          </view>
        </view>
        <!-- 列表 -->
        <view class="cart-list">
          <view
            class="cart-item"
            v-for="(item, index) in cartInfo.object.goods"
            :key="item.obj_ident"
          >
            <uni-swipe-action>
              <uni-swipe-action-item
                :options="swipeOptions"
                @click="deleteCartItem(index)"
                @change="changeSwipe"
              >
                <view class="left">
                  <image :src="item.obj_items.products[0].image_url" mode="aspectFill" class="loaded" lazy-load></image>
                </view>
                <view class="right">
                  <view class="name">{{item.obj_items.products[0].name}}</view>
                  <view class="spec">{{item.obj_items.products[0].spec_info}}</view>
                  <view class="price-nums">
                    <text class="price">¥{{item.subtotal | formatMoney}}</text>
                    <uni-number-box
                      class="cart-number"
                      :height="56"
                      :width="196"
                      :min="1"
                      :max="item.store.store"
                      :value="item.quantity > item.store.store ? item.store.store : item.quantity"
                      :isMax="item.quantity >= item.stock ? true : false"
                      :isMin="item.quantity === 1"
                      :index="index"
                      @eventChange="numberChange"
                    ></uni-number-box>
                  </view>
                </view>
              </uni-swipe-action-item>
            </uni-swipe-action>
          </view>
        </view>
      </view>
      <!-- 底部菜单栏 -->
      <view class="action-section">
        <view class="left">
          <view class="total-amount">
            <text class="label">合计：</text>
            <text class="value">￥{{cartInfo.promotion_subtotal | formatMoney}}</text>
          </view>
          <view class="total-discount">
            <text class="label">已优惠：</text>
            <text class="value">￥{{cartInfo.subtotal_discount | formatMoney}}</text>
          </view>
        </view>
        <view class="right" @click="createOrder">去结算({{cartInfo.items_quantity || 0}})</view>
      </view>
    </template>
  </view>
</template>

<script>
import { mapState } from "vuex";
import uniNumberBox from "@/components/uni-number-box.vue";
import uniSwipeAction from "@/components/uni-swipe-action/uni-swipe-action.vue";
import uniSwipeActionItem from "@/components/uni-swipe-action-item/uni-swipe-action-item.vue";
export default {
  components: {
    uniNumberBox,
    uniSwipeAction,
    uniSwipeActionItem
  },
  data() {
    return {
      loaded: false,
      unuseRule: [],
      useRule: [],
      swipeOptions: [
        {
          text: "删除",
          style: {
            backgroundColor: "#fa436a",
            borderRadius: "12rpx 0 0 12rpx"
          }
        }
      ],
      cartInfo: {
        object: {
          goods: []
        },
        subtotal: 0.0,
        subtotal_price: 0.0,
        subtotal_discount: 0.0,
        items_quantity: 0,
        items_count: 0,
        discount_amount_order: 0.0,
        discount_amount: 0.0,
        promotion_subtotal: 0.0
      },
      allChecked: false, //全选状态  true|false
      requesting: false
    };
  },
  onLoad() {
    this.loadData();
  },
  watch: {},
  computed: {
    ...mapState(["hasLogin"])
  },
  methods: {
    /**
     * 获取购物车数据
     */
    loadData() {
      let that = this;
      that
        .getCartInfo()
        .then(res => {
          if (res.return_code === "0000") {
            that.cartInfo = res.data.aCart;
            that.useRule = res.data.use_rule || [];
            that.unuseRule = res.data.unuse_rule || [];
          } else {
            console.log(res);
          }
          that.$nextTick(() => {
            that.loaded = true;
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    couDan() {
      uni.navigateTo({
        url: "/pages/index/index"
      });
    },
    changeSwipe(open) {
      console.log("当前开启状态：" + open);
    },
    clickSwipe(e) {
      console.log(e);
    },
    navToLogin() {
      uni.navigateTo({
        url: "/pages/public/login"
      });
    },
    /**
     * 获取购物车
     */
    getCartInfo() {
      let that = this;
      return that.$http.post(that.$api.cart.cart);
    },
    /**
     * 加入购物车
     */
    addCart(goodsId, productId) {
      let that = this;

      return that.$http.post(that.$api.cart.add, {
        goods_id: goodsId,
        product_id: productId,
        num: 1,
        mini_cart: true
      });
    },
    /**
     * 更新购物车
     */
    updateCart(goodsIdent, quantity) {
      let that = this;
      let dataKey = `modify_quantity[${goodsIdent}][quantity]`;
      let data = {
        obj_type: "goods",
        goods_ident: goodsIdent,
        goods_id: goodsIdent.split("_")[1],
        response_type: true
      };
      data[dataKey] = quantity;

      return that.$http.post(that.$api.cart.update, data);
    },
    /**
     * 删除清空购物车
     */
    removeCart(goodsIdent = "", quantity = 0) {
      let that = this;

      let data = {
        obj_type: "goods",
        goods_ident: goodsIdent,
        goods_id: goodsIdent.split("_")[1],
        response_type: true
      };

      if (goodsIdent !== "") {
        let dataKey = `modify_quantity[${goodsIdent}][quantity]`;
        data[dataKey] = quantity;
      }

      return that.$http.post(that.$api.cart.remove, data);
    },
    /**
     * 数量
     */
    async numberChange(data) {
      let that = this;

      let goodsData = that.cartInfo.object.goods;

      let oldStore = goodsData[data.index].quantity;
      let newStore = data.number;

      let cartIdent = goodsData[data.index].obj_ident;
      let [cartType, goodsId, productId] = cartIdent.split("_");

      if (newStore - oldStore === 1) {
        that.$loading.show();
        let addRes = await that.addCart(goodsId, productId);
        that.$loading.hide();
        if (addRes.return_code !== "0000") {
          that.$toast(addRes.error);
        } else {
          that.loadData();
        }
      } else if (newStore !== oldStore) {
        console.log("from: ", oldStore, ", to: ", newStore);
        that.$loading.show();
        let updateRes = await that.updateCart(cartIdent, newStore);
        that.$loading.hide();
        if (updateRes.return_code === "0000") {
          that.loadData();
        } else {
          that.$toast(updateRes.error);
        }
      }
    },
    /**
     * 删除
     */
    deleteCartItem(index) {
      let that = this;
      uni.showModal({
        content: "确认移除商品？",
        success: e => {
          if (e.confirm) {
            console.log(index);
            let goodsData = that.cartInfo.object.goods;
            let quantity = goodsData[index].quantity;
            let cartIdent = goodsData[index].obj_ident;
            let [cartType, goodsId, productId] = cartIdent.split("_");
            that.$loading.show();
            that
              .removeCart(cartIdent, quantity)
              .then(removeRes => {
                that.$loading.hide();
                if (removeRes.return_code === "0000") {
                  that.cartInfo.object.goods.splice(index, 1);
                  if (removeRes.data.is_empty) {
                    that.cartInfo = Object.assign({}, that.cartInfo, {
                      subtotal: 0.0,
                      subtotal_price: 0.0,
                      subtotal_discount: 0.0,
                      items_quantity: 0,
                      items_count: 0,
                      discount_amount_order: 0.0,
                      discount_amount: 0.0,
                      promotion_subtotal: 0.0
                    });
                  } else {
                    that.cartInfo = Object.assign(
                      {},
                      that.cartInfo,
                      removeRes.data.sub_total
                    );
                  }
                } else {
                  that.$toast(removeRes.error);
                }
              })
              .catch(error => {
                console.log(error);
              });
          }
        }
      });
    },
    /**
     * 清空
     */
    clearCart() {
      uni.showModal({
        content: "清空购物车？",
        success: e => {
          if (e.confirm) {
            console.log(e);
          }
        }
      });
    },
    //创建订单
    createOrder() {
      uni.navigateTo({
        url: `/pages/order/createOrder`
      });
    }
  }
};
</script>

<style lang='scss'>
page {
  min-height: 100%;
  background-color: $page-color-base;
}
.container {
  height: 100%;
  font-size: 28rpx;

  /* 空白页 */
  .empty {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    padding-bottom: 100rpx;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background: #fff;

    image {
      width: 240rpx;
      height: 160rpx;
      margin-bottom: 30rpx;
    }

    .empty-tips {
      display: flex;
      font-size: $font-sm + 2rpx;
      color: $font-color-disabled;

      .navigator {
        color: $uni-color-primary;
        margin-left: 16rpx;
      }
    }
  }

  .unempty {
    height: 100%;
    padding: 20rpx 30rpx calc(126rpx + var(--window-bottom));
    box-sizing: border-box;
    background-color: $page-color-base;
    .promotion,
    .cart-list {
      background-color: #ffffff;
      border-radius: 16rpx;
    }
    .promotion {
      padding-left: 32rpx;
      box-sizing: border-box;
      margin-bottom: 20rpx;
      .item {
        .title {
          height: 82rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2rpx solid $page-color-base;
          .coudan {
            margin-right: 30rpx;
            color: $base-color;
          }
        }
        .rules {
          .rule-item {
            height: 98rpx;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .icon {
              width: 60rpx;
              height: 34rpx;
              background-color: $base-color;
              font-size: 20rpx;
              color: #ffffff;
              line-height: 34rpx;
              text-align: center;
              border-radius: 6rpx;
              margin-right: 20rpx;
            }
            .content {
              .red {
                color: $base-color;
              }
            }
          }
        }
      }
    }
    .cart-list {
      padding: 10rpx 0;
      box-sizing: border-box;
      width: 100%;
      .cart-item {
        width: 100%;
        padding: 30rpx;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          flex: none;
          image {
            height: 200rpx;
            width: 200rpx;
          }
        }
        .right {
          min-height: 200rpx;
          margin-left: 20rpx;
          flex: auto;
          .name {
            height: 76rpx;
            overflow: hidden;
          }
          .spec {
            margin-top: 10rpx;
            font-size: 24rpx;
            color: $font-color-light;
          }
          .price-nums {
            margin-top: 66rpx;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 32rpx;
            .price {
              color: $base-color;
            }
            .cart-number {
              width: 196rpx;
            }
          }
        }
      }
    }
  }

  .action-section {
    z-index: 9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 106rpx;
    position: fixed;
    bottom: var(--window-bottom);
    width: 100%;

    .left {
      flex: auto;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      padding: 14rpx 30rpx;
      box-sizing: border-box;
      background-color: #ffffff;
      height: 100%;

      .total-amount {
        .label {
          font-size: 28rpx;
        }

        .value {
          font-size: 32rpx;
          color: $base-color;
        }
      }

      .total-discount {
        font-size: 24rpx;
        color: $font-color-light;
      }
    }

    .right {
      flex: none;
      width: 260rpx;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $base-color;
      color: #ffffff;
      font-size: 32rpx;
    }
  }
}
</style>
