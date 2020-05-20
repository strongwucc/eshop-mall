<template>
  <view class="container">
    <view class="carousel">
      <swiper indicator-dots circular="true" duration="400" v-show="!showVideo">
        <swiper-item
          class="swiper-item"
          v-for="(item, index) in imgList"
          :key="item.image_id"
        >
          <view class="image-wrapper">
            <image
              :src="item.image_url"
              class="loaded"
              mode="aspectFill"
            ></image>
          </view>
          <view class="video-btn" v-if="index === 0" @click="toggleVideo(true)">
            <image
              src="data:image/png;base64,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"
            ></image>
          </view>
        </swiper-item>
      </swiper>
      <view class="video" v-show="showVideo">
        <video
          id="productVideo"
          controls
          src="http://pgcvideo.cdn.xiaodutv.com/1774403298_998081411_2018110912081220181109123822.mp4?Cache-Control=max-age%3D8640000&responseExpires=Sun%2C+17+Feb+2019+12%3A47%3A07+GMT&xcode=0eb6173e4acd1d79328d14a21255e7ff5403bb24530bcf1c&time=1585291640&_=1585205519103"
        ></video>
        <view class="stop-btn" @click="toggleVideo(false)">退出播放</view>
      </view>
    </view>

    <view class="introduce-section">
      <text class="title">{{ name }}</text>
      <view class="price-box">
        <text class="price-tip">¥</text>
        <text class="price">{{ price }}</text>
        <text class="m-price">¥{{ mktprice }}</text>
        <text class="coupon-tip">{{ discount }}折</text>
      </view>
      <view class="bot-row">
        <text>销量: {{ sales }}</text>
        <text>库存: {{ store }}</text>
        <text>浏览量: {{ views }}</text>
      </view>
    </view>

    <!--  分享 -->
    <view class="share-section" @click="share">
      <!-- <view class="share-icon">
				<text class="yticon icon-xingxing"></text>
				 返
			</view> -->
      <!-- <text class="tit">该商品分享可领49减10红包</text>
			<text class="yticon icon-bangzhu1"></text> -->
      <view class="share-btn">
        立即分享
        <text class="yticon icon-you"></text>
      </view>
    </view>

    <view class="c-list">
      <view class="c-row b-b" @click="toggleSpec">
        <text class="tit">购买类型</text>
        <view class="con">
          <text
            class="selected-text"
            v-for="(sItem, sIndex) in selectedSpecs"
            :key="sIndex"
          >
            {{ sItem.spec_value }}
          </text>
        </view>
        <text class="yticon icon-you"></text>
      </view>
      <!-- <view class="c-row b-b">
				<text class="tit">优惠券</text>
				<text class="con t-r red">领取优惠券</text>
				<text class="yticon icon-you"></text>
			</view> -->
      <view
        class="c-row b-b"
        v-if="promotion.order.length > 0 || promotion.goods.length > 0"
      >
        <text class="tit">促销活动</text>
        <view class="con-list">
          <text
            v-for="promotionItem in promotion.order"
            :key="promotionItem.id"
            >{{ promotionItem.name }}</text
          >
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
    <view
      class="eva-section"
      v-if="discuss && discuss.discussCount > 0"
      @click="goodsComments"
    >
      <view class="e-header">
        <text class="tit">评价</text>
        <text>({{ discuss.discussCount }})</text>
        <text class="tip">商品评分 {{ discuss.goods_point.avg_num }}分</text>
        <text class="yticon icon-you"></text>
      </view>
      <view
        class="eva-box"
        v-if="discuss.list && discuss.list.discuss.length > 0"
      >
        <image
          class="portrait"
          src="/static/avatar_default@2x.png"
          mode="aspectFill"
        ></image>
        <view class="right">
          <text class="name">{{ discuss.list.discuss[0].author || "" }}</text>
          <text class="con">{{ discuss.list.discuss[0].comment || "" }}</text>
          <view class="bot">
            <!-- <text class="attr">购买类型：XL 红色</text> -->
            <text class="time">{{
              discuss.list.discuss[0].time | formatTime
            }}</text>
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
        <text class="dot">{{
          ~~cartInfo.itemsQuantity > 99 ? "99+" : ~~cartInfo.itemsQuantity
        }}</text>
      </navigator>
      <view class="p-b-btn" :class="{ active: favorite }" @click="toFavorite">
        <text class="yticon icon-shoucang"></text>
        <text>收藏</text>
      </view>

      <view class="disabled" v-if="!marketable">
        商品已下架
      </view>
      <view class="disabled" v-else-if="store <= 0">
        商品缺货中
      </view>
      <view class="action-btn-group" v-else>
        <button
          type="primary"
          class=" action-btn no-border buy-now-btn"
          @click="toggleSpec(true)"
        >
          立即购买
        </button>
        <button
          type="primary"
          class=" action-btn no-border add-cart-btn"
          @click="toggleSpec(false)"
        >
          加入购物车
        </button>
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
            <text class="price">¥{{ price }}</text>
            <text class="stock">库存：{{ store }}件</text>
            <view class="selected">
              已选：
              <text
                class="selected-text"
                v-for="(sItem, sIndex) in selectedSpecs"
                :key="sItem.p_spec_value_id"
              >
                {{ sItem.spec_value }}
              </text>
            </view>
          </view>
        </view>
        <view
          v-for="(item, index) in specList"
          :key="item.id"
          class="attr-list"
        >
          <text>{{ item.name }}</text>
          <view class="item-list">
            <text
              v-for="(childItem, childIndex) in item.values"
              v-if="item.values.length > 0"
              :key="childItem.spec_value_id"
              class="tit"
              :class="{ selected: childItem.selected }"
              @click="selectSpec(childItem)"
            >
              {{ childItem.spec_value }}
            </text>
          </view>
        </view>
        <button class="btn" @click.stop="addCart">确定</button>
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
        <view class="image"
          ><image :src="poster.path || ''" mode="aspectFit"></image
        ></view>
        <view>
          <button class="btn" @click="savePoster">保存图片</button>
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
    <canvas
      :class="{ hideCanvas: hideCanvas }"
      canvas-id="default_PosterCanvasId"
      :style="{
        width: (poster.width || 0) + 'px',
        height: (poster.height || 0) + 'px',
      }"
    ></canvas>
  </view>
