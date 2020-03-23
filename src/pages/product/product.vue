<template>
	<view class="container">
		<view class="carousel">
			<swiper indicator-dots circular=true duration="400">
				<swiper-item class="swiper-item" v-for="(item,index) in imgList" :key="index">
					<view class="image-wrapper">
						<image
							:src="item.image_url" 
							class="loaded" 
							mode="aspectFill"
						></image>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<view class="introduce-section">
			<text class="title">{{name}}</text>
			<view class="price-box">
				<text class="price-tip">¥</text>
				<text class="price">{{price}}</text>
				<text class="m-price">¥{{mktprice}}</text>
				<text class="coupon-tip">{{discount}}折</text>
			</view>
			<view class="bot-row">
				<text>销量: {{sales}}</text>
				<text>库存: {{sales}}</text>
				<text>浏览量: {{views}}</text>
			</view>
		</view>
		
		<!--  分享 -->
		<view class="share-section" @click="share">
			<view class="share-icon">
				<text class="yticon icon-xingxing"></text>
				 返
			</view>
			<text class="tit">该商品分享可领49减10红包</text>
			<text class="yticon icon-bangzhu1"></text>
			<view class="share-btn">
				立即分享
				<text class="yticon icon-you"></text>
			</view>
			
		</view>
		
		<view class="c-list">
			<view class="c-row b-b" @click="toggleSpec">
				<text class="tit">购买类型</text>
				<view class="con">
					<text class="selected-text" v-for="(sItem, sIndex) in selectedSpecs" :key="sIndex">
						{{sItem.spec_value}}
					</text>
				</view>
				<text class="yticon icon-you"></text>
			</view>
			<view class="c-row b-b">
				<text class="tit">优惠券</text>
				<text class="con t-r red">领取优惠券</text>
				<text class="yticon icon-you"></text>
			</view>
			<view class="c-row b-b" v-if="promotion.order.length > 0 || promotion.goods.length > 0">
				<text class="tit">促销活动</text>
				<view class="con-list">
					<text v-for="promotionItem in promotion.order" :key="promotionItem.id">{{promotionItem.name}}</text>
				</view>
			</view>
			<view class="c-row b-b">
				<text class="tit">服务</text>
				<view class="bz-list con">
					<text>7天无理由退换货 ·</text>
					<text>假一赔十 ·</text>
				</view>
			</view>
		</view>
		
		<!-- 评价 -->
		<view class="eva-section">
			<view class="e-header">
				<text class="tit">评价</text>
				<text>(86)</text>
				<text class="tip">好评率 100%</text>
				<text class="yticon icon-you"></text>
			</view> 
			<view class="eva-box">
				<image class="portrait" src="http://img3.imgtn.bdimg.com/it/u=1150341365,1327279810&fm=26&gp=0.jpg" mode="aspectFill"></image>
				<view class="right">
					<text class="name">Leo yo</text>
					<text class="con">商品收到了，79元两件，质量不错，试了一下有点瘦，但是加个外罩很漂亮，我很喜欢</text>
					<view class="bot">
						<text class="attr">购买类型：XL 红色</text>
						<text class="time">2019-04-01 19:21</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="detail-desc">
			<view class="d-header">
				<text>图文详情</text>
			</view>
			<rich-text :nodes="desc"></rich-text>
		</view>
		
		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<navigator url="/pages/cart/cart" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-gouwuche"></text>
				<text>购物车</text>
			</navigator>
			<view class="p-b-btn" :class="{active: favorite}" @click="toFavorite">
				<text class="yticon icon-shoucang"></text>
				<text>收藏</text>
			</view>
			
			<view class="action-btn-group">
				<button type="primary" class=" action-btn no-border buy-now-btn" @click="addCart('is_fastbuy')">立即购买</button>
				<button type="primary" class=" action-btn no-border add-cart-btn" @click="addCart">加入购物车</button>
			</view>
		</view>
		
		
		<!-- 规格-模态层弹窗 -->
		<view 
			class="popup spec" 
			:class="specClass"
			@touchmove.stop.prevent="stopPrevent"
			@click="toggleSpec"
		>
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer attr-content" @click.stop="stopPrevent">
				<view class="a-t">
					<image :src="image" mode="aspectFill"></image>
					<view class="right">
						<text class="price">¥{{price}}</text>
						<text class="stock">库存：{{store}}件</text>
						<view class="selected">
							已选：
							<text class="selected-text" v-for="(sItem, sIndex) in selectedSpecs" :key="sItem.p_spec_value_id">
								{{sItem.spec_value}}
							</text>
						</view>
					</view>
				</view>
				<view v-for="(item,index) in specList" :key="item.id" class="attr-list">
					<text>{{item.name}}</text>
					<view class="item-list">
						<text 
							v-for="(childItem, childIndex) in item.values" 
							v-if="item.values.length > 0"
							:key="childItem.spec_value_id" class="tit"
							:class="{selected: childItem.selected}"
							@click="selectSpec(childItem)"
						>
							{{childItem.spec_value}}
						</text>
					</view>
				</view>
				<button class="btn" @click="toggleSpec">完成</button>
			</view>
		</view>
		<!-- 海报-模态层弹窗 -->
		<view 
			class="popup poster" 
			:class="posterClass"
			@touchmove.stop.prevent="stopPrevent"
			@click="togglePoster"
		>
			<!-- 遮罩层 -->
			<view class="mask"></view>
			<view class="layer poster-content" @click.stop="stopPrevent">
				<view class="title">保存到相册</view>
				<view class="image"><image :src="poster.path || ''" mode="aspectFit"></image></view>
				<view >
					<button class="btn" @click="togglePoster">保存图片</button>
				</view>
			</view>
		</view>
		<!-- 分享 -->
		<share 
			ref="share" 
			:contentHeight="400"
			:shareList="shareList"
			@shareClick="doShare"
		></share>
	</view>
