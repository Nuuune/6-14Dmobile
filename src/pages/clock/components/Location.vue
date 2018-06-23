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
      <div @click="popShow" class="icon icon-calendar">
      </div>
    </div>
    <!-- 人物信息结束 -->
    <!-- 打卡模块开始 -->
    <div class="dk-wrap flex">
      <div class="dk-view">
        <van-steps
          :active="dkArr.length - 1"
          direction="vertical"
          active-color="#239aed">
          <van-step v-for="(item,index) in dkArr" :key="index">
            <div v-if="index === dkArr.length - 1">{{item.text}}{{dkArr.length}}</div>
            <template v-else>
              <div>{{index === 0 ? `上班打卡时间` : `下班时间打卡`}}<span class="hlight">{{item.time}}</span></div>
              <div><span class="icon-location"></span><span class="hlight">{{item.address}}</span></div>
            </template>
          </van-step>
        </van-steps>
      </div>
      <div class="dk-btn" @click="dk">
        <div class="circle-bg flex flex-center">
          <div class="text">{{dkArr.length > 1 ? '下班打卡' : '上班打卡'}}</div>
          <div class="time">{{dkTime}}</div>
        </div>
      </div>
    </div>
    <!-- 打卡模块结束 -->
    <!-- 打卡提示窗开始 -->
    <Popup v-model="dkshow">
      <div class="dk-info flex align-stretch">
        <div class="content flex flex-center">
          <img src="@/assets/images/Circle.png" />
          <div>打卡成功</div>
        </div>
        <div @click="hiddenDialog" class="footer flex flex-center">
          <img src="@/assets/images/cancel.png" />
        </div>
      </div>
    </Popup>
    <!-- 打卡提示窗结束 -->
    <!-- 弹出层开始 -->
    <Popup v-model="show" position="bottom" >
      <div class="flex flex-row flex-between pop-btns">
        <div class="btn-cancel" @click="popHidden">取消</div>
        <div class="title" style="fontSize: .32rem">请选择查看时间</div>
        <div class="btn-success" style="opacity:0">确定</div>
      </div>
      <div class="datemap flex">
        <div class="week">
          <div>日</div>
          <div>一</div>
          <div>二</div>
          <div>三</div>
          <div>四</div>
          <div>五</div>
          <div>六</div>
        </div>
        <div class="month-scroll">
          <List
          v-model="loading"
          :finished="finished"
          @load="onLoad">
            <div class="curr-month" :class="'m-shape-' + month.shape" v-for="(month, idex) in monthes" :key="idex">
              <div class="title">{{month.year}}年{{month.month}}月</div>
              <div class="date">
                <div class="flex" v-for="(item, idex2) in month.dates" :key="idex2">
                  <div class="date-value" :class="'color' + item.color">
                    {{item && item.value !== null ? item.value : ``}}
                  </div>
                  <div class="date-des">
                    {{item && item.des !== null ? item.des : ``}}
                  </div>
                </div>
              </div>
            </div>
          </List>
        </div>
      </div>
    </Popup>
    <!-- 弹出层结束 -->

  </div>
</template>
<script>
import { List, Popup, Cell } from 'vant';
import { getTotalDay } from '@/utils/date';

