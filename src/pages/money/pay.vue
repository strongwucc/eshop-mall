<template>
	<view class="app">
		<view class="price-box">
			<text>支付金额</text>
			<text class="price">{{orderInfo.total_amount | formatMoney}}</text>
		</view>

		<view class="pay-type-list">

			<!-- <view class="type-item b-b" @click="changePayType(1)">
				<text class="icon yticon icon-weixinzhifu"></text>
				<view class="con">
					<text class="tit">微信支付</text>
					<text>推荐使用微信支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 1' />
					</radio>
				</label>
			</view>
			<view class="type-item b-b" @click="changePayType(2)">
				<text class="icon yticon icon-alipay"></text>
				<view class="con">
					<text class="tit">支付宝支付</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payType == 2' />
					</radio>
				</label>
			</view> -->
			<view class="type-item" v-for="(payment, paymentIndex) in payments" :key="payment.app_id" @click.capture.stop="changePayType(paymentIndex)">
				<text class="icon yticon icon-erjiye-yucunkuan"></text>
				<view class="con">
					<text class="tit">{{payment.app_name}}</text>
					<text v-if="payment.app_id === 'deposit'">可用余额 ¥{{deposit | formatMoney}}</text>
				</view>
				<label class="radio">
					<radio value="" color="#fa436a" :checked='payment.app_id === orderInfo.payinfo.pay_app_id' />
					</radio>
				</label>
			</view>
		</view>
		
		<text class="mix-btn" @click="confirm">确认支付</text>
	</view>
</template>

<script>

	export default {
		data() {
			return {
				orderId: '',
				orderInfo: {
					total_amount: 0.00
				},
				payments: [],
				deposit: 0.00,
				paying: false
			};
		},
		computed: {
		
		},
		onLoad(options) {
			let that = this;
			if (options.order_id) {
				that.orderId = options.order_id;
			}
		},

		onShow () {
			let that = this;
			that.loadData();
		},

		methods: {
			loadData () {
				let that = this;
				that.$http.post(that.$api.user.pay, {order_id: that.orderId}).then(res => {
					console.log(res);
					if (res.return_code === '0000') {
						that.deposit = res.data.deposit_money;
						that.orderInfo = res.data.order;
						that.payments = res.data.payments;
					} else {
						console.log(res);
						that.$toast(res.error);
					}
				}).catch(error => {
					console.log(error);
					that.$toast('出错啦');
				});
			},
			//选择支付方式
			changePayType(paymentIndex) {
				let that = this;
				let {app_id,app_name} = that.payments[paymentIndex];
				let orderInfo = that.orderInfo;
				
				if (app_id === orderInfo.payinfo.pay_app_id) {
					return false;
				}

				that.$http.post(that.$api.user.changePayment, {order_id: that.orderId, app_id: app_id}).then(res => {
					if (res.return_code === '0000') {
						that.$set(that.orderInfo, 'payinfo', {...orderInfo.payinfo, pay_app_id: app_id, pay_name: app_name});
					} else {
						console.log(res);
						that.$toast('更换失败');
					}
				}).catch(error => {
					console.log(error);
					that.$toast('更换失败');
				});


			},
			//确认支付
			confirm: async function() {

				let that = this;

				if (that.paying === true) {
					return false;
				}

				if (!that.orderId) {
					return false;
				}

				if (!that.orderInfo.cur_amount) {
					return false;
				}

				if (!that.orderInfo.payinfo.pay_app_id) {
					return false;
				}

				let payData = {
					order_id: that.orderId,
					cur_money: that.orderInfo.cur_amount,
					pay_app_id: that.orderInfo.payinfo.pay_app_id
				};

				that.$http.post(that.$api.user.doPayment, payData).then(res => {
					console.log(res);
					if (res.return_code === '0000') {
						uni.redirectTo({
							url: '/pages/money/paySuccess?order_id=' + that.orderId
						})
					} else {
						console.log(res);
						that.$toast(res.error);
					}
				}).catch(error => {
					console.log(error);
					that.$toast('支付失败');
				});
			},
		}
	}
</script>

<style lang='scss'>
	.app {
		width: 100%;
	}

	.price-box {
		background-color: #fff;
		height: 265rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 28rpx;
		color: #909399;

		.price{
			font-size: 50rpx;
			color: #303133;
			margin-top: 12rpx;
			&:before{
				content: '￥';
				font-size: 40rpx;
			}
		}
	}

	.pay-type-list {
		margin-top: 20rpx;
		background-color: #fff;
		padding-left: 60rpx;
		
		.type-item{
			height: 120rpx;
			padding: 20rpx 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 60rpx;
			font-size: 30rpx;
			position:relative;
		}
		
		.icon{
			width: 100rpx;
			font-size: 52rpx;
		}
		.icon-erjiye-yucunkuan {
			color: #fe8e2e;
		}
		.icon-weixinzhifu {
			color: #36cb59;
		}
		.icon-alipay {
			color: #01aaef;
		}
		.tit{
			font-size: $font-lg;
			color: $font-color-dark;
			margin-bottom: 4rpx;
		}
		.con{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-sm;
			color: $font-color-light;
		}
	}
	.mix-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 630rpx;
		height: 80rpx;
		margin: 80rpx auto 30rpx;
		font-size: $font-lg;
		color: #fff;
		background-color: $base-color;
		border-radius: 10rpx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
	}

</style>
