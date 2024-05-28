<script setup>
import { MainButton, useWebAppPopup } from 'vue-tg'
const { showAlert } = useWebAppPopup()


</script>

<template>
  <div class="main">
    <img src="public/logo-retro.svg">
    <h3>Hi bitches :)</h3>
    <button class="btn">Жмяк</button>
  </div>
</template>
<style lang="scss">
.main{
  padding:50px;
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img{
    max-width:50%;
  }
  h3{
    margin:40px 0;
  }
}
</style>
