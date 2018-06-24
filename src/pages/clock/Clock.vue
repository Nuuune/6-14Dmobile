<template>
  <div>
    <template v-if="isLogin">
      <keep-alive>
        <component ref="child" :today="today" :userInfo="userInfo" :is="currTabComponent"></component>
      </keep-alive>
    </template>
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
import { api_login } from '@/api';
import { set_headerConf } from '@/axios';

export default {
  name: 'Clock',
  data() {
    return {
      currTabComponent: `Location`,
      isLogin: false,
      today: new Date(),
      userInfo: {
        name: ''
      }
    };
  },
  components: {
    Location,
    Count
  },
  created() {
    // 获取角色相关信息
    try {
      window.LandaJS.ready(function() {
        const user_name = window.LandaJS.getUserInfo().name;
        const init_token = window.LandaJS.getAccessToken();
        set_headerConf({ token: init_token });
        this.userInfo = {
          name: user_name
        };
        api_login({
          params: {
            openid: `1`
          },
          success: () => {
            this.isLogin = true;
          },
          fail: (errmsg) => {
            console.error(errmsg);
          }
        });
      });
    } catch (err) {
      alert(err);
    }
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
    }
  }
};
</script>

<style src="@/assets/css/clock.css"></style>
