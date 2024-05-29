<script setup>
import { MainButton, useWebAppPopup } from 'vue-tg'
import {ref, computed, onMounted} from 'vue'
import TicTacToe from "./TicTacToe.vue";
const { showAlert } = useWebAppPopup()

let game = ref(false),
    user = ref(null)
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

let combinations = ref([[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]])

let isWin = computed(()=>{
  let result = false
  combinations.value.forEach(combination => {
    if (currentState.value[combination[0]] &&
        currentState.value[combination[0]] === currentState.value[combination[1]] &&
        currentState.value[combination[1]] === currentState.value[combination[2]]) result = currentState.value[combination[0]]
  })
  return result
})

function back(){
  game.value = false
  window.Telegram.WebApp.MainButton.show() //show telegram btn
}
function startGame() {
  game.value = true
  window.Telegram.WebApp.MainButton.hide()
  window.Telegram.WebApp.expand()
}
function reset() {
  currentState.value = {
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
  }
}


function cellClick(n) {
  if (currentState.value[n]) return
  console.log(n)
  firstPlayer.value ? currentState.value[n] = 'x' : currentState.value[n] = 'o'
  firstPlayer.value = !firstPlayer.value
}

onMounted(()=>{
  if (window && window.Telegram) {
    window.Telegram.WebApp.setHeaderColor('#121113')
    window.Telegram.WebApp.setBackgroundColor('#121113')
    user.value = window.Telegram.WebApp.initDataUnsafe.user
    window.Telegram.WebApp.expand()
    window.Telegram.WebApp.MainButton.onClick(startGame) //set func on main button click
    window.Telegram.WebApp.MainButton.setParams({'text': 'Play RetroCROSS'}) // set byn params
    window.Telegram.WebApp.MainButton.textColor = '#121113'
    window.Telegram.WebApp.MainButton.color = '#ffb537'
    window.Telegram.WebApp.MainButton.show() //show telegram btn

  }

})
</script>

<template>
  <div class="main">
    <div class="layout"></div>
    <transition >
      <div key="startpage" class="start-page" v-if="!game">
        <img src="public/logo-retro.svg">
        <h3 @click="startGame">RetroCross</h3>
        <div class="user-info" v-if="user">
          {{user.username}} - ID:{{ user.id }}
        </div>
      </div>
      <div key="gamepage" class="game-page" v-else>
        <h3 v-if="!isWin">Who win?</h3>
        <h3 v-else>Player {{ isWin }} win!</h3>
        <tic-tac-toe />

    </div>

    </transition>
  </div>
</template>
<style lang="scss">
.v-enter-active{
  transition: opacity 0.5s ease;
}
.v-leave-active{
  opacity: 0;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.main{
  padding:50px;
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .layout{
    position: fixed;
    left:0;
    top:0;
    width:100%;
    height:100%;
    opacity: 0.05;
    background: url('public/patternx.png');
    background-size: 100px;
    pointer-events: none;
  }
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
      position: relative;
      z-index: 1;
      .cell{
        width:70px;
        height:70px;
        border:2px solid #a1a1a1;
        background: #111;
        color:#FFF;
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
    .controls{
      margin-top:20px;
      display:flex;
      justify-content: space-between;
      span{
        text-decoration: underline;
      }
    }
  }

}
</style>
