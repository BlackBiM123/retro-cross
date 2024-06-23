<template>
  <div style="margin-right:5px;">{{ displayNumber }}</div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  number: {
    type: Number,
    default: 0,
  },
  timeout: {
    type: Number,
    default: 20,
  },
});

const displayNumber = ref(0);
let interval = null;

onMounted(() => {
  displayNumber.value = props.number;
});

watch(
    () => props.number,
    (newNumber) => {
      clearInterval(interval);

      if (newNumber === displayNumber.value) {
        return;
      }

      interval = setInterval(() => {
        if (displayNumber.value !== newNumber) {
          let change = (newNumber - displayNumber.value) / 10;
          change = change >= 0 ? Math.ceil(change) : Math.floor(change);
          displayNumber.value += change;
        }
      }, props.timeout);
    }
);

onBeforeUnmount(() => {
  clearInterval(interval);
});
</script>

