<template>
  <view class="container">
    <scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData">
      <empty v-if="loaded === true && goods.length === 0"></empty>
      <uni-load-more :status="loadingType"></uni-load-more>
    </scroll-view>
  </view>
</template>

<script>
import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
import empty from "@/components/empty";
export default {
  components: {
    uniLoadMore,
    empty
  },
  data() {
    return {
      goods: [],
      page: 1,
      loadingType: "more",
      loaded: false
    };
  },
  onLoad(options) {},
  onShow() {
    let that = this;
    that.loadData();
  },
  methods: {
    loadData() {
      let that = this;
      if (that.loadingType === "noMore") {
        return false;
      }
      that.loadingType = "loading";
      that.$http
        .post(that.$api.user.afterList, { page: that.page })
        .then(res => {
          that.loaded = true;
          if (res.return_code === "0000") {
            if (~~res.data.pager.current === ~~res.data.pager.total) {
              that.loadingType = "noMore";
            } else {
              that.loadingType = "more";
            }
            console.log(res.data);
          } else {
            console.log(res);
            that.loadingType = "more";
          }
        })
        .catch(error => {
          console.log(error);
          that.loadingType = "more";
        });
    }
  }
};
</script>

<style lang="scss">
</style>