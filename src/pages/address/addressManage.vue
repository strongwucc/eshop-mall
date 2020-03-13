<template>
  <view class="content">
    <view class="row b-b">
      <text class="tit">联系人</text>
      <input
        class="input"
        type="text"
        v-model="addr.name"
        placeholder="收货人姓名"
        placeholder-class="placeholder"
      />
    </view>
    <view class="row b-b">
      <text class="tit">手机号</text>
      <input
        class="input"
        type="number"
        v-model="addr.mobile"
        placeholder="收货人手机号码"
        placeholder-class="placeholder"
      />
    </view>
    <view class="row b-b" @click="showRegions">
      <text class="tit">所在地区</text>
      <text class="input" :class="{'empty': addr.area ? false : true}">{{areaTxt}}</text>
    </view>
    <view class="row b-b">
      <text class="tit">详细地址</text>
      <input
        class="input"
        type="text"
        v-model="addr.addr"
        placeholder="详细地址"
        placeholder-class="placeholder"
      />
    </view>

    <view class="row default-row">
      <text class="tit">设为默认</text>
      <switch :checked="~~addr.def_addr === 1" color="#fa436a" @change="switchChange" />
    </view>
    <button class="add-btn" @click="confirm">提交</button>
    <button class="del-btn" @click="delAddr" v-if="manageType === 'edit'">删除地址</button>
    <lb-picker
      ref="addrPicker"
      v-model="region"
      mode="multiSelector"
      :list="regions"
      :level="3"
      @confirm="confirmRegionPicker"
    ></lb-picker>
  </view>
</template>

<script>
import LbPicker from "@/components/lb-picker";
export default {
  components: {
    LbPicker
  },
  data() {
    return {
      addr: {
        addr_id: "",
        name: "",
        mobile: "",
        area: "",
        addr: "",
        def_addr: 0
      },
      region: [],
      regions: [],
      manageType: "add",
      requesting: false
    };
  },
  computed: {
    areaTxt() {
      let that = this;
      if (that.addr.area) {
        return that.addr.area
          .split(":")[1]
          .split("/")
          .join("");
      }
      return "请选择地区";
    }
  },
  onLoad(option) {
    let that = this;
    let title = "新增收货地址";
    if (option.type === "edit") {
      title = "编辑收货地址";
      let {
        addr_id,
        name,
        mobile,
        area,
        addr,
        def_addr,
        addr_path
      } = JSON.parse(option.data);
      that.addr = { addr_id, name, mobile, area, addr, def_addr };
      that.region = addr_path.length > 0 ? addr_path : [];
    }
    that.manageType = option.type;
    uni.setNavigationBarTitle({
      title
    });

    that.getRegions();
  },
  methods: {
    /**
     * 获取地区映射信息
     */
    getRegions() {
      let that = this;
      that.$http
        .post(that.$api.ectools.regions)
        .then(res => {
          if (res.return_code === "0000") {
            that.regions = res.data;
          } else {
            console.log(res);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    /**
     * 切换默认值
     */
    switchChange(e) {
      let that = this;
      that.addr.def_addr = e.detail.value ? 1 : 0;
    },
    /**
     * 展示地区选择
     */
    showRegions() {
      let that = this;
      that.$refs.addrPicker.show();
    },
    /**
     * 确认地区选择
     */
    confirmRegionPicker(e) {
      let that = this;

      let area =
        "mainland:" +
        e.item.map(item => item.label).join("/") +
        ":" +
        e.item[e.item.length - 1].value;

      that.addr = Object.assign({}, that.addr, {area: area});
    },
    //提交
    confirm() {
      let that = this;

      if (that.requesting) {
        return false;
      }

      let data = that.addr;
      if (!data.name) {
        that.$toast("请填写收货人姓名");
        return false;
      }
      if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(data.mobile)) {
        that.$toast("请输入正确的手机号码");
        return false;
      }
      if (!data.area) {
        that.$toast("请选择所在地区");
        return false;
      }
      if (!data.addr) {
        that.$toast("请填写详细地址");
        return false;
      }

      that.requesting = true;

      that.$http
        .post(that.$api.user.addAddr, data)
        .then(res => {
          that.requesting = false;
          if (res.return_code === "0000") {
            that.$prevPage().refreshList();
            that.$toast(
              `地址${this.manageType == "edit" ? "修改" : "添加"}成功`
            );
            setTimeout(() => {
              uni.navigateBack();
            }, 800);
          } else {
            console.log(res);
            that.$toast("保存失败");
          }
        })
        .catch(error => {
          that.requesting = false;
          console.log(error);
          that.$toast("保存失败");
        });
    },
    delAddr() {
      let that = this;

      if (that.requesting) {
        return false;
      }

      if (!that.addr.addr_id) {
        return false;
      }

      uni.showModal({
        content: "确定删除？",
        success: e => {
          if (e.confirm) {
            that.requesting = true;
            that.$http
              .post(that.$api.user.removeAddr, { addr_id: that.addr.addr_id })
              .then(res => {
                that.requesting = false;
                if (res.return_code === "0000") {
                  that.$prevPage().refreshList();
                  that.$toast("地址删除成功");
                  setTimeout(() => {
                    uni.navigateBack();
                  }, 800);
                } else {
                  console.log(res);
                  that.$toast("删除失败");
                }
              })
              .catch(error => {
                that.requesting = false;
                console.log(error);
                that.$toast("删除失败");
              });
          }
        }
      });
    }
  }
};
</script>

<style lang="scss">
page {
  background: $page-color-base;
  padding-top: 16rpx;
}

.row {
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 30rpx;
  height: 110rpx;
  background: #fff;

  .tit {
    flex-shrink: 0;
    width: 150rpx;
    font-size: 30rpx;
    color: $font-color-dark;
  }
  .input {
    flex: 1;
    font-size: 30rpx;
    color: $font-color-dark;
  }
  .empty {
    color: $font-color-light;
  }
  .icon-shouhuodizhi {
    font-size: 36rpx;
    color: $font-color-light;
  }
}
.default-row {
  margin-top: 16rpx;
  .tit {
    flex: 1;
  }
  switch {
    transform: translateX(16rpx) scale(0.9);
  }
}
.add-btn,
.del-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 690rpx;
  height: 80rpx;
  margin: 60rpx auto 0;
  font-size: $font-lg;
  color: #fff;
  border-radius: 10rpx;
}
.add-btn {
  background-color: $base-color;
}
.del-btn {
  background-color: $font-color-disabled;
}
</style>