</template>

<script>
	import share from '@/components/share';
	import htmlParser from '@/common/html-parser'
	export default{
		components: {
			share
		},
		data() {
			return {
				productId: null, 		// 货品ID
				goodsId: null,			// 商品ID
				specClass: 'none',
				selectedSpecs: [], 	// 已选中规格
				posterClass: 'none',
				poster: {
					path: 'http://tmp/wxa254ff7d0ca3df29.o6zAJs4JKH3lGYFcg3d5AIssddos.B2HaLLgEACJ8f6db092fe02dc3956ca32ee21c5c6ecc.jpg'
				},
				favorite: false,
				shareList: [{
				  type: 1,
				  icon: '/static/temp/share_wechat.png',
				  text: '分享给好友'
				},
				{
				  type: 2,
				  icon: '/static/temp/share_moment.png',
				  text: '生成分享海报'
				}],
				imgList: [], 				// 商品图片
				name: '', 					// 商品名称
				image: '', 					// 商品默认图片
				price: 0.00, 				// 价格
				mktprice: 0.00, 		// 市场价
				sales: 0, 					// 销量
				store: 99, 					// 库存
				views: 0, 					// 浏览量
				promotion: { 				// 促销信息
					'order': [],
					'goods': []
				},
				desc: null, 				// 商品详情
				specList: [], 			// 规格列表
				specDefaultPic: '',	// 规格默认图片
				requesting: false, 	// 是否正在请求
			};
		},
		computed: {
			discount () {
				let that = this;
				return Math.round(that.price / that.mktprice * 100) / 10;
			}
		},
		onLoad(options){
			
			let that = this;
			let productId = options.id;
			that.productId = productId;
			
			that.loadData(productId)
	

		},
		methods:{

			/**
			 * 格式化活动数据
			 */
			_formatPromotion (promotion) {
				let that = this;
				let newPromotion = {
					'order': [],
					'goods': []
				};
				for (let proKey in promotion) {
					let proItem = promotion[proKey];
					for (let itemKey in proItem) {
						proItem[itemKey].id = itemKey;
						newPromotion[proKey].push(proItem[itemKey]);
					}
				}
				that.promotion = newPromotion;
			},

			/**
			 * 格式化规格
			 */
			_formatSpec (spec) {

				let that = this;
				// 规格类型
				let specList = [];
				if (spec.hasOwnProperty('specification') && spec.specification.hasOwnProperty('spec_name')) {
					for (let specKey in spec.specification.spec_name) {
						specList.push({id: specKey, name: spec.specification.spec_name[specKey], values: []});
					}
				}
				// 选中的规格
				let selectedSpec = [];
				if (spec.hasOwnProperty('product')) {
					for (let specId in spec.product) {
						selectedSpec.push({spec_id: specId, p_spec_value_id: spec.product[specId]});
					}
				}

				// 商品所有规格
				let specs = [];
				if (spec.hasOwnProperty('goods')) {
					for (let specId in spec.goods) {
						for (let specValue in spec.goods[specId]) {

							if (selectedSpec.some((selectedSpecItem, selectedSpecIndex) => {
								if(selectedSpecItem.p_spec_value_id === specValue) {
									selectedSpec[selectedSpecIndex].spec_value = spec.goods[specId][specValue].spec_value;
									selectedSpec[selectedSpecIndex].spec_value_id = spec.goods[specId][specValue].spec_value_id;
									return true;
								}
								return false;
							})) {
								spec.goods[specId][specValue].selected = true;
							} else {
								spec.goods[specId][specValue].selected = false;
							}

							specList.some((specItem, specIndex) => {
								if(specItem.id === specId) {
									specList[specIndex].values.push({spec_id: specId, ...spec.goods[specId][specValue]});
									return true;
								}
								return false;
							})
						}
					}
				}
				that.selectedSpecs = selectedSpec;
				that.specList = specList;
			},
			/**
			 * 获取商品信息
			 */
			loadData (productId) {

				let that = this;

				that.$http.post(that.$api.goods.detail, {product_id: productId}).then(res => {
					console.log(res);
					if (res.return_code === '0000') {
						// 默认图片
						if (res.data.spec_default_pic) {
							that.specDefaultPic = res.data.spec_default_pic;
						}
						// 基本信息
						if (res.data.page_product_basic) {
							that.imgList = res.data.page_product_basic.images;
							that.name = res.data.page_product_basic.title;
							that.image = res.data.page_product_basic.image_default_url;
							that.favorite = res.data.page_product_basic.isFav;
							that.goodsId = res.data.page_product_basic.goods_id;
							that._formatPromotion(res.data.page_product_basic.promotion);
							that._formatSpec(res.data.page_product_basic.spec);
							that.getGoodsIntro(res.data.page_product_basic.goods_id);
							
						}
						// 价格
						if (res.data.product_price) {
							that.price = res.data.product_price.price;
							that.mktprice = res.data.product_price.mktprice;
						}
						// 库存
						if (res.data.product_store) {
							that.store = res.data.product_store.store;
						}
					} else {
						console.log(res.return_msg);
					}
				}).catch(error => {
					console.log(error);
				});

			},

			/**
			 * 商品详情
			 */
			getGoodsIntro (goodsId) {
				let that = this;
				that.$http.post(that.$api.goods.intro, {goods_id: goodsId}).then(res => {
					if (res.return_code === '0000') {
						let html = res.data.html;
						// let newHtml = html.replace(/(<img)(.*?)(>)/g, function (...args) {
						// 	return args[1] + args[2] + " style=\"width: 100%\"" + args[3];
						// });
						// let nodes = htmlParser(newHtml);
						let nodes = htmlParser(html);
						that.desc = nodes ? nodes : [];
					} else {
						console.log(res.return_msg);
					}
				}).catch(error => {
					console.log(error);
				});
			},
			/**
			 * 规格弹窗开关
			 */
			toggleSpec() {
				if(this.specClass === 'show'){
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				}else if(this.specClass === 'none'){
					this.specClass = 'show';
				}
			},
			/**
			 * 海报弹窗开关
			 */
			togglePoster() {
				if(this.posterClass === 'show'){
					this.posterClass = 'hide';
					setTimeout(() => {
						this.posterClass = 'none';
					}, 250);
				}else if(this.posterClass === 'none'){
					this.posterClass = 'show';
				}
			},
			/**
			 * 选择规格
			 */
			selectSpec(spec){
				let that = this;
				if (spec.hasOwnProperty('product_id')) {
					that.loadData(spec.product_id);
				}
			},
			/**
			 * 分享
			 */
			share(){
				this.$refs.share.toggleMask();	
			},
			doShare (e) {
				let that = this;
				if (e.type === 2) {
					console.log('生成海报');
					that.togglePoster();
				}
			},
			/**
			 * 收藏
			 */
			toFavorite(){
				let that = this;
				if (that.requesting) {
					return false;
				}

				if (!that.goodsId) {
					return false
				}

				that.requesting = true;

				let postUrl = that.favorite ? that.$api.user.removeFav : that.$api.user.addFav;

				that.$http.post(
					postUrl,
					{gid: that.goodsId, type: 'goods'}
				).then(res => {
					that.requesting = false;
					if (res.return_code === '0000') {
						if (that.favorite) {
							that.$toast('移除成功');
						} else {
							that.$toast('收藏成功');
						}
						that.favorite = !that.favorite;
					} else {
						console.log(res.error);
						that.$toast('收藏失败');
					}
				}).catch(error => {
					that.requesting = false;
					console.log(error);
					that.$toast('收藏失败');
				});
			},
			/**
			 * 立即购买
			 */
			buy(){
				uni.navigateTo({
					url: `/pages/order/createOrder`
				})
			},
			/**
			 * 加入购物车
			 */
			addCart (btype="") {
				let that = this;
				if (that.requesting) {
					return false;
				}

				if (!that.productId || !that.goodsId) {
					return false
				}

				that.requesting = true;

				let data = {goods_id: that.goodsId, product_id: that.productId, num: 1, mini_cart: true};

				if (btype === 'is_fastbuy') {
					data.btype = 'is_fastbuy';
				}

				that.$http.post(
					that.$api.cart.add,
					data
				).then(res => {
					that.requesting = false;
					if (res.return_code === '0000') {
						that.$toast('添加成功');
						if (btype === 'is_fastbuy') {
							setTimeout(function () {
								uni.navigateTo({
									url: `/pages/order/createOrder?fastbuy=1`
								})
							}, 1000);
						}
					} else {
						console.log(res.error);
						that.$toast('添加失败');
					}
				}).catch(error => {
					that.requesting = false;
					console.log(error);
					that.$toast('添加失败');
				});

			},
			stopPrevent(){}
		},

	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
		padding-bottom: 160rpx;
	}
	.icon-you{
		font-size: $font-base + 2rpx;
		color: #888;
	}
	.carousel {
		height: 722rpx;
		position:relative;
		swiper{
			height: 100%;
		}
		.image-wrapper{
			width: 100%;
			height: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750rpx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
		
	}
	
	/* 标题简介 */
	.introduce-section{
		background: #fff;
		padding: 20rpx 30rpx;
		
		.title{
			font-size: 32rpx;
			color: $font-color-dark;
			height: 50rpx;
			line-height: 50rpx;
		}
		.price-box{
			display:flex;
			align-items:baseline;
			height: 64rpx;
			padding: 10rpx 0;
			font-size: 26rpx;
			color:$uni-color-primary;
		}
		.price{
			font-size: $font-lg + 2rpx;
		}
		.m-price{
			margin:0 12rpx;
			color: $font-color-light;
			text-decoration: line-through;
		}
		.coupon-tip{
			align-items: center;
			padding: 4rpx 10rpx;
			background: $uni-color-primary;
			font-size: $font-sm;
			color: #fff;
			border-radius: 6rpx;
			line-height: 1;
			transform: translateY(-4rpx); 
		}
		.bot-row{
			display:flex;
			align-items:center;
			height: 50rpx;
			font-size: $font-sm;
			color: $font-color-light;
			text{
				flex: 1;
			}
		}
	}
	/* 分享 */
	.share-section{
		display:flex;
		align-items:center;
		color: $font-color-base;
		background: linear-gradient(to left, #fdf5f6, #fbebf6);
		padding: 12rpx 30rpx;
		.share-icon{
			display:flex;
			align-items:center;
			width: 70rpx;
			height: 30rpx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4rpx;
			position:relative;
			overflow: hidden;
			font-size: 22rpx;
			color: $uni-color-primary;
			&:after{
				content: '';
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
				left: -20rpx;
				top: -12rpx;
				position:absolute;
				background: $uni-color-primary;
			}
		}
		.icon-xingxing{
			position:relative;
			z-index: 1;
			font-size: 24rpx;
			margin-left: 2rpx;
			margin-right: 10rpx;
			color: #fff;
			line-height: 1;
		}
		.tit{
			font-size: $font-base;
			margin-left:10rpx;
		}
		.icon-bangzhu1{
			padding: 10rpx;
			font-size: 30rpx;
			line-height: 1;
		}
		.share-btn{
			flex: 1;
			text-align:right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}
		.icon-you{
			font-size: $font-sm;
			margin-left: 4rpx;
			color: $uni-color-primary;
		}
	}
	
	.c-list{
		font-size: $font-sm + 2rpx;
		color: $font-color-base;
		background: #fff;
		.c-row{
			display:flex;
			align-items:center;
			padding: 20rpx 30rpx;
			position:relative;
		}
		.tit{
			width: 140rpx;
		}
		.con{
			flex: 1;
			color: $font-color-dark;
			.selected-text{
				margin-right: 10rpx;
			}
		}
		.bz-list{
			height: 40rpx;
			font-size: $font-sm+2rpx;
			color: $font-color-dark;
			text{
				display: inline-block;
				margin-right: 30rpx;
			}
		}
		.con-list{
			flex: 1;
			display:flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40rpx;
		}
		.red{
			color: $uni-color-primary;
		}
	}
	
	/* 评价 */
	.eva-section{
		display: flex;
		flex-direction: column;
		padding: 20rpx 30rpx;
		background: #fff;
		margin-top: 16rpx;
		.e-header{
			display: flex;
			align-items: center;
			height: 70rpx;
			font-size: $font-sm + 2rpx;
			color: $font-color-light;
			.tit{
				font-size: $font-base + 2rpx;
				color: $font-color-dark;
				margin-right: 4rpx;
			}
			.tip{
				flex: 1;
				text-align: right;
			}
			.icon-you{
				margin-left: 10rpx;
			}
		}
	}
	.eva-box{
		display: flex;
		padding: 20rpx 0;
		.portrait{
			flex-shrink: 0;
			width: 80rpx;
			height: 80rpx;
			border-radius: 100px;
		}
		.right{
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: $font-base;
			color: $font-color-base;
			padding-left: 26rpx;
			.con{
				font-size: $font-base;
				color: $font-color-dark;
				padding: 20rpx 0;
			}
			.bot{
				display: flex;
				justify-content: space-between;
				font-size: $font-sm;
				color:$font-color-light;
			}
		}
	}
	/*  详情 */
	.detail-desc{
		background: #fff;
		margin-top: 16rpx;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80rpx;
			font-size: $font-base + 2rpx;
			color: $font-color-dark;
			position: relative;
				
			text{
				padding: 0 20rpx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300rpx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc; 
			}
		}
	}
	
	/* 规格选择弹窗 */
	.attr-content{
		padding: 10rpx 30rpx;
		.a-t{
			display: flex;
			image{
				width: 170rpx;
				height: 170rpx;
				flex-shrink: 0;
				margin-top: -40rpx;
				border-radius: 8rpx;;
			}
			.right{
				display: flex;
				flex-direction: column;
				padding-left: 24rpx;
				font-size: $font-sm + 2rpx;
				color: $font-color-base;
				line-height: 42rpx;
				.price{
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10rpx;
				}
				.selected-text{
					margin-right: 10rpx;
				}
			}
		}
		.attr-list{
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2rpx;
			color: $font-color-base;
			padding-top: 30rpx;
			padding-left: 10rpx;
		}
		.item-list{
			padding: 20rpx 0 0;
			display: flex;
			flex-wrap: wrap;
			text{
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				border-radius: 100rpx;
				min-width: 60rpx;
				height: 60rpx;
				padding: 0 20rpx;
				font-size: $font-base;
				color: $font-color-dark;
			}
			.selected{
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
	}
	
	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		
		&.show {
			display: block;
			.mask{
				animation: showPopup 0.2s linear both;
			}
			.layer {
				animation: showLayer 0.2s linear both;
			}
		}
		&.hide {
			.mask{
				animation: hidePopup 0.2s linear both;
			}
			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}
		&.none {
			display: none;
		}
		.mask{
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}
		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10rpx 10rpx 0 0;
			background-color: #fff;
			.btn{
				height: 66rpx;
				line-height: 66rpx;
				border-radius: 100rpx;
				background: $uni-color-primary;
				font-size: $font-base + 2rpx;
				color: #fff;
				margin: 30rpx auto 20rpx;
			}
		}
		@keyframes showPopup {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		@keyframes hidePopup {
			0% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}
			100% {
				transform: translateY(0%);
			}
		}
		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}
			100% {
				transform: translateY(120%);
			}
		}
		.poster-content {
		  display: flex;
		  flex-direction: column;
		  justify-content: flex-start;
			align-items: center;
			.title {
				height: 66rpx;
				line-height: 66rpx;
				text-align: left;
				background: $page-color-base;
			}
			.image {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 30rpx;
				image {
					height: 580rpx;
				}
			}
		  view {
				width: 100%;
				padding: 0 20rpx;
				box-sizing: border-box;
		    .btn {
		      width: 100%;
		    }
		  }

		}
	}
	
	/* 底部操作菜单 */
	.page-bottom{
		position:fixed;
		left: 30rpx;
		bottom:30rpx;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 690rpx;
		height: 100rpx;
		background: rgba(255,255,255,.9);
		box-shadow: 0 0 20rpx 0 rgba(0,0,0,.5);
		border-radius: 16rpx;
		
		.p-b-btn{
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: $font-color-base;
			width: 96rpx;
			height: 80rpx;
			.yticon{
				font-size: 40rpx;
				line-height: 48rpx;
				color: $font-color-light;
			}
			&.active, &.active .yticon{
				color: $uni-color-primary;
			}
			.icon-fenxiang2{
				font-size: 42rpx;
				transform: translateY(-2rpx);
			}
			.icon-shoucang{
				font-size: 46rpx;
			}
		}
		.action-btn-group{
			display: flex;
			height: 76rpx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20rpx 40rpx -16rpx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30,#fa436a,#F56C6C);
			margin-left: 20rpx;
			position:relative;
			&:after{
				content: '';
				position:absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28rpx;
				width: 0;
				border-right: 1px solid rgba(255,255,255,.5);
			}
			.action-btn{
				display:flex;
				align-items: center;
				justify-content: center;
				width: 180rpx;
				height: 100%;
				font-size: $font-base ;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
	
</style>
