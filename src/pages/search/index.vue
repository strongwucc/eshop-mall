<template>
  <view class="container">Search</view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(["searchKeys"])
  },
  onLoad(options) {},
  onShow() {
    let that = this;
    if (that.searchKeys.length === 0) {
      uni.getStorage({
        key: "searchKeys",
        success: function(res) {
          that.setSearchKeys(JSON.parse(res.data));
        }
      });
    }
  },
  methods: {
    ...mapMutations(["setSearchKeys"])
  }
};
</script>

<style lang="scss">
</style>