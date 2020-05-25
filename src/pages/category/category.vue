<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view v-for="(firstItem, firstIndex) in firstList" :key="firstItem.cat_id" class="f-item b-b" :class="{active: firstIndex === currentIndex}" @click="tabtap(firstItem, firstIndex)">
				{{firstItem.cat_name}}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop">
			<view v-for="(secondItem, secondIndex) in secondList" :key="secondItem.cat_id" class="s-list" :id="'main-'+secondItem.cat_id">
					<text class="s-item">{{secondItem.cat_name}}</text>
					<view class="t-list">
						<template v-if="secondItem.children.length > 0">
							<view @click="navToList(thirdItem.parent_id, thirdItem.cat_id)" v-if="thirdItem.parent_id === secondItem.cat_id" class="t-item" v-for="thirdItem in secondItem.children" :key="thirdItem.cat_id">
								<image :src="thirdItem.logo"></image>
								<text>{{thirdItem.cat_name}}</text>
							</view>
						</template>
					</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				firstList: [],
				secondList: [],
				sizeCalcState: false,
				tabScrollTop: 0,
				currentIndex: 0,
				flist: [],
				slist: [],
				tlist: [],
			}
		},
		onLoad(){
			this.loadData();
		},
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
			_formatCategoryData (data=[]) {

				let that = this;

				let parentData = [];
				let childData = [];
				let grandsonData = [];

				data.forEach(dataItem => {
					if (dataItem.parent_id === '0') {
						parentData.push(dataItem);
					} else if (that._strCount(',', dataItem.cat_path) === 2) {
						childData.push(dataItem);
					} else if (that._strCount(',', dataItem.cat_path) === 3) {
						grandsonData.push(dataItem);
					}
				})

				childData.forEach((childItem, childIndex) => {
					childData[childIndex]['children'] = [];
					grandsonData.forEach((grandsonItem, grandsonIndex) => {
						if (childItem.cat_id === grandsonItem.parent_id) {
							childData[childIndex]['children'].push(grandsonItem);
						}
					})
				})

				that.firstList = parentData;
				that.secondList = childData;

			},

			/**
			 * 加载数据
			 */
			loadData(){
				let that = this;
				uni.showLoading();
				that.$http.post(that.$api.goods.category).then(res => {
					uni.hideLoading();
					console.log(res);
					if (res.return_code === '0000') {
						that._formatCategoryData(res.data);
					} else {
						console.log(res.return_msg);
					}
				}).catch(error => {
					uni.hideLoading();
					console.log(error);
				});
			},
			//一级分类点击
			tabtap(firstItem, firstIndex){
				let that = this;
				if(!that.sizeCalcState){
					that.calcSize();
				}
				
				that.currentIndex = firstIndex;
				let secondIndex = that.secondList.findIndex(secondItem => secondItem.parent_id === firstItem.cat_id);

				if (secondIndex === -1) {
					return false;
				}

				if (that.secondList[secondIndex].hasOwnProperty('top')) {
					that.tabScrollTop = that.secondList[secondIndex].top;
				}
			},
			//右侧栏滚动
			asideScroll(e){
				let that = this;
				let secondList = that.secondList;
				if(!that.sizeCalcState){
					that.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				let tabs = secondList.filter(item => item.top <= scrollTop).reverse();
				if(tabs.length > 0){
					let parent_id = tabs[0].parent_id;
					let currentIndex = that.currentIndex;
					that.firstList.some((firstItem, firstIndex) => {
						if (firstItem.cat_id === parent_id) {
							currentIndex = firstIndex;
							return true;
						}
						return false;
					});

					that.currentIndex = currentIndex;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize(){
				let that = this;
				let h = 0;
				let secondList = that.secondList;
				secondList.forEach((item, itemIndex)=>{
					let view = uni.createSelectorQuery().select("#main-" + item.cat_id);
					view.fields({
						size: true
					}, data => {
						secondList[itemIndex].top = h;
						h += data.height;
						secondList[itemIndex].bottom = h;
					}).exec();
				})
				that.secondList = secondList;
				that.sizeCalcState = true;
			},
			navToList(secondCatId,thirdCatId){
				let that = this;
				uni.navigateTo({
					url: `/pages/product/list?fid=${that.firstList[that.currentIndex].cat_id}&sid=${secondCatId}&tid=${thirdCatId}`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
		background-color: #f8f8f8;
	}

	.content {
		display: flex;
	}
	.left-aside {
		flex-shrink: 0;
		width: 200rpx;
		height: 100%;
		background-color: #fff;
	}
	.f-item {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100rpx;
		font-size: 28rpx;
		color: $font-color-base;
		position: relative;
		&.active{
			color: $base-color;
			background: #f8f8f8;
			&:before{
				content: '';
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				height: 36rpx;
				width: 8rpx;
				background-color: $base-color;
				border-radius: 0 4px 4px 0;
				opacity: .8;
			}
		}
	}

	.right-aside{
		flex: 1;
		overflow: hidden;
		padding-left: 20rpx;
	}
	.s-item{
		display: flex;
		align-items: center;
		height: 70rpx;
		padding-top: 8rpx;
		font-size: 28rpx;
		color: $font-color-dark;
	}
	.t-list{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12rpx;
		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
	}
	.t-item{
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 176rpx;
		font-size: 26rpx;
		color: #666;
		padding-bottom: 20rpx;
		
		image{
			width: 140rpx;
			height: 140rpx;
		}
	}
</style>
