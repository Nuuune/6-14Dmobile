<template>
  <div>
    <!-- 人物信息开始 -->
    <div class="flex flex-row flex-between header">
      <div class="flex flex-row">
        <div class="img">
          <img src="../../../assets/images/avatar_03.png" />
        </div>
        <div class="flex flex-between align-start des">
          <span class="name">{{userInfo.name}}</span>
          <span class="age">{{year}}/{{month}}/{{day}}</span>
        </div>
      </div>
      <div @click="popShow" class="icon icon-calendar">
      </div>
    </div>
    <!-- 人物信息结束 -->
    <!-- 打卡模块开始 -->
    <div class="dk-wrap flex">
      <div class="dk-view">
        <template v-if="hackReset">
          <van-steps
            :active="dkArr.length - 1"
            direction="vertical"
            active-color="#239aed">
            <van-step v-for="(item,index) in dkArr" :key="index">
              <div v-if="index === dkArr.length - 1">{{item.text}}</div>
              <template v-else>
                <div>{{index === 0 ? `上班打卡时间` : `下班时间打卡`}}<span class="hlight">{{item.time}}</span></div>
                <div><span class="icon-location"></span><span class="hlight">{{item.address}}</span></div>
              </template>
            </van-step>
          </van-steps>
        </template>
      </div>
      <div class="dk-btn" @touchend="dk">
        <div class="circle-bg flex flex-center">
          <div class="text">{{click_btn_text}}</div>
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
                <div @click="showTheDay(month.year, month.month, item.value)" class="flex" v-for="(item, idex2) in month.dates" :key="idex2">
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
import { getTotalDay, dateToHms, tsToYMD } from '@/utils/date';
import { arr_insert } from '@/utils/arr';
import { api_checkin, api_records } from '@/api';

const default_dkArr = [{ text: `打卡记录时间和位置` }];

