<template>
  <div class="main">
    <div class="layout"></div>
    <transition >
      <div key="startpage" class="start-page" v-if="!game">
        <img src="public/logo-retro.svg">
        <span v-if="user"> {{user.username}} </span>

        <button style="font-size:10px;" class="btn" @click="startGame(4,4,4,4)">4х4 (4 tries - 4 for win)</button>
        <button style="font-size:10px;" class="btn" @click="startGame(5,5,4,4)">5х5 (4 tries - 4 for win)</button>
        <button style="font-size:10px;" class="btn" @click="startGame(5,5,5,4)">5х5 (5 tries - 4 for win)</button>
      </div>
      <div key="gamepage" class="game-page" v-else>
        <tic-tac-toe :game-set="gameSet" @back="back"/>
      </div>

    </transition>
  </div>
</template>

<script setup>
import { MainButton, useWebAppPopup } from 'vue-tg'
import {ref, computed, onMounted} from 'vue'
import TicTacToe from "./TicTacToe.vue";
const { showAlert } = useWebAppPopup()

let game = ref(false),
    user = ref(null),
    gameSet = ref(null)


function back(){
  game.value = false
  gameSet.value = null
  window.Telegram.WebApp.MainButton.show() //show telegram btn
}
function startGame(rows, cols, tries, nToWin) {
  gameSet.value = {rows, cols, tries, nToWin}
  game.value = true
  window.Telegram.WebApp.MainButton.hide()
  window.Telegram.WebApp.expand()
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
  background-image: linear-gradient(to bottom, #0b0031, #16114a, #291c64, #3d267f, #53319b);
  .layout{
    display:none;
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
