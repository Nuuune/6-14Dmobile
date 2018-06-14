<template>
  <div>
    <!-- 人物信息开始 -->
    <div class="flex flex-row flex-between header">
      <div class="flex flex-row">
        <div class="img">
          <img src="../../../assets/images/avatar_03.png" />
        </div>
        <div class="flex flex-between align-start des">
          <span class="name">王某某</span>
          <span class="age">2018/06/07</span>
        </div>
      </div>
      <div class="icon">
        <img src="../../../assets/images/datemap.png" />
      </div>
    </div>
    <!-- 人物信息结束 -->
    <!-- 打卡模块开始 -->
    <div class="dk-wrap flex flex-between">
      <div class="dk-view">
        <van-steps
          :active="2"
          direction="vertical"
          active-color="#239aed">
          <van-step><div>上班打卡时间08:53:12</div><div><div></div>上海市普陀区中江路112号</div></van-step>
          <van-step>下班打卡</van-step>
          <van-step>打卡记录时间和位置</van-step>
        </van-steps>
      </div>
      <div class="dk-btn">
        <div class="circle-bg flex flex-center">
          <div class="text">下班打卡</div>
          <div class="time">17:53:12</div>
        </div>
      </div>
    </div>
    <!-- 打卡模块结束 -->
  </div>
</template>
<script>
export default {
  name: 'clock-location',
  data() {
    return {};
  }
};
</script>
