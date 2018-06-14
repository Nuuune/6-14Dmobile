<template>
  <div>
    <component :is="currTabComponent"></component>
    <!-- 底部切换开始 -->
    <div class="foot-tab flex flex-row align-end">
      <div class="flex flex-center flex-item-1">
        <div class="icon"><img src="../../assets/images/location.png" /></div>
        <div class="text">打卡</div>
      </div>
      <div class="flex flex-center flex-item-1">
        <div class="icon"><img src="../../assets/images/count.png" /></div>
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
      currTabComponent: Count
    };
  },
  components: {
    Location,
    Count
  }
};
</script>

<style src="../../assets/css/clock.css"></style>
