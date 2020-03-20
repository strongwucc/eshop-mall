<template>
	<view class="container">
		<!-- 空白页 -->
		<view v-if="loaded && (!hasLogin || cartInfo.items_count === 0)" class="empty">
			<image src="/static/emptyCart.jpg" mode="aspectFit"></image>
			<view v-if="hasLogin" class="empty-tips">
				空空如也
				<navigator class="navigator" v-if="hasLogin" url="../index/index" open-type="switchTab">随便逛逛></navigator>
			</view>
			<view v-else class="empty-tips">
				空空如也
				<view class="navigator" @click="navToLogin">去登陆></view>
			</view>
		</view>
		<view v-else>
			<!-- 列表 -->
			<view class="cart-list">
				<block v-for="(item, index) in cartInfo.object.goods" :key="item.obj_ident">
					<view
						class="cart-item" 
						:class="{'b-b': index !== cartInfo.object.goods.length-1}"
					>
						<view class="image-wrapper">
							<image :src="item.obj_items.products[0].image_url" 
								mode="aspectFill"
								class="loaded" 
								lazy-load 
							></image>
							<!-- <view 
								class="yticon icon-xuanzhong2 checkbox"
								:class="{checked: item.checked}"
								@click="check('item', index)"
							></view> -->
						</view>
						<view class="item-right">
							<text class="clamp title">{{item.obj_items.products[0].name}}</text>
							<text class="attr">{{item.obj_items.products[0].spec_info}}</text>
							<text class="price">¥{{item.subtotal | formatMoney}}</text>
							<uni-number-box 
								class="step"
								:min="1"
								:max="item.store.store"
								:value="item.quantity > item.store.store ? item.store.store : item.quantity"
								:isMax="item.quantity >= item.stock ? true : false"
								:isMin="item.quantity === 1"
								:index="index"
								@eventChange="numberChange"
							></uni-number-box>
						</view>
						<text class="del-btn yticon icon-fork" @click="deleteCartItem(index)"></text>
					</view>
				</block>
			</view>
			<!-- 底部菜单栏 -->
			<view class="action-section">
				<!-- <view class="checkbox">
					<image 
						:src="allChecked?'/static/selected.png':'/static/select.png'" 
						mode="aspectFit"
						@click="check('all')"
					></image>
					<view class="clear-btn" :class="{show: allChecked}" @click="clearCart">
						清空
					</view>
				</view> -->
				<view class="total-box">
					<text class="count">共 {{cartInfo.items_quantity || 0}} 件，</text>
					<text class="price">总价 ¥{{cartInfo.promotion_subtotal | formatMoney}}</text>
					<!-- <text class="coupon">已优惠<text>{{cartInfo.subtotal_discount || 0.00}}</text>元</text> -->
				</view>
				<button type="primary" class="no-border confirm-btn" @click="createOrder">去结算</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import uniNumberBox from '@/components/uni-number-box.vue'
	export default {
		components: {
			uniNumberBox
		},
		data() {
			return {
				loaded: false,
				cartInfo: {
					object: {
						goods: []
					},
					subtotal: 0.00,
					subtotal_price: 0.00,
					subtotal_discount: 0.00,
					items_quantity: 0,
					items_count: 0,
					discount_amount_order: 0.00,
					discount_amount: 0.00,
					promotion_subtotal: 0.00
				},
				allChecked: false, //全选状态  true|false
				requesting: false,
			};
		},
		onLoad(){
			this.loadData();
		},
		watch:{
		},
		computed:{
			...mapState(['hasLogin'])
		},
		methods: {
			/**
			 * 获取购物车数据
			 */
			loadData(){
				let that = this;
				that.getCartInfo().then(res => {
					if (res.return_code === '0000') {
						that.cartInfo = res.data.aCart;
					} else {
						console.log(res);
					}
					that.$nextTick(() => {
						that.loaded = true;
					});
				}).catch(error => {
					console.log(error);
				});
			},
			navToLogin(){
				uni.navigateTo({
					url: '/pages/public/login'
				})
			},
			/**
			 * 获取购物车
			 */
			getCartInfo () {

				let that = this;
				return that.$http.post(
					that.$api.cart.cart
				);

			},
			/**
			 * 加入购物车
			 */
			addCart (goodsId, productId) {

				let that = this;

				return that.$http.post(
					that.$api.cart.add,
					{goods_id: goodsId, product_id: productId, num: 1, mini_cart: true}
				);

			},
			/**
			 * 更新购物车
			 */
			updateCart(goodsIdent, quantity) {
			  let that = this;
			  let dataKey = `modify_quantity[${goodsIdent}][quantity]`;
			  let data = {
			    obj_type: 'goods',
			    goods_ident: goodsIdent,
			    goods_id: goodsIdent.split('_')[1],
			    response_type: true
			  };
			  data[dataKey] = quantity;

			  return that.$http.post(
			    that.$api.cart.update,
			    data
			  );
			},
			/**
			 * 删除清空购物车
			 */
			removeCart(goodsIdent = '', quantity = 0) {
			  let that = this;

			  let data = {
					obj_type: 'goods',
					goods_ident: goodsIdent,
					goods_id: goodsIdent.split('_')[1],
					response_type: true
				};

			  if (goodsIdent !== '') {
					let dataKey = `modify_quantity[${goodsIdent}][quantity]`;
					data[dataKey] = quantity;
			  }

			  return that.$http.post(
			    that.$api.cart.remove,
			    data
			  );
			},
			/**
			 * 数量
			 */
			async numberChange(data){

				let that = this;

				let goodsData = that.cartInfo.object.goods;
				
				let oldStore = goodsData[data.index].quantity;
				let newStore = data.number;

				let cartIdent = goodsData[data.index].obj_ident;
				let [cartType, goodsId, productId] = cartIdent.split('_');

				if (newStore - oldStore === 1) {
					that.$loading.show();
					let addRes = await that.addCart(goodsId, productId);
					that.$loading.hide();
					if (addRes.return_code !== '0000') {
						that.$toast(addRes.error);
					} else {
						that.loadData();
					}

				} else if (newStore !== oldStore) {
					console.log('from: ',oldStore, ', to: ', newStore);
					that.$loading.show();
					let updateRes = await that.updateCart(cartIdent, newStore);
					that.$loading.hide();
					if (updateRes.return_code === '0000') {
						that.cartInfo = Object.assign({}, that.cartInfo, updateRes.data.sub_total);
						that.$set(goodsData[data.index], 'subtotal', goodsData[data.index].subtotal / oldStore * newStore);
						that.$set(goodsData[data.index], 'quantity', newStore);
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
			    content: '确认移除商品？',
			    success: (e) => {
			      if (e.confirm) {
			        console.log(index);
			        let goodsData = that.cartInfo.object.goods;
			        let quantity = goodsData[index].quantity;
			        let cartIdent = goodsData[index].obj_ident;
			        let [cartType, goodsId, productId] = cartIdent.split('_');
			        that.$loading.show();
			        that.removeCart(cartIdent, quantity).then(removeRes => {
			          that.$loading.hide();
			          if (removeRes.return_code === '0000') {
			            that.cartInfo.object.goods.splice(index, 1);
			            if (removeRes.data.is_empty) {
			              that.cartInfo = Object.assign({}, that.cartInfo, {
			                subtotal: 0.00,
			                subtotal_price: 0.00,
			                subtotal_discount: 0.00,
			                items_quantity: 0,
			                items_count: 0,
			                discount_amount_order: 0.00,
			                discount_amount: 0.00,
			                promotion_subtotal: 0.00
			              });
			            } else {
			              that.cartInfo = Object.assign({}, that.cartInfo, removeRes.data.sub_total);
			            }
			          } else {
			            that.$toast(removeRes.error);
			          }
			        }).catch(error => {
			          console.log(error);
			        });

			      }
			    }
			  })
			},
			/**
			 * 清空
			 */
			clearCart(){
				uni.showModal({
					content: '清空购物车？',
					success: (e)=>{
						if(e.confirm){
							console.log(e);
						}
					}
				})
			},
			//创建订单
			createOrder(){
				uni.navigateTo({
					url: `/pages/order/createOrder`
				})
			}
		}
	}
