<script setup>
import { MainButton, useWebAppPopup } from 'vue-tg'
import {ref} from 'vue'
const { showAlert } = useWebAppPopup()

let game = ref(false)
let firstPlayer = ref(true)

let currentState = ref({
  0: null,
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
  7: null,
  8: null,
})

let combinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]]

function cellClick(n) {
  if (currentState.value[n]) return
  console.log(n)
  firstPlayer.value ? currentState.value[n] = 'x' : currentState.value[n] = 'o'
  firstPlayer.value = !firstPlayer.value
}

</script>

<template>
  <div class="main">
    <transition name="slide-up" >
      <div key="startpage" class="start-page" v-if="!game">
        <img src="public/logo-retro.svg">
        <h3>RetroCross</h3>
        <button class="btn" @click="game = true">Play</button>
      </div>
      <div key="gamepage" class="game-page" v-else>
      <div class="retro-cross-field">
        <div :class="{'empty': !currentState[cell]}" class="cell" v-for="cell of 9" @click="cellClick(cell)">
          <span v-if="currentState[cell] === 'x'"><img src="public/cross1.svg"></span>
          <span v-if="currentState[cell] === 'o'"><img src="public/circle.svg"></span>
        </div>
      </div>
    </div>
    </transition>
  </div>
</template>
<style lang="scss">
.slide-up-enter-active,
.slide-up-leave-active {
  transition: .3s
}
.slide-up-leave-to{
  transform: translateY(-30px);
}
.slide-up-enter,
.slide-up-leave-to {
  opacity: 0
}
.main{
  padding:50px;
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .start-page{
    display:flex;
    flex-direction: column;
    align-items: center;
    img{
      max-width:50%;
    }
    h3{
      margin:40px 0;
    }
  }
  .game-page{
    .retro-cross-field{
      display:flex;
      flex-wrap: wrap;
      width:222px;
      height:222px;
      .cell{
        width:70px;
        height:70px;
        border:2px solid #a1a1a1;
        background: #111;
        color:#FFF;
        &.empty{

        }
        span{
          width:100%;
          height:100%;
          display:flex;
          align-items: center;
          justify-content: center;
        }
        img{
          max-width:80%;
          height:auto;
          color: #00ffa6;
        }
      }
    }
  }

}
</style>
