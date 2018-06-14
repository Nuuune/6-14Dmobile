<template>
  <div id="app">
    <Clock />
  </div>
</template>

<script>
import Clock from './pages/clock/Clock.vue';

export default {
  components: {
    Clock
  }
};
</script>

<style>
body {
  background-color: #f8f8f8;
}
#app {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  background: #fff;
}
</style>
