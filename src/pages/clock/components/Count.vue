<template>
  <div>
    <!-- 时间选择器开始 -->
    <div class="flex flex-row flex-center time-picker-wrap">
      <div>2018年6月</div>
      <div class="btn-ar-down"></div>
    </div>
    <!-- 时间选择器结束 -->
    <!-- 正常记录开始 -->
    <div class="flex flex-row flex-between show-wrap bg-blue day-count">
      <div>正常考勤</div>
      <div><span class="num">12</span>天</div>
    </div>
    <!-- 正常记录结束 -->
    <!-- 未打卡记录开始 -->
    <div class="flex flex-row flex-between no-clock-wrap">
      <div class="no-clock-cell flex flex-between">
        <div class="title">迟到</div>
        <div class="num">0次</div>
      </div>
      <div class="v-line"></div>
      <div class="no-clock-cell flex flex-between">
        <div class="title">早退</div>
        <div class="num">0次</div>
      </div>
      <div class="v-line"></div>
      <div class="no-clock-cell flex flex-between">
        <div class="title">缺卡</div>
        <div class="num">0次</div>
      </div>
    </div>
    <!-- 未打卡记录结束 -->
    <!-- 弹出层开始 -->
    <Popup v-model="show" position="bottom">
      <div class="flex flex-row flex-between pop-btns">
        <div class="btn-cancel">取消</div>
        <div class="btn-success">确定</div>
      </div>
      <div class="flex flex-row flex-center">
        <Picker :columns="years" />
        <Picker :columns="mouth" />
      </div>
    </Popup>
    <!-- 弹出层结束 -->
  </div>
</template>
<script>
import { Popup, Picker } from 'vant';

export default {
  name: 'clock-count',
  data() {
    return {
      show: true
    };
  },
  created() {
    this.yearRange = [1995, 2040];
  },
  computed: {
    years() {
      const minY = this.yearRange[0];
      const maxY = this.yearRange[1];
      const output = [];
      for (let i = minY; i <= maxY; i++) {
        output.push(`${i}年`);
      }
      return output;
    },
    mouth() {
      const output = [];
      for (let i = 1; i <= 12; i++) {
        output.push(`${i}月`);
      }
      return output;
    }
  },
  components: {
    Popup,
    Picker
  }
};
</script>
<style>
/* 弹窗控制按钮 */
.pop-btns {
  padding: .2rem;
  font-size: .3rem;
}
.pop-btns .btn-cancel{
  color: #303030;
}
.pop-btns .btn-success{
  color: #35a5f3;
}
</style>
