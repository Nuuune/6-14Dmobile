import Vue from 'vue';
import App from './App.vue';

import './assets/css/layout.css';
import { Step, Steps } from 'vant';

Vue.use(Step).use(Steps);

new Vue({
  el: '#app',
  render: h => h(App)
});