</template>

<script>
import share from "@/components/share";
import htmlParser from "@/common/html-parser";
import { getSharePoster } from "@/common/poster/poster";
import { mapState, mapMutations } from "vuex";
import { base64src } from "@/common/util";
export default {
  components: {
    share,
  },
  data() {
    return {
      productId: null, // 货品ID
      goodsId: null, // 商品ID
      showVideo: false,
      videoContext: null,
      specClass: "none",
      selectedSpecs: [], // 已选中规格
      posterClass: "none",
      hideCanvas: false,
      canvasId: "default_PosterCanvasId",
      poster: {
        path: "",
      },
      favorite: false,
      shareList: [
        {
          type: 1,
          icon: "/static/temp/share_wechat.png",
          text: "分享给好友",
        },
        {
          type: 2,
          icon: "/static/temp/share_moment.png",
          text: "生成分享海报",
        },
      ],
      imgList: [], // 商品图片
      name: "", // 商品名称
      image: "", // 商品默认图片
      imageBase64: "", // 商品默认图片
      price: 0.0, // 价格
      mktprice: 0.0, // 市场价
      sales: 0, // 销量
      store: 99, // 库存
      views: 0, // 浏览量
      promotion: {
        // 促销信息
        order: [],
        goods: [],
      },
      desc: null, // 商品详情
      specList: [], // 规格列表
      specDefaultPic: "", // 规格默认图片
      requesting: false, // 是否正在请求
      isFastbuy: false,
      marketable: true,
      discuss: {
        list: {
          discuss: [],
        },
      },
      shareQrcode: "",
      qrcodeRequesting: false,
    };
  },
  computed: {
    ...mapState(["hasLogin", "cartInfo", "userInfo"]),
    discount() {
      let that = this;
      return Math.round((that.price / that.mktprice) * 100) / 10 || 0;
    },
  },
  onLoad(options) {
    let that = this;
    let productId = options.id;
    that.productId = productId;

    if (options.spread) {
      that.setSpread(options.spread);
    }

    that.loadData(productId);

    that.getProductQrcode();
  },
  onReady(res) {
    let that = this;
    that.videoContext = uni.createVideoContext("productVideo");
  },
  onShareAppMessage(res) {
    let that = this;
    return {
      title: that.name,
      path: "/pages/product/product?id=" + that.productId,
      success: function() {
        console.log("成功");
      },
      fail: function() {
        console.log("失败");
      },
    };
  },
  methods: {
    ...mapMutations(["setCart"]),
    /**
     * 格式化活动数据
     */
    _formatPromotion(promotion) {
      let that = this;
      let newPromotion = {
        order: [],
        goods: [],
      };
      for (let proKey in promotion) {
        if (!newPromotion.hasOwnProperty(proKey)) {
          continue;
        }
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
    _formatSpec(spec) {
      let that = this;
      // 规格类型
      let specList = [];
      if (
        spec.hasOwnProperty("specification") &&
        spec.specification.hasOwnProperty("spec_name")
      ) {
        for (let specKey in spec.specification.spec_name) {
          specList.push({
            id: specKey,
            name: spec.specification.spec_name[specKey],
            values: [],
          });
        }
      }
      // 选中的规格
      let selectedSpec = [];
      if (spec.hasOwnProperty("product")) {
        for (let specId in spec.product) {
          selectedSpec.push({
            spec_id: specId,
            p_spec_value_id: spec.product[specId],
          });
        }
      }

      // 商品所有规格
      let specs = [];
      if (spec.hasOwnProperty("goods")) {
        for (let specId in spec.goods) {
          for (let specValue in spec.goods[specId]) {
            if (
              selectedSpec.some((selectedSpecItem, selectedSpecIndex) => {
                if (selectedSpecItem.p_spec_value_id === specValue) {
                  selectedSpec[selectedSpecIndex].spec_value =
                    spec.goods[specId][specValue].spec_value;
                  selectedSpec[selectedSpecIndex].spec_value_id =
                    spec.goods[specId][specValue].spec_value_id;
                  return true;
                }
                return false;
              })
            ) {
              spec.goods[specId][specValue].selected = true;
            } else {
              spec.goods[specId][specValue].selected = false;
            }

            specList.some((specItem, specIndex) => {
              if (specItem.id === specId) {
                specList[specIndex].values.push({
                  spec_id: specId,
                  ...spec.goods[specId][specValue],
                });
                return true;
              }
              return false;
            });
          }
        }
      }
      that.selectedSpecs = selectedSpec;
      that.specList = specList;
    },
    /**
     * 获取当前连接
     */
    _getShareBaseUrl() {
      let { protocol, host, pathname } = window.location;
      return protocol + "//" + host + pathname;
    },
    /**
     * 设置分销人ID
     */
    setSpread(uid) {
      uni.setStorage({
        key: "spread",
        data: uid,
        success: function() {
          console.log("set spread success");
        },
      });
    },
    /**
     * 获取商品信息
     */
    loadData(productId) {
      let that = this;

      that.$http
        .post(that.$api.goods.detail, { product_id: productId })
        .then((res) => {
          console.log(res);
          if (res.return_code === "0000") {
            // 默认图片
            if (res.data.spec_default_pic) {
              that.specDefaultPic = res.data.spec_default_pic;
            }
            // 基本信息
            if (res.data.page_product_basic) {
              that.name = res.data.page_product_basic.title;
              that.image = res.data.page_product_basic.image_default_url;
              that.imageBase64 =
                res.data.page_product_basic.image_default_base64;
              that.imgList = res.data.page_product_basic.images || [
                { image_id: 1, image_url: that.image },
              ];
              that.favorite = res.data.page_product_basic.isFav;
              that.goodsId = res.data.page_product_basic.goods_id;
              that.sales = ~~res.data.page_product_basic.buy_count;
              that.views = ~~res.data.page_product_basic.view_count;
              that.marketable =
                res.data.page_product_basic.product_marketable === "true"
                  ? true
                  : false;
              that.discuss = res.data.discuss || {};
              that._formatPromotion(res.data.page_product_basic.promotion);
              that._formatSpec(res.data.page_product_basic.spec);
              that.getGoodsIntro(res.data.page_product_basic.goods_id);
            }
            // 价格
            console.log(res.data.product_price);
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
        })
        .catch((error) => {
          console.log(error);
        });
    },

    /**
     * 商品详情
     */
    getGoodsIntro(goodsId) {
      let that = this;
      that.$http
        .post(that.$api.goods.intro, { goods_id: goodsId })
        .then((res) => {
          if (res.return_code === "0000") {
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
        })
        .catch((error) => {
          console.log(error);
        });
    },
    toggleVideo(isShow) {
      let that = this;
      that.showVideo = isShow;
      if (isShow === true) {
        that.videoContext && that.videoContext.play();
      } else {
        that.videoContext &&
          that.videoContext.seek(0) &&
          that.videoContext.stop();
      }
    },
    /**
     * 规格弹窗开关
     */
    toggleSpec(isFastbuy = false) {
      this.isFastbuy = isFastbuy === true;
      if (this.specClass === "show") {
        this.specClass = "hide";
        setTimeout(() => {
          this.specClass = "none";
        }, 250);
      } else if (this.specClass === "none") {
        this.specClass = "show";
      }
    },
    /**
     * 海报弹窗开关
     */
    togglePoster() {
      if (this.posterClass === "show") {
        this.posterClass = "hide";
        setTimeout(() => {
          this.posterClass = "none";
        }, 250);
      } else if (this.posterClass === "none") {
        this.posterClass = "show";
      }
    },
    /**
     * 选择规格
     */
    selectSpec(spec) {
      let that = this;
      if (spec.hasOwnProperty("product_id")) {
        that.loadData(spec.product_id);
      }
    },
    /**
     * 分享
     */
    share() {
      let that = this;
      // 判断是否登录
      if (!that.hasLogin) {
        uni.navigateTo({
          url: "/pages/public/login",
        });
        return false;
      }
      if (that.shareQrcode === "") {
        that.$toast("请稍后再试");
        return false;
      }
      that.$refs.share.toggleMask();
    },
    doShare(e) {
      let that = this;
      if (e.type === 2) {
        console.log("生成海报");
        that.togglePoster();
        that.shareFc();
      }
    },
    async shareFc() {
      let that = this;
      if (that.poster.path) {
        return true;
      }
      try {
        const d = await getSharePoster({
          _this: that, //若在组件中使用 必传
          type: "shareType",
          formData: {
            //访问接口获取背景图携带自定义数据
          },
          posterCanvasId: that.canvasId, //canvasId
          delayTimeScale: 20, //延时系数
          background: {
            width: 1068,
            height: 1800,
            backgroundColor: "#ffffff",
          },
          drawArray: ({ bgObj, type, bgScale }) => {
            const fontSize = bgObj.width * 0.08;
            const padding = 40;
            const lineHeight = bgObj.height * 0.04;
            //可直接return数组，也可以return一个promise对象, 但最终resolve一个数组, 这样就可以方便实现后台可控绘制海报
            return new Promise((rs, rj) => {
              rs([
                {
                  type: "image",
                  serialNum: 0,
                  id: "goodsImage",
                  url: that.imageBase64,
                  dx: 0,
                  dy: 0,
                  infoCallBack(imageInfo) {
                    return {
                      dWidth: bgObj.width,
                      dHeight: bgObj.width,
                    };
                  },
                },
                {
                  type: "text",
                  serialNum: 1,
                  id: "price",
                  text: "￥" + that.price,
                  size: fontSize,
                  color: "#fa436a",
                  textAlign: "left",
                  textBaseline: "middle",
                  infoCallBack(textLength) {
                    return {
                      dx: padding,
                      dy: bgObj.width + fontSize / 2 + padding,
                    };
                  },
                },
                {
                  type: "text",
                  serialNum: 2,
                  id: "mktprice",
                  text: "￥" + that.mktprice,
                  size: (fontSize / 3) * 2,
                  color: "#606266",
                  textAlign: "left",
                  textBaseline: "middle",
                  lineThrough: {},
                  allInfoCallback({
                    //v3.0.1 更新 可以获取drawArray中全部数据
                    drawArray,
                  } = {}) {
                    const objPirce = drawArray.find(
                      (item) => item.id === "price"
                    );
                    return new Promise((rs, rj) => {
                      setTimeout(() => {
                        rs({
                          dx: objPirce.dx + objPirce.textLength + padding,
                          dy: objPirce.dy,
                        });
                      }, 1);
                    });
                  },
                },
                {
                  type: "text",
                  serialNum: 3,
                  id: "goodsName",
                  text: that.name,
                  size: (fontSize / 4) * 3,
                  color: "#000000",
                  textAlign: "left",
                  textBaseline: "middle",
                  lineFeed: {
                    maxWidth: bgObj.width - padding * 2,
                    lineHeight: fontSize + 10,
                    lineNum: 2,
                  },
                  allInfoCallback({
                    //v3.0.1 更新 可以获取drawArray中全部数据
                    drawArray,
                  } = {}) {
                    const objPirce = drawArray.find(
                      (item) => item.id === "price"
                    );
                    return new Promise((rs, rj) => {
                      setTimeout(() => {
                        rs({
                          dx: objPirce.dx,
                          dy: objPirce.dy + objPirce.size + padding,
                        });
                      }, 1);
                    });
                  },
                },
                {
                  type: "image",
                  serialNum: 4,
                  id: "qrcodeImage",
                  url: that.shareQrcode,
                  dx: 150,
                  dy: bgObj.height - 200 - padding,
                  dWidth: 200,
                  dHeight: 200,
                },
                {
                  type: "text",
                  serialNum: 5,
                  id: "qrcodeNotice",
                  text: "长按识别 去逛逛",
                  size: (fontSize / 3) * 2,
                  color: "#606266",
                  textAlign: "left",
                  textBaseline: "middle",
                  allInfoCallback({
                    //v3.0.1 更新 可以获取drawArray中全部数据
                    drawArray,
                  } = {}) {
                    const objQrcode = drawArray.find(
                      (item) => item.id === "qrcodeImage"
                    );
                    return new Promise((rs, rj) => {
                      setTimeout(() => {
                        rs({
                          dx: objQrcode.dx + 220,
                          dy: objQrcode.dy + 100,
                        });
                      }, 1);
                    });
                  },
                },
              ]);
            });
          },
          setCanvasWH: ({ bgObj, type, bgScale }) => {
            // 为动态设置画布宽高的方法，
            that.poster = bgObj;
          },
        });
        that.hideCanvas = true;
        that.poster = Object.assign({}, that.poster, {
          path: d.poster.tempFilePath,
        });
      } catch (e) {
        that.hideCanvas = true;
        console.log(e);
        uni.hideLoading();
      }
    },
    getProductQrcode() {
      let that = this;
      if (that.qrcodeRequesting) {
        return false;
      }

      let qrcodeData = {
        pid: that.productId,
        spread: "",
      };

      if (that.userInfo.member_id) {
        qrcodeData.spread = that.userInfo.member_id;
      }

      that.qrcodeRequesting = true;
      // #ifndef H5
      that.$http
        .post(that.$api.ectools.miniQrcode, qrcodeData)
        .then((res) => {
          if (res.return_code === "0000") {
            base64src("data:image/png;base64," + res.data.buffer)
              .then((shareQrcode) => {
                that.shareQrcode = shareQrcode;
              })
              .catch((error) => {
                console.log(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
          that.qrcodeRequesting = false;
        });
      // #endif
      // #ifdef H5
      qrcodeData.base_url = that._getShareBaseUrl();
      that.$http
        .post(that.$api.ectools.qrcode, qrcodeData)
        .then((res) => {
          console.log(window.location);
          if (res.return_code === "0000") {
            that.shareQrcode = "data:image/png;base64," + res.data.buffer;
          }
        })
        .catch((error) => {
          console.log(error);
          that.qrcodeRequesting = false;
        });
      // #endif
    },
    savePoster() {
      let that = this;
      // #ifndef H5
      uni.saveImageToPhotosAlbum({
        filePath: this.poster.path,
        success(res) {
          that.$toast("保存成功");
          that.togglePoster();
        },
      });
      // #endif
      // #ifdef H5
      that.$toast("请长按图片保存");
      // #endif
    },
    goodsComments() {
      let that = this;
      uni.navigateTo({
        url: "/pages/product/comment?gid=" + that.goodsId,
      });
    },
    /**
     * 收藏
     */
    toFavorite() {
      let that = this;

      // 判断是否登录
      if (!that.hasLogin) {
        uni.navigateTo({
          url: "/pages/public/login",
        });
        return false;
      }

      if (that.requesting) {
        return false;
      }

      if (!that.goodsId) {
        return false;
      }

      that.requesting = true;

      let postUrl = that.favorite
        ? that.$api.user.removeFav
        : that.$api.user.addFav;

      that.$http
        .post(postUrl, { gid: that.goodsId, type: "goods" })
        .then((res) => {
          that.requesting = false;
          if (res.return_code === "0000") {
            if (that.favorite) {
              that.$toast("移除成功");
            } else {
              that.$toast("收藏成功");
            }
            that.favorite = !that.favorite;
          } else {
            console.log(res.error);
            that.$toast("收藏失败");
          }
        })
        .catch((error) => {
          that.requesting = false;
          console.log(error);
          that.$toast("收藏失败");
        });
    },
    /**
     * 立即购买
     */
    buy() {
      let that = this;

      // 判断是否登录
      if (!that.hasLogin) {
        uni.navigateTo({
          url: "/pages/public/login",
        });
        return false;
      }

      uni.navigateTo({
        url: `/pages/order/createOrder`,
      });
    },
    /**
     * 加入购物车
     */
    addCart() {
      let that = this;

      that.toggleSpec(that.isFastbuy);

      // 判断是否登录
      if (!that.hasLogin) {
        uni.navigateTo({
          url: "/pages/public/login",
        });
        return false;
      }

      if (that.requesting) {
        return false;
      }

      if (!that.productId || !that.goodsId) {
        return false;
      }

      let data = {
        goods_id: that.goodsId,
        product_id: that.productId,
        num: 1,
        mini_cart: true,
      };

      if (that.isFastbuy) {
        data.btype = "is_fastbuy";
      }

      that.requesting = true;
      uni.showLoading();

      that.$http
        .post(that.$api.cart.add, data)
        .then((res) => {
          uni.hideLoading();
          if (res.return_code === "0000") {
            that.$toast("添加成功");
            that.requesting = false;
            that.setCart({
              itemsQuantity: res.data.cartNumber,
              itemsCount: res.data.cartCount,
            });
            if (that.isFastbuy) {
              setTimeout(function() {
                uni.navigateTo({
                  url: `/pages/order/createOrder?fastbuy=1`,
                });
              }, 1000);
            }
          } else {
            that.requesting = false;
            console.log(res.error);
            that.$toast(res.error);
          }
        })
        .catch((error) => {
          that.requesting = false;
          uni.hideLoading();
          console.log(error);
          that.$toast("添加失败");
        });
    },
    stopPrevent() {},
  },
};
</script>

<style lang="scss">
page {
  background: $page-color-base;
  padding-bottom: 160rpx;
}
.icon-you {
  font-size: $font-base + 2rpx;
  color: #888;
}
.carousel {
  height: 722rpx;
  position: relative;
  .video {
    width: 100%;
    height: 100%;
    video {
      width: 100%;
      height: 100%;
    }
    .stop-btn {
      width: 120rpx;
      height: 40rpx;
      border-radius: 10rpx;
      line-height: 40rpx;
      text-align: center;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 20rpx;
      margin: 0 auto;
      z-index: 100;
      background: $page-color-base;
      font-size: 24rpx;
      opacity: 0.7;
    }
  }
  swiper {
    height: 100%;
  }
  .swiper-item {
    display: flex;
    justify-content: center;
    align-content: center;
    .image-wrapper {
      width: 100%;
      height: 100%;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .video-btn {
      width: 50rpx;
      height: 50rpx;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      image {
        width: 50rpx;
        height: 50rpx;
      }
    }
  }
}

/* 标题简介 */
.introduce-section {
  background: #fff;
  padding: 20rpx 30rpx;

  .title {
    font-size: 32rpx;
    color: $font-color-dark;
    height: 50rpx;
    line-height: 50rpx;
  }
  .price-box {
    display: flex;
    align-items: baseline;
    height: 64rpx;
    padding: 10rpx 0;
    font-size: 26rpx;
    color: $uni-color-primary;
  }
  .price {
    font-size: $font-lg + 2rpx;
  }
  .m-price {
    margin: 0 12rpx;
    color: $font-color-light;
    text-decoration: line-through;
  }
  .coupon-tip {
    align-items: center;
    padding: 4rpx 10rpx;
    background: $uni-color-primary;
    font-size: $font-sm;
    color: #fff;
    border-radius: 6rpx;
    line-height: 1;
    transform: translateY(-4rpx);
  }
  .bot-row {
    display: flex;
    align-items: center;
    height: 50rpx;
    font-size: $font-sm;
    color: $font-color-light;
    text {
      flex: 1;
    }
  }
}
/* 分享 */
.share-section {
  display: flex;
  align-items: center;
  color: $font-color-base;
  background: linear-gradient(to left, #fdf5f6, #fbebf6);
  padding: 12rpx 30rpx;
  .share-icon {
    display: flex;
    align-items: center;
    width: 70rpx;
    height: 30rpx;
    line-height: 1;
    border: 1px solid $uni-color-primary;
    border-radius: 4rpx;
    position: relative;
    overflow: hidden;
    font-size: 22rpx;
    color: $uni-color-primary;
    &:after {
      content: "";
      width: 50rpx;
      height: 50rpx;
      border-radius: 50%;
      left: -20rpx;
      top: -12rpx;
      position: absolute;
      background: $uni-color-primary;
    }
  }
  .icon-xingxing {
    position: relative;
    z-index: 1;
    font-size: 24rpx;
    margin-left: 2rpx;
    margin-right: 10rpx;
    color: #fff;
    line-height: 1;
  }
  .tit {
    font-size: $font-base;
    margin-left: 10rpx;
  }
  .icon-bangzhu1 {
    padding: 10rpx;
    font-size: 30rpx;
    line-height: 1;
  }
  .share-btn {
    flex: 1;
    text-align: right;
    font-size: $font-sm;
    color: $uni-color-primary;
  }
  .icon-you {
    font-size: $font-sm;
    margin-left: 4rpx;
    color: $uni-color-primary;
  }
}

.c-list {
  font-size: $font-sm + 2rpx;
  color: $font-color-base;
  background: #fff;
  .c-row {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    position: relative;
  }
  .tit {
    width: 140rpx;
  }
  .con {
    flex: 1;
    color: $font-color-dark;
    .selected-text {
      margin-right: 10rpx;
    }
  }
  .bz-list {
    height: 40rpx;
    font-size: $font-sm + 2rpx;
    color: $font-color-dark;
    text {
      display: inline-block;
      margin-right: 30rpx;
    }
  }
  .con-list {
    flex: 1;
    display: flex;
    flex-direction: column;
    color: $font-color-dark;
    line-height: 40rpx;
  }
  .red {
    color: $uni-color-primary;
  }
}

/* 评价 */
.eva-section {
  display: flex;
  flex-direction: column;
  padding: 20rpx 30rpx;
  background: #fff;
  margin-top: 16rpx;
  .e-header {
    display: flex;
    align-items: center;
    height: 70rpx;
    font-size: $font-sm + 2rpx;
    color: $font-color-light;
    .tit {
      font-size: $font-base + 2rpx;
      color: $font-color-dark;
      margin-right: 4rpx;
    }
    .tip {
      flex: 1;
      text-align: right;
    }
    .icon-you {
      margin-left: 10rpx;
    }
  }
}
.eva-box {
  display: flex;
  padding: 20rpx 0;
  .portrait {
    flex-shrink: 0;
    width: 80rpx;
    height: 80rpx;
    border-radius: 100px;
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: $font-base;
    color: $font-color-base;
    padding-left: 26rpx;
    .con {
      font-size: $font-base;
      color: $font-color-dark;
      padding: 20rpx 0;
    }
    .bot {
      display: flex;
      justify-content: space-between;
      font-size: $font-sm;
      color: $font-color-light;
    }
  }
}
/*  详情 */
.detail-desc {
  background: #fff;
  margin-top: 16rpx;
  .d-header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80rpx;
    font-size: $font-base + 2rpx;
    color: $font-color-dark;
    position: relative;

    text {
      padding: 0 20rpx;
      background: #fff;
      position: relative;
      z-index: 1;
    }
    &:after {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%);
      width: 300rpx;
      height: 0;
      content: "";
      border-bottom: 1px solid #ccc;
    }
  }
}

/* 规格选择弹窗 */
.attr-content {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 10rpx 30rpx;
  .a-t {
    width: 100%;
    display: flex;
    image {
      width: 170rpx;
      height: 170rpx;
      flex-shrink: 0;
      margin-top: -40rpx;
      border-radius: 8rpx;
    }
    .right {
      display: flex;
      flex-direction: column;
      padding-left: 24rpx;
      font-size: $font-sm + 2rpx;
      color: $font-color-base;
      line-height: 42rpx;
      .price {
        font-size: $font-lg;
        color: $uni-color-primary;
        margin-bottom: 10rpx;
      }
      .selected-text {
        margin-right: 10rpx;
      }
    }
  }
  .attr-list {
    width: 100%;
    display: flex;
    flex-direction: column;
    font-size: $font-base + 2rpx;
    color: $font-color-base;
    padding-top: 30rpx;
    padding-left: 10rpx;
  }
  .item-list {
    padding: 20rpx 0 0;
    display: flex;
    flex-wrap: wrap;
    text {
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
    .selected {
      background: #fbebee;
      color: $uni-color-primary;
    }
  }
  .btn {
    width: 100%;
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
    .mask {
      animation: showPopup 0.2s linear both;
    }
    .layer {
      animation: showLayer 0.2s linear both;
    }
  }
  &.hide {
    .mask {
      animation: hidePopup 0.2s linear both;
    }
    .layer {
      animation: hideLayer 0.2s linear both;
    }
  }
  &.none {
    display: none;
  }
  .mask {
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
    .btn {
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
.page-bottom {
  position: fixed;
  left: 30rpx;
  bottom: 30rpx;
  z-index: 95;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 690rpx;
  height: 100rpx;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, 0.5);
  border-radius: 16rpx;

  .p-b-btn {
    position: relative;
    flex: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: $font-sm;
    color: $font-color-base;
    width: 96rpx;
    height: 80rpx;
    .yticon {
      font-size: 40rpx;
      line-height: 48rpx;
      color: $font-color-light;
    }
    &.active,
    &.active .yticon {
      color: $uni-color-primary;
    }
    .icon-fenxiang2 {
      font-size: 42rpx;
      transform: translateY(-2rpx);
    }
    .icon-shoucang {
      font-size: 46rpx;
    }
    .dot {
      background-color: $base-color;
      position: absolute;
      top: -6rpx;
      right: -6rpx;
      color: #ffffff;
      font-size: 16rpx;
      width: 44rpx;
      height: 24rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 24rpx;
    }
  }
  .action-btn-group {
    flex: auto;
    display: flex;
    height: 76rpx;
    border-radius: 100px;
    overflow: hidden;
    box-shadow: 0 20rpx 40rpx -16rpx #fa436a;
    box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
    background: linear-gradient(to right, #ffac30, #fa436a, #f56c6c);
    margin: 0 20rpx;
    position: relative;
    &:after {
      content: "";
      position: absolute;
      top: 50%;
      right: 50%;
      transform: translateY(-50%);
      height: 28rpx;
      width: 0;
      border-right: 1px solid rgba(255, 255, 255, 0.5);
    }
    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 180rpx;
      height: 100%;
      font-size: $font-base;
      padding: 0;
      border-radius: 0;
      background: transparent;
    }
  }
  .disabled {
    flex: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.hideCanvas {
  display: none;
}
</style>