export default {
  name: 'clock-location',
  data() {
    return {
      dkArr: [{ text: `打卡记录时间和位置` }],
      show: false,
      monthes: [],
      loading: false,
      finished: false,
      dkshow: false,
      currTime: new Date()
    };
  },
  components: {
    Popup,
    List,
    Cell
  },
  created() {
    this.currTime = new Date();
    this.timerId = setInterval(() => {
      this.currTime = new Date();
    }, 1000);
  },
  computed: {
    dkTime() {
      const h = this.currTime.getHours();
      const m = this.currTime.getMinutes();
      const s = this.currTime.getSeconds();
      return `${h > 9 ? h : '0' + h}:${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`;
    }
  },
  methods: {
    step(ts, location) {
      const td = new Date(ts);
      const h = td.getHours();
      const m = td.getMinutes();
      const s = td.getSeconds();
      const time_str = `${h > 9 ? h : '0' + h}:${m > 9 ? m : '0' + m}:${s > 9 ? s : '0' + s}`;
      if (this.dkArr.length > 1) {
        this.dkArr = [this.dkArr[0]].concat([{ time: time_str, address: location }], [this.dkArr[1]]);
      } else {
        this.dkArr = [{ time: time_str, address: location }].concat(this.dkArr);
      }
    },
    async dk() {
      if (this.dkArr.length > 2) {
        return;
      };
      try {
        const localInfo = await this.getLocation();
        const image = await this.getImage();
        this.$emit(`checkin`, Object.assign({}, localInfo, { image }));
      } catch (e) {
        alert(`打卡失败`);
      }
    },
    // 获取相片
    getImage() {
      return new Promise((resolve, reject) => {
        resolve('');
      });
    },
    // 获取地理位置
    getLocation() {
      const data = {};
      return new Promise((resolve, reject) => {
        window.geolocation.getCurrentPosition((status, result) => {
          console.log(result);
          if (status === `complete`) {
            data.location = result.formattedAddress;
            data.lat = result.position.lat;
            data.lng = result.position.lng;
            data.type = this.dkArr.length - 1;
            resolve(data);
          } else {
            throw new Error(`获取位置失败：${result.message}`);
          }
        });
      });
    },
    showDialog() {
      this.dkshow = true;
    },
    hiddenDialog() {
      this.dkshow = false;
    },
    popShow() {
      this.show = true;
    },
    popHidden() {
      this.show = false;
    },
    onLoad() {
      setTimeout(() => {
        for (let i = 0; i < 3; i++) {
          const year = 2018;
          const month = i + 1;
          const dates = this.getDates({
            year,
            month,
            color1: [3, 6, 1, 8],
            color2: [9, 5, 2],
            des: [{ value: 5, des: `这是周五` }]
          });
          const shape = dates.length > 35 ? 'big' : 'small';
          this.monthes.push({
            year,
            month,
            dates,
            shape
          });
        }
        this.loading = false;

        if (this.monthes.length >= 5) {
          this.finished = true;
        }
      }, 500);
    },
    /**
     * 获取一个月的日子
     * @param  {[type]} option [
     *  一个对象需要有年月如下：
     *  {
     *    year: 2018, 必要
     *    month: 02,  必要
     *    des: [      可选
     *      {
     *        value: 2,
     *        des: '这是2号'
     *      }
     *    ],
     *    color1: [4,5,....,22], 可选
     *    color2: [1,2,.....24]  可选
     *  }
     *
     * ]
     * @return {[array]}       [返回一个可以直接push到this.monthes里的一个月日期表]
     */
    getDates(option) {
      const { year, month, des, color1, color2 } = option;
      const firstDay = new Date(year, month - 1, 1); // month 从0开始 此处需要 减一
      const offsetDay = firstDay.getDay(); // 得到第一天是周几 就知道要移多少天
      const totalDay = getTotalDay(firstDay);

      const dates = []; // 将要生成的dates

      // 处理偏移
      if (offsetDay) {
        for (let i = 0; i < offsetDay; i++) {
          dates.push({ value: '' });
        }
      }

      // 生成dates
      for (let i = 1; i <= totalDay; i++) {
        const date = { value: i, des: ``, color: `0` };

        // 处理描述部分
        if (des && des.length > 0) {
          for (let j = 0; j < des.length; j++) {
            if (des[j].value === i) {
              date.des = des[j].des;
              break;
            }
          }
        } else {
          date.des = null;
        }

        // 处理颜色部分
        if (color1 && color1.length > 0) {
          if (color1.indexOf(i) > 0) {
            date.color = `1`;
            dates.push(date);
            continue;
          }
        }
        if (color2 && color2.length > 0) {
          if (color2.indexOf(i) > 0) {
            date.color = `2`;
            dates.push(date);
            continue;
          }
        }
        dates.push(date);
      }
      console.log(dates);
      return dates;
    }
  }
};
</script>
<style>
.dk-info {
  width: 4.92rem;
  height: 3.73rem;
}
.dk-info .content {
  flex: 1;
  font-size: .4rem;
}
.dk-info .content img {
  width: 1.3rem;
  height: 1.3rem;
  margin-bottom: .2rem;
}
.dk-info .footer {
  height: .69rem;
  background: #f8f8f8;
  border-top: .04rem solid #f1f1f1;
}
.dk-info .footer img {
  width: .42rem;
  height: .42rem;
}

</style>
