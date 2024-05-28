<script setup>
import { MainButton, useWebAppPopup } from 'vue-tg'

const { showAlert } = useWebAppPopup()
</script>

<template>
  sad
  <MainButton text="Open alert" @click="() => showAlert('Hello!')" />
</template>
