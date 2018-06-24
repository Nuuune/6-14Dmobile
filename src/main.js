import Vue from 'vue';
import App from './App.vue';

import './assets/css/layout.css';
import './assets/css/font.css';
import { Step, Steps, Toast } from 'vant';
import { set_api_context } from '@/api';

Vue.use(Step).use(Steps).use(Toast);
set_api_context(Vue.prototype);

new Vue({
  el: '#app',
  render: h => h(App)
});
