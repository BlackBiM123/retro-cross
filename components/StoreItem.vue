<template>
  <div class="store-item flex">
    <div class="item"><Icon :name="props.item.icon" size="48" /> <span></span></div>
    <span class="price" :class="{'no-funds': noFunds, 'only': props.item.type !== 'consumables'}">{{props.item.price * number}} CRS</span>
    <div class="quantity" v-if="props.item.type === 'consumables'">
      <span class="quantity-control plus" @click="minus">-</span>
      <span class="number">{{number}}</span>
      <span class="quantity-control plus" @click="plus">+</span></div>
    <button class="btn" :disabled="noFunds" @click="buy">Buy</button>
  </div>
</template>

<script setup>

import {useGameStore} from "../store/gameStore.js";

const props = defineProps(['item'])
const gameStore = useGameStore()
let number = ref(1)
const noFunds = computed(()=>{
  return (props.item.price * number.value) > gameStore.balance
})
function minus() {
  if (number.value > 1) number.value -= 1
}
function plus() {
  number.value += 1
}
function buy() {
  if (noFunds.value) return
  gameStore.decreaseBalance(props.item.price * number.value)
  if (props.item.name === 'bomb') gameStore.bombUpdate(false, number.value)
  if (props.item.name === 'nitro') gameStore.nitroUpdate(false, number.value)
  if (props.item.type === 'skins') gameStore.addXSkinUpdate(props.item.icon)
  console.log(gameStore.balance)
}
</script>

<style scoped lang="scss">
  .store-item{
    display:flex;
    align-items: center;
    width:100%;
    justify-content: space-between;
    margin-bottom:20px;
    .quantity{
      display:flex;
      .quantity-control{
        width:40px;
        height:40px;
        background: rgba(255,255,255,0.1);
        border-radius: 10px;
        display:flex;
        justify-content: center;
        align-items: center;
      }
      .number{
        height:40px;
        display:flex;
        justify-content: center;
        align-items: center;
        margin:0 15px;
        font-weight: bold;
        font-size: 18px;

      }
    }
    .price{
      font-size:20px;
      &.no-funds{
        color:red;
      }
      &.only{
        flex-grow:1;
        display:flex;
        justify-content:center;
        padding:0 20px;
      }
    }
    .btn{
      min-width: 0;
      max-width:70px;
      margin:0;
      &[disabled]{
        opacity:0.2
      }
    }
  }
</style>
