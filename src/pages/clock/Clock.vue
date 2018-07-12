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
    // alert(`加载打卡页面`);
    // 获取角色相关信息
    try {
      window.LandaJS.ready(() => {
        const userInfo = window.LandaJS.getUserInfo();
        const user_corpId = userInfo.corpId;
        const user_openid = userInfo.openid;
        const init_token = window.LandaJS.getAccessToken();
        // alert(`Landa准备好了`);
        // alert(`user_corpId: ${user_corpId}\nuser_openid: ${user_openid}\ninit_token: ${init_token}`);
        set_headerConf({ token: `${init_token}`, corp_key: user_corpId });
        this.userInfo = userInfo;
        api_login({
          params: {
            openid: user_openid
          },
          success: () => {
            // alert(`登陆成功`);
            this.isLogin = true;
          },
          fail: (errmsg) => {
            // alert(`登陆失败: ${errmsg}`);
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