export default {
  name: 'clock-location',
  props: ['today', 'userInfo'],
  data() {
    return {
      dkArr: [].concat(default_dkArr),
      show: false,
      monthes: [],
      loading: false,
      finished: false,
      dkshow: false,
      currTime: new Date(),
      myDay: ``,
      hackReset: true
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
    this.myDay = new Date(this.today.getTime());
    this.getData(this.myDay.getTime());
    this.getLocation();
  },
  computed: {
    dkTime() {
      return dateToHms(this.currTime);
    },
    click_btn_text() {
      switch (this.dkArr.length) {
        case 1:
          return `上班打卡`;
        case 2:
          return `下班打卡`;
        case 3:
          return `今日结束`;
      }
    },
    year() {
      return this.myDay.getFullYear();
    },
    month() {
      const m = this.myDay.getMonth() + 1;
      return m > 9 ? m : `0${m}`;
    },
    day() {
      const d = this.myDay.getDate();
      return d > 9 ? d : `0${d}`;
    }
  },
  methods: {
    // 重置步进条
    stepReset() {
      this.hackReset = false;
      this.$nextTick(() => {
        this.hackReset = true;
      });
    },
    // 显示指定日子的打卡
    showTheDay(y, m, d) {
      const ts = new Date(y, m - 1, d).getTime();
      this.myDay = new Date(ts);
      this.getData(ts);
      this.popHidden();
    },
    // 获取指定时间记录
    getData(ts, noTrans) {
      let _ts;
      if (noTrans) _ts = ts;
      else _ts = tsToYMD(ts);
      api_records({
        params: {
          queryDate: _ts
        },
        success: (data) => {
          this.dkArr = [].concat(default_dkArr);
          this.stepReset();

          const myData = data.data;
          let type0 = null;
          let type1 = null;
          for (let i = 0; i < myData.length; i++) {
            const { checkinAt, location, type } = myData[i];
            if (!type0 && type === 0) {
              type0 = { checkinAt, location, type };
              continue;
            }
            if (!type1 && type === 1) {
              type1 = { checkinAt, location, type };
              continue;
            }
            if (type0 && type1) break;
          }
          type0 && this.step(type0.checkinAt, type0.location, type0.type);
          type0 && type1 && this.step(type1.checkinAt, type1.location, type1.type);
          console.log(data);
        },
        fail: (errmsg) => {
          console.error(errmsg);
        }
      });
    },
    checkin(dk_params) {
      api_checkin({
        params: dk_params,
        success: () => {
          // 获取当天记录
          api_records({
            params: {
              queryDate: tsToYMD(Date.now())
            },
            success: (data) => {
              const { checkinAt, location, type } = data.data[0];
              this.step(checkinAt, location, type);
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
    },
    step(ts, location, type) {
      const td = new Date(ts);
      const time_str = dateToHms(td);
      arr_insert(this.dkArr, { time: time_str, address: location }, type);
      this.stepReset();
      if (this.dkArr.length > 2) {
        this.dkArr[2] = { text: '今日已完成签到' };
      }
    },
    async dk() {
      if (!window.geolocation) {
        return this.$toast({
          message: `无高德组件`,
          forbidClick: true,
          duration: 1500
        });
      }
      if (this.dkArr.length > 2) {
        return;
      };
      try {
        const localInfo = await this.getLocation();
        const image = await this.getImage();
        // localInfo && image && this.checkin(Object.assign({}, localInfo, { image }));
        localInfo && this.checkin(Object.assign({}, localInfo, { image }));
      } catch (e) {
        this.$toast({
          message: `打卡失败`,
          forbidClick: true,
          duration: 1500
        });
      }
    },
    // 获取相片
    getImage() {
      return new Promise((resolve, reject) => {
        try {
          // window.LandaJS.requestCamera((image) => {
          resolve('');
          // });
        } catch (err) {
          this.$toast(err);
          resolve(false);
        }
      });
    },
    // 获取设备地理位置
    getNativeXY() {
      return new Promise((resolve, reject) => {
        try {
          window.LandaJS.requestGeo((loc) => {
            resolve([loc.coords.longitude, loc.coords.latitude]);
          });
        } catch (err) {
          this.$toast(err);
          resolve(false);
        }
      });
    },
    // 获取地理位置
    async getLocation() {
      const lnglatXY = await this.getNativeXY(); // 已知点坐标
      if (!lnglatXY) {
        return false;
      };
      const data = {};
      const transLnglatXY = await this.getGDlnglat(lnglatXY);
      return new Promise((resolve, reject) => {
        window.geolocation.getAddress(transLnglatXY, (status, result) => {
          if (status === `complete`) {
            data.location = result.regeocode.formattedAddress;
            data.lat = transLnglatXY[1];
            data.lng = transLnglatXY[0];
            data.type = this.dkArr.length - 1;
            resolve(data);
          } else {
            resolve(false);
            throw new Error(`获取位置失败：${result.message}`);
          };
        });
      });
    },
    // 转换高德经纬度
    getGDlnglat(lnglat) {
      return new Promise((resolve, reject) => {
        window.AMap.convertFrom(lnglat, `gps`, (status, result) => {
          if (status === `complete`) {
            resolve([result.locations[0].lng, result.locations[0].lat]);
          } else {
            throw new Error(`转换失败：${result.info}`);
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
        console.log(this);
        for (let i = 0; i < 3; i++) {
          let _month = this.today.getMonth() + 1 - i;
          let _year = this.today.getFullYear();
          let dates;
          if (_month < 1) {
            _month += 12;
            _year -= 1;
          }
          if (this.today.getMonth() + 1 === _month && this.today.getFullYear() === _year) {
            console.log(typeof this.today.getDate());
            dates = this.getDates({
              year: _year,
              month: _month,
              color1: [24],
              des: [{ value: this.today.getDate(), des: `今天` }]
            });
          } else {
            dates = this.getDates({
              year: _year,
              month: _month
            });
          }
          const shape = dates.length > 35 ? 'big' : 'small';
          this.monthes.push({
            year: _year,
            month: _month,
            dates,
            shape
          });
        }
        this.loading = false;

        if (this.monthes.length >= 3) {
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
          if (color1.indexOf(i) > -1) {
            date.color = `1`;
            dates.push(date);
            continue;
          }
        }
        if (color2 && color2.length > 0) {
          if (color2.indexOf(i) > -1) {
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
