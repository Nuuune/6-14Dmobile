<template>
  <div>
    <component :is="currTabComponent"></component>
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

export default {
  name: 'Clock',
  data() {
    return {
      currTabComponent: `Location`
    };
  },
  components: {
    Location,
    Count
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
