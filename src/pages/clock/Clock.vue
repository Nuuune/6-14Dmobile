<template>
  <div>
    <keep-alive>
      <component ref="child" :is="currTabComponent" @checkin="checkin"></component>
    </keep-alive>
    <!-- 底部切换开始 -->
    <div class="foot-tab flex flex-row align-end">
      <div @click="changeTab(`Location`)" class="flex flex-center flex-item-1" :class="{'foot-tab-active': isLocation}">
        <div class="icon icon-location"></div>
        <div class="text">打卡</div>
      </div>
      <div @click="changeTab(`Count`)" class="flex flex-center flex-item-1" :class="{'foot-tab-active': !isLocation}">
        <div class="icon icon-count"></div>
        <div class="text">统计</div>
      </div>
    </div>
    <!-- 底部切换结束 -->
  </div>
</template>

<script>
import Location from './components/Location.vue';
import Count from './components/Count.vue';
import { api_login, api_checkin, api_records } from '@/api';

export default {
  name: 'Clock',
  data() {
    return {
      currTabComponent: `Location`,
      token: ''
    };
  },
  components: {
    Location,
    Count
  },
  created() {
    api_login({
      params: {
        openid: `1`
      },
      success: (data) => {
        console.log(data);
        this.token = data.access_token;
      },
      fail: (errmsg) => {
        console.error(errmsg);
      }
    });
  },
  computed: {
    isLocation() {
      return this.currTabComponent === `Location`;
    }
  },
  methods: {
    changeTab(name) {
      if (this.currTabComponent !== name) {
        this.currTabComponent = name;
      }
    },
    getCurrDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      return `${year}${month > 9 ? month : '0' + month}${day > 9 ? day : '0' + day}`;
    },
    checkin(dk_params) {
      api_checkin({
        params: dk_params,
        success: () => {
          // 获取当天记录
          api_records({
            params: {
              queryDate: this.getCurrDate()
            },
            success: (data) => {
              this.$refs.child.step(data.data[0].checkinAt, data.data[0].location);
              console.log(data);
            },
            fail: (errmsg) => {
              console.error(errmsg);
            }
          });
        },
        fail: (errmsg) => {
          console.error(errmsg);
        }
      });
    }
  }
};
</script>

<style src="@/assets/css/clock.css"></style>
