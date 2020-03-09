<template>
	<view class="content">
		<scroll-view scroll-y class="left-aside">
			<view v-for="(item, itemIndex) in firstList" :key="item.cat_id" class="f-item b-b" :class="{active: itemIndex === currentIndex}" @click="tabtap(item)">
				{{item.cat_name}}
			</view>
		</scroll-view>
		<scroll-view scroll-with-animation scroll-y class="right-aside" @scroll="asideScroll" :scroll-top="tabScrollTop">
			<view v-for="item in secondList" :key="item.cat_id" class="s-list" :id="'main-'+item.cat_id">
				<template v-if="item.children.length > 0">
					<text class="s-item">{{item.cat_name}}</text>
					<view class="t-list">
						<view @click="navToList(item.cat_id, titem.cat_id)" v-if="titem.parent_id === item.cat_id" class="t-item" v-for="titem in item.children" :key="titem.cat_id">
							<image :src="'/static/temp/cate2.jpg'"></image>
							<text>{{titem.cat_name}}</text>
						</view>
					</view>
				</template>
				<template v-else>
					<view class="t-list">
						<view @click="navToList(firstList[currentIndex].cat_id, item.cat_id)" v-if="item.parent_id === firstList[currentIndex].cat_id" class="t-item" :key="item.cat_id">
							<image :src="'/static/temp/cate2.jpg'"></image>
							<text>{{item.cat_name}}</text>
						</view>
					</view>
				</template>
				
				
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
				that.$http.post(that.$api.goods.category).then(res => {
					console.log(res);
					if (res.return_code === '0000') {
						that._formatCategoryData(res.data);
					} else {
						console.log(res.return_msg);
					}
				}).catch(error => {
					console.log(error);
				});
			},
			//一级分类点击
			tabtap(item){
				if(!this.sizeCalcState){
					this.calcSize();
				}
				
				this.currentId = item.id;
				let index = this.slist.findIndex(sitem=>sitem.pid === item.id);
				this.tabScrollTop = this.slist[index].top;
			},
			//右侧栏滚动
			asideScroll(e){
				if(!this.sizeCalcState){
					this.calcSize();
				}
				let scrollTop = e.detail.scrollTop;
				let tabs = this.slist.filter(item=>item.top <= scrollTop).reverse();
				if(tabs.length > 0){
					this.currentId = tabs[0].pid;
				}
			},
			//计算右侧栏每个tab的高度等信息
			calcSize(){
				let h = 0;
				this.slist.forEach(item=>{
					let view = uni.createSelectorQuery().select("#main-" + item.id);
					view.fields({
						size: true
					}, data => {
						item.top = h;
						h += data.height;
						item.bottom = h;
					}).exec();
				})
				this.sizeCalcState = true;
			},
			navToList(sid, tid){
				uni.navigateTo({
					url: `/pages/product/list?fid=${this.currentId}&sid=${sid}&tid=${tid}`
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
