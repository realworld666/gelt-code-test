<!--
  Vue Component Structure for React Developers:
  - <script setup> is like a functional component with hooks
  - <template> is like the JSX return statement
  - <style scoped> is like CSS modules - styles only apply to this component
-->
<script setup lang="ts">
import MashGame from './components/MashGame.vue'
</script>

<template>
  <div id="app">
    <MashGame />
  </div>
</template>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
</style>
