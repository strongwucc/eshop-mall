<template>
	<view class="content">
		<view class="navbar">
			<view class="nav-item" :class="{current: filterIndex === 0}" @click="tabClick(0)">
				综合排序
			</view>
			<view class="nav-item" :class="{current: filterIndex === 1}" @click="tabClick(1)">
				销量优先
			</view>
			<view class="nav-item" :class="{current: filterIndex === 2}" @click="tabClick(2)">
				<text>价格</text>
				<view class="p-box">
					<text :class="{active: priceOrder === 2 && filterIndex === 2}" class="yticon icon-shang"></text>
					<text :class="{active: priceOrder === 1 && filterIndex === 2}" class="yticon icon-shang xia"></text>
				</view>
			</view>
			<text class="cate-item yticon icon-fenlei1" v-if="showCategory" @click="toggleCateMask('show')"></text>
		</view>
		<scroll-view class="goods-scroll" scroll-y refresher-enabled scroll-anchoring :scroll-top="scrollTop" :refresher-triggered="refresherTriggered" @scrolltolower="reachBottom" @refresherrefresh="pullDownRefresh" @scroll="scroll">
			<view class="goods-list">
				<view 
					v-for="(item, index) in goodsList" :key="index"
					class="goods-item"
					@click="navToDetailPage(item)"
				>
					<view class="image-wrapper">
						<image :src="item.image_default_url" mode="aspectFill"></image>
					</view>
					<text class="title">{{item.name}}</text>
					<view class="price-box">
						<text class="price">{{item.price | formatMoney}}</text>
						<text>已售 {{item.buy_w_count}}</text>
					</view>
				</view>
			</view>
			<uni-load-more :status="loadingType"></uni-load-more>
		</scroll-view>
		
		<view class="cate-mask" :class="cateMaskState===0 ? 'none' : cateMaskState===1 ? 'show' : ''" @click="toggleCateMask">
			<view class="cate-content" @click.stop.prevent="stopPrevent" @touchmove.stop.prevent="stopPrevent">
				<scroll-view scroll-y class="cate-list">
					<view v-for="item in cateList" :key="item.cat_id">
						<view class="cate-item b-b two">{{item.cat_name}}</view>
						<view 
							v-for="tItem in item.children" :key="tItem.cat_id" 
							class="cate-item b-b" 
							:class="{active: tItem.cat_id === cateId}"
							@click="changeCate(tItem)">
							{{tItem.cat_name}}
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore	
		},
		data() {
			return {
				cateMaskState: 0, //分类面板展开状态
				// headerPosition:"fixed",
				// headerTop:"0px",
				loadingType: 'more', //加载更多状态
				filterIndex: 0,
				scrollTop: 0,
				oldScrollTop: 0,
				cateId: 0, //已选三级分类id
				searchContent: '',
				priceOrder: 0, //1 价格从低到高 2价格从高到低
				cateList: [],
				goodsList: [],
				page: 1,
				refresherTriggered: false,
				showCategory: false
			};
		},
		
		onLoad(options){
			// #ifdef H5
			this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight+'px';
			// #endif
			this.cateId = options.tid || 0;
			this.searchContent = options.s || '';
			
			if (options.fid && options.sid) {
				this.showCategory = true;
				this.loadCateList(options.fid,options.sid);
			}
			this.loadData();
		},
		// onPageScroll(e){
		// 	//兼容iOS端下拉时顶部漂移
		// 	if(e.scrollTop>=0){
		// 		this.headerPosition = "fixed";
		// 	}else{
		// 		this.headerPosition = "absolute";
		// 	}
		// },
		methods: {

			/**
			 * 统计单个字符出现的次数
			 */
			_strCount (searchStr='', fromStr='') {
				let count = 0;
				if (searchStr === '') {
					return count;
				}
				for (let str of fromStr) {
					if (str === searchStr) {
						count++;
					}
				}
				return count;
			},

			/**
			 * 格式化分类数据
			 */
			_formatCategory(data) {
			  let that = this;
			  let firstList = [];
			  let secondList = [];
			  let thirdList = [];

			  data.forEach(element => {
			    if (that._strCount(',', element.cat_path) === 1) {
			      firstList.push(element);
			    } else if (that._strCount(',', element.cat_path) === 2) {
			      secondList.push(element);
			    } else if (that._strCount(',', element.cat_path) === 3) {
			      thirdList.push(element);
			    }
			  });

			  if (that.cateId) {
			    secondList.forEach((secondItem, secondIndex) => {
			      secondList[secondIndex]['children'] = [];
			      thirdList.forEach((thirdItem, thirdIndex) => {
			        if (secondItem.cat_id === thirdItem.parent_id) {
			          secondList[secondIndex]['children'].push(thirdItem);
			        }
			      })
			    })

			    that.cateList = secondList;
			  } else {
			    firstList.forEach((firstItem, firstIndex) => {
			      firstList[firstIndex]['children'] = [];
			      secondList.forEach((secondItem, secondIndex) => {
			        if (firstItem.cat_id === secondItem.parent_id) {
			          firstList[firstIndex]['children'].push(secondItem);
			        }
			      })
			    })

			    that.cateList = firstList;
			  }

			},

			//加载分类
			loadCateList(fid, sid){
				
				let that = this;
				fid = fid || 0;
				sid = sid || 0;

				that.$http.post(that.$api.goods.category).then(res => {
					if (res.return_code === '0000') {
						let usedData = [];
						res.data.forEach(dataItem => {
							if (dataItem.cat_path.indexOf(',' + fid + ',') >= 0) {
								usedData.push(dataItem);
							}
						});
						that._formatCategory(usedData);
					} else {
						console.log(res.return_msg);
					}
				}).catch(error => {
					console.log(error);
				});
			},
			
			/**
			 * 上拉加载，下拉刷新
			 */
			loadData(type='add', loading) {
				let that = this;

				//没有更多直接返回
				if(type === 'add'){
					if(that.loadingType === 'nomore'){
						return;
					}
					that.loadingType = 'loading';
				}else{
					if (~~loading !== 1) {
						that.refresherTriggered = true;
					}
					that.page = 1;
					that.loadingType = 'more'
				}
				
				let postData = {
					page: that.page
				};

				if (that.cateId) {
					postData.cat_id = that.cateId;
				}

				if (that.searchContent) {
					postData.scontent = `n,${that.searchContent}`;
				}

				// 排序处理
				if (that.filterIndex === 1) {
					postData.orderBy = 'buy_count desc';
				}
				if (that.filterIndex === 2) {
					if (that.priceOrder === 1) {
						postData.orderBy = 'price desc';
					} else if (that.priceOrder === 2) {
						postData.orderBy = 'price asc';
					}
				}

				that.$http.post(that.$api.goods.gallery, postData).then(res => {
					console.log(res);
					if(type === 'refresh'){
						that.goodsList = [];
					}

					that.goodsList = that.goodsList.concat(res.data.goodsData);
					that.loadingType  = res.data.page >= res.data.pagetotal ? 'nomore' : 'more';
					if (that.loadingType === 'more') {
						that.page = that.page + 1;
					}

					if(type === 'refresh'){
						that.refresherTriggered = false;
						if (~~loading === 1) {
							uni.hideLoading();
						}
					}

				}).catch(error => {
					console.log(error);
				});

			},
			scroll(e) {
				let that = this;
				that.oldScrollTop = e.detail.scrollTop;
			},
			//下拉刷新
			pullDownRefresh(){
				this.loadData('refresh');
			},
			//加载更多
			reachBottom(){
				this.loadData();
			},
			/**
			 * 筛选点击
			 */
			tabClick(index){

				let that = this;
				if(that.filterIndex === index && index !== 2){
					return false;
				}
				that.filterIndex = index;
				if(index === 2){
					that.priceOrder = that.priceOrder === 1 ? 2: 1;
				}else{
					that.priceOrder = 0;
				}
				// uni.pageScrollTo({
				// 	duration: 300,
				// 	scrollTop: 0
				// })
				that.scrollTop = that.oldScrollTop;
				that.$nextTick(function() {
						that.scrollTop = 0
				});
				that.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})

			},

			/**
			 * 显示分类面板
			 */
			toggleCateMask(type){
				let that = this;
				let timer = type === 'show' ? 10 : 300;
				let	state = type === 'show' ? 1 : 0;
				that.cateMaskState = 2;
				setTimeout(() => {
					that.cateMaskState = state;
				}, timer)
			},

			/**
			 * 分类点击
			 */
			changeCate(item){
				let that = this;
				that.cateId = item.cat_id;
				that.toggleCateMask();
				uni.pageScrollTo({
					duration: 300,
					scrollTop: 0
				})
				that.loadData('refresh', 1);
				uni.showLoading({
					title: '正在加载'
				})
			},

			/**
			 * 详情
			 */
			navToDetailPage(item){
				if (!item.products.product_id) {
					this.$toast('商品不存在或已下架');
					return false;
				}
				let id = item.products.product_id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			stopPrevent(){}
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
		height: 100%;
	}
	.content{
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}

	.navbar{
		flex: none;
		display: flex;
		width: 100%;
		height: 80rpx;
		background: #fff;
		box-shadow: 0 2rpx 10rpx rgba(0,0,0,.06);
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 30rpx;
			color: $font-color-dark;
			position: relative;
			&.current{
				color: $base-color;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 120rpx;
					height: 0;
					border-bottom: 4rpx solid $base-color;
				}
			}
		}
		.p-box{
			display: flex;
			flex-direction: column;
			.yticon{
				display: flex;
				align-items: center;
				justify-content: center;
				width: 30rpx;
				height: 14rpx;
				line-height: 1;
				margin-left: 4rpx;
				font-size: 26rpx;
				color: #888;
				&.active{
					color: $base-color;
				}
			}
			.xia{
				transform: scaleY(-1);
			}
		}
		.cate-item{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			width: 80rpx;
			position: relative;
			font-size: 44rpx;
			&:after{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				border-left: 1px solid #ddd;
				width: 0;
				height: 36rpx;
			}
		}
	}

	/* 分类 */
	.cate-mask{
		position: fixed;
		left: 0;
		top: var(--window-top);
		bottom: 0;
		width: 100%;
		background: rgba(0,0,0,0);
		z-index: 95;
		transition: .3s;
		
		.cate-content{
			width: 630rpx;
			height: 100%;
			background: #fff;
			float:right;
			transform: translateX(100%);
			transition: .3s;
		}
		&.none{
			display: none;
		}
		&.show{
			background: rgba(0,0,0,.4);
			
			.cate-content{
				transform: translateX(0);
			}
		}
	}
	.cate-list{
		display: flex;
		flex-direction: column;
		height: 100%;
		.cate-item{
			display: flex;
			align-items: center;
			height: 90rpx;
			padding-left: 30rpx;
 			font-size: 28rpx;
			color: #555;
			position: relative;
		}
		.two{
			height: 64rpx;
			color: #303133;
			font-size: 30rpx;
			background: #f8f8f8;
		}
		.active{
			color: $base-color;
		}
	}

	/* 商品列表 */
	.goods-scroll {
	  flex: auto;
		width: 100%;
		height: 100rpx;
	  .goods-list {
			padding-top: 20rpx;
	    display: flex;
	    justify-content: flex-start;
	    flex-wrap: wrap;
	    padding-left: 20rpx;
	    background: $page-color-base;

	    .goods-item {
	      background-color: #ffffff;
	      display: flex;
	      flex-direction: column;
	      padding: 30rpx;
	      box-sizing: border-box;
	      font-size: 28rpx;
	      border-radius: 24rpx;
	      margin-top: 20rpx;

	      &:nth-child(1),
	      &:nth-child(2) {
	        margin-top: 0;
	      }

	      &:nth-child(2n+1) {
	        margin-right: 20rpx;
	      }
	    }

	    .image-wrapper {
	      image {
	        // border-radius: 16rpx;
	        width: 284rpx;
	        height: 284rpx;
	        opacity: 1;
	      }
	    }

	    .title {
	      font-size: $font-lg;
	      color: $font-color-dark;
	      width: 284rpx;
	      height: 82rpx;
	      line-height: 41rpx;
	      overflow: hidden;
	      margin-top: 20rpx;
	      text-overflow: ellipsis;
	      display: -webkit-box;
	      -webkit-line-clamp: 2;
	      -webkit-box-orient: vertical;
	    }

	    .price-box {
	      display: flex;
	      margin-top: 30rpx;
	      align-items: center;
	      justify-content: space-between;
	      padding-right: 10rpx;
	      font-size: 24rpx;
	      color: $font-color-light;
	    }

	    .price {
	      font-size: $font-lg;
	      color: $uni-color-primary;
	      line-height: 1;

	      &:before {
	        content: '￥';
	        font-size: 26rpx;
	      }
	    }
	  }
	}
</style>