</script>

<style lang='scss'>
	.container{
		padding-bottom: 134rpx;
		/* 空白页 */
		.empty{
			position:fixed;
			left: 0;
			top:0;
			width: 100%;
			height: 100vh;
			padding-bottom:100rpx;
			display:flex;
			justify-content: center;
			flex-direction: column;
			align-items:center;
			background: #fff;
			image{
				width: 240rpx;
				height: 160rpx;
				margin-bottom:30rpx;
			}
			.empty-tips{
				display:flex;
				font-size: $font-sm+2rpx;
				color: $font-color-disabled;
				.navigator{
					color: $uni-color-primary;
					margin-left: 16rpx;
				}
			}
		}
	}
	/* 购物车列表项 */
	.cart-item{
		display:flex;
		position:relative;
		padding:30rpx 40rpx;
		.image-wrapper{
			width: 230rpx;
			height: 230rpx;
			flex-shrink: 0;
			position:relative;
			image{
				border-radius:8rpx;
			}
		}
		.checkbox{
			position:absolute;
			left:-16rpx;
			top: -16rpx;
			z-index: 8;
			font-size: 44rpx;
			line-height: 1;
			padding: 4rpx;
			color: $font-color-disabled;
			background:#fff;
			border-radius: 50px;
		}
		.item-right{
			display:flex;
			flex-direction: column;
			flex: 1;
			overflow: hidden;
			position:relative;
			padding-left: 30rpx;
			.title,.price{
				font-size:$font-base + 2rpx;
				color: $font-color-dark;
				height: 40rpx;
				line-height: 40rpx;
			}
			.attr{
				font-size: $font-sm + 2rpx;
				color: $font-color-light;
				height: 50rpx;
				line-height: 50rpx;
			}
			.price{
				height: 50rpx;
				line-height:50rpx;
			}
		}
		.del-btn{
			padding:4rpx 10rpx;
			font-size:34rpx; 
			height: 50rpx;
			color: $font-color-light;
		}
	}
	/* 底部栏 */
	.action-section{
		/* #ifdef H5 */
		margin-bottom:100rpx;
		/* #endif */
		position:fixed;
		left: 30rpx;
		bottom:30rpx;
		z-index: 95;
		display: flex;
		align-items: center;
		width: 690rpx;
		height: 100rpx;
		padding: 0 30rpx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20rpx 0 rgba(0,0,0,.5);
		border-radius: 16rpx;
		.checkbox{
			height:52rpx;
			position:relative;
			image{
				width: 52rpx;
				height: 100%;
				position:relative;
				z-index: 5;
			}
		}
		.clear-btn{
			position:absolute;
			left: 26rpx;
			top: 0;
			z-index: 4;
			width: 0;
			height: 52rpx;
			line-height: 52rpx;
			padding-left: 38rpx;
			font-size: $font-base;
			color: #fff;
			background: $font-color-disabled;
			border-radius:0 50px 50px 0;
			opacity: 0;
			transition: .2s;
			&.show{
				opacity: 1;
				width: 120rpx;
			}
		}
		.total-box{
			flex: 1;
			display:flex;
			text-align:right;
			padding-right: 40rpx;
			.price{
				font-size: $font-lg;
				color: $uni-color-primary;
			}
			.coupon{
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: $font-sm;
				color: $font-color-light;
				text{
					color: $font-color-dark;
				}
			}
		}
		.confirm-btn{
			padding: 0 38rpx;
			margin: 0;
			border-radius: 100px;
			height: 76rpx;
			line-height: 76rpx;
			font-size: $font-base + 2rpx;
			background: $uni-color-primary;
			box-shadow: 1px 2px 5px rgba(217, 60, 93, 0.72)
		}
	}
	/* 复选框选中状态 */
	.action-section .checkbox.checked,
	.cart-item .checkbox.checked{
		color: $uni-color-primary;
	}
</style>
