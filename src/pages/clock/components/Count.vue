<template>
  <div>
    <!-- 时间选择器开始 -->
    <div class="flex flex-row flex-center time-picker-wrap">
      <div>{{date.year}}年{{date.month}}月</div>
      <div @click="showPop" class="btn-ar-down"></div>
    </div>
    <!-- 时间选择器结束 -->
    <!-- 正常记录开始 -->
    <div class="flex flex-row flex-between show-wrap bg-blue day-count">
      <div>正常考勤</div>
      <div><span class="num">{{theData.normalDays}}</span>天</div>
    </div>
    <!-- 正常记录结束 -->
    <!-- 未打卡记录开始 -->
    <div class="flex flex-row flex-between no-clock-wrap">
      <div class="no-clock-cell flex flex-between">
        <div class="title">迟到</div>
        <div class="num">{{theData.lateDays}}次</div>
      </div>
      <div class="v-line"></div>
      <div class="no-clock-cell flex flex-between">
        <div class="title">早退</div>
        <div class="num">{{theData.earlyDays}}次</div>
      </div>
      <div class="v-line"></div>
      <div class="no-clock-cell flex flex-between">
        <div class="title">缺卡</div>
        <div class="num">{{theData.absentDays}}次</div>
      </div>
    </div>
    <!-- 未打卡记录结束 -->
    <!-- 弹出层开始 -->
    <Popup v-model="show" position="bottom" @click-overlay="cancelPop">
      <div class="flex flex-row flex-between pop-btns">
        <div @click="cancelPop" class="btn-cancel">取消</div>
        <div @click="setDate" class="btn-success">确定</div>
      </div>
      <div class="pickers flex flex-row flex-center">
        <Picker @change="onYChange" :columns="years" />
        <Picker @change="onMChange" :columns="month" />
      </div>
    </Popup>
    <!-- 弹出层结束 -->
  </div>
</template>
<script>
import { Popup, Picker } from 'vant';
import { getCurrYM } from '@/utils/date';
import { api_stat } from '@/api';

const defaultDate = {
  year: `1999`,
  month: `1`
};

const default_data = {
  normalDays: `暂无`,
  lateDays: 0,
  earlyDays: 0,
  absentDays: 0
};

export default {
  name: 'clock-count',
  components: {
    Popup,
    Picker
  },
  data() {
    return {
      show: false,
      date: defaultDate,
      tempDate: defaultDate,
      theData: Object.assign({}, default_data)
    };
  },
  created() {
    this.date = getCurrYM(); // 获取当前系统的年月
    this.tempDate = getCurrYM();
    this.yearRange = [this.date.year + 10, this.date.year - 10]; // 需要显示的年范围
    this.getTheData(this.date.year, this.date.month); // 获取当天的数据
  },
  computed: {
    /* picker的年月选项由this.yearRange生成 --start */
    years() {
      const minY = this.yearRange[1];
      const maxY = this.yearRange[0];
      const currY = this.date.year;
      let defaultIndex;
      const output = [];
      for (let i = minY; i <= maxY; i++) {
        if (i === currY) {
          defaultIndex = i - minY;
        }
        output.push(`${i}年`);
      }
      return [{ values: output, defaultIndex }];
    },
    month() {
      const output = [];
      const currM = this.date.month;
      let defaultIndex;
      for (let i = 1; i <= 12; i++) {
        if (i === currM) {
          defaultIndex = i - 1;
        }
        output.push(`${i}月`);
      }
      return [{ values: output, defaultIndex }];
    }
    /* picker的年月选项由this.yearRange生成 --end */
  },
  /* 方法部分 --start */
  methods: {
    getTheData(year, month) {
      return new Promise((resolve, reject) => {
        api_stat({
          params: {
            year,
            month
          },
          success: (data) => {
            const {
              normalDays,
              lateDays,
              earlyDays,
              absentDays
            } = data;
            this.theData = {
              normalDays,
              lateDays,
              earlyDays,
              absentDays
            };
            resolve(true);
          },
          fail: (errmsg) => {
            if (errmsg) {
              this.$toast({
                message: errmsg,
                forbidClick: true,
                duration: 1500
              });
              this.theData = Object.assign({}, default_data);
              resolve(true);
            } else {
              this.$toast({
                message: `请求失败`,
                forbidClick: true,
                duration: 1500
              });
              resolve(false);
            }
          }
        });
      });
    },
    onYChange(picker, values) {
      this.tempDate.year = values[0].replace(/[^\d]/g, '');
    },
    onMChange(picker, values) {
      this.tempDate.month = values[0].replace(/[^\d]/g, '');
    },
    cancelPop() {
      console.log(`已取消选择`);
      this.show = false;
    },
    async setDate() {
      console.log(`设置成功`);
      const isGet = await this.getTheData(this.tempDate.year, this.tempDate.month); // 获取当天的数据
      isGet && (this.show = false, this.date = Object.assign({}, this.tempDate));
    },
    showPop() {
      console.log(`弹窗`);
      this.show = true;
    }
  }
  /* 方法部分 --end */
};
</script>
