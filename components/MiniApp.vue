<template>
  <div class="main">
<!--<div class="layout"></div>-->
    <transition >
      <div key="startpage" class="start-page" v-if="view === 'stat'">
        <h3 class="logo">Cro<span>SS</span>line</h3>
        <perfect-scrollbar>
          <div class="statistics">
          <span class="total"><span>BALANCE: </span><span class="flex"><animated-number :number="gameStore.balance" />CRS</span> </span>
          <span class="stat-info"><span>User name: </span><span>@blbmvdk</span> </span>
          <span class="stat-info"><span>Wins: </span><span>10/20</span> </span>
          <span class="stat-info"><span>Rating </span><span>3876</span> </span>
          <div class="inventory">
            <div class="flex inv-item">
              <Icon name="💣" size="48" /> <span>x <span>{{gameStore.inventory.bombs}}</span></span>
            </div>
            <div class="flex inv-item">
              <Icon name="🕳️" size="48" /> <span>x <span>{{gameStore.inventory.nitro}}</span></span>
            </div>
          </div>
          <button class="btn" @click="gameStore.increaseBalance(100)">Get 100 CRS</button>
        </div>
        </perfect-scrollbar>

        <span v-if="user"> {{user}} </span>
      </div>
      <div class="store" v-else-if="view === 'store'">
        <store />
      </div>
      <div key="gamepage" class="game-page" v-else-if="view === 'game'">
        <tic-tac-toe :game-set="gameSet" @back="back"/>
      </div>
    </transition>
    <div class="bottom-nav">
      <span class="nav-item" @click="back"><Icon name="majesticons:article-line" size="36" /></span>
      <span class="nav-item" @click="view = 'store'"><Icon name="solar:money-bag-bold" color="" size="36" /></span>
      <span class="nav-item" @click="startGame(5,5,4,4)"><Icon name="game-icons:abstract-050" size="32" /></span>

    </div>
  </div>
</template>

<script setup>
import { MainButton, useWebAppPopup } from 'vue-tg'
import {ref, computed, onMounted} from 'vue'
import TicTacToe from "./TicTacToe.vue";
import AnimatedNumber from "./AnimatedNumber.vue";
import Store from "./Store.vue";
import {useGameStore} from "../store/gameStore.js";
import { useStorage } from '@vueuse/core'
const { showAlert } = useWebAppPopup()


const gameStore = useGameStore()

let game = ref(false),
    view = ref('stat'),
    user = ref(null),
    gameSet = ref(null)

function back(){
  view.value = 'stat'
  game.value = false
  gameSet.value = null
  //window.Telegram.WebApp.MainButton.show() //show telegram btn
}
function startGame(rows, cols, tries, nToWin) {
  gameSet.value = rows ? {rows, cols, tries, nToWin} : null
  game.value = true
  view.value = 'game'
  window.Telegram.WebApp.MainButton.hide()
  window.Telegram.WebApp.expand()
}
onMounted(()=>{
  if (window && window.Telegram) {

    window.Telegram.WebApp.setHeaderColor('#0b0031')
    window.Telegram.WebApp.setBackgroundColor('#0b0031')
    user.value = window.Telegram.WebApp.initDataUnsafe.user
    window.Telegram.WebApp.expand()
    //window.Telegram.WebApp.MainButton.onClick(startGame(5,5,4,4)) //set func on main button click
    //window.Telegram.WebApp.MainButton.setParams({'text': 'Play RetroCROSS'}) // set byn params
    //window.Telegram.WebApp.MainButton.textColor = '#121113'
    //window.Telegram.WebApp.MainButton.color = '#ffb537'
    //window.Telegram.WebApp.MainButton.show() //show telegram btn

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
  padding:20px 0 30px;
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  //background-image: linear-gradient(to bottom, #0b0031, #16114a, #291c64, #3d267f, #53319b);
  background-image: linear-gradient(to bottom, #080018, #0d0a31, #261b50, #2d2057, #53319b);
  overflow: auto;
  max-height:calc(100vh - 50px);
  .logo{
    font-size:48px;
    color:#53319b;
    span{
      color:#f5bf65;
    }
  }
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
    flex-grow: 1;
    min-width: 320px;
    width: 90%;
    margin-bottom:30px;
    img{
      max-width:50%;
      margin:50px 0;
    }
    .ps{
      flex-grow: 1;
      width:100%;
    }
    .statistics{
      padding:10px 20px 20px;
      box-sizing: border-box;
      border:1px solid rgba(255,255,255,0.1);
      height:100%;

      border-radius: 10px;
      background: rgba(255,255,255,0.02);

      display:flex;
      flex-direction: column;
      .stat-info{
        display:flex;
        justify-content: space-between;
        width:100%;
        padding-bottom:10px;
        border-bottom:1px solid rgba(255,255,255,0.03);
        font-size:16px;
        margin-bottom:20px;
      }
      .total{
        display:flex;
        justify-content: space-between;
        width:100%;
        font-size:28px;
        text-transform: uppercase;
        color: #ffdb8b;
        padding-bottom:10px;
        border-bottom:1px solid rgba(255,255,255,0.1);
        margin-bottom:20px;
      }
      .inventory{
        display:flex;
        align-items: center;
        justify-content: space-around;
        flex-grow: 1;
        .inv-item{
          display:flex;
          align-items: center;
          font-size:30px;
          span{
            display:flex;
            margin-left:10px;
          }
        }
      }
    }
    h3{
      margin:40px 0;
    }
  }
  .game-page{
    padding:50px 0;
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
  .store{
    min-width: 320px;
    width: 90%;
  }
}
.bottom-nav{
  position: fixed;bottom:0;left:0;
  width:100%;

  display:flex;
  justify-content: space-between;
  border-top:1px solid rgba(255,255,255,0.5);
  .nav-item{
    width:33%;
    display:flex;
    justify-content: center;
    align-items: center;
    height:50px;
    border-right:1px solid rgba(255,255,255,0.5);
    background: linear-gradient(to right bottom, rgba(255,255,255,0.03), rgba(255,255,255,0.13));
    background-image: linear-gradient(to bottom, #2d2057, #53319b);
    &:last-child{
      border:none;
    }
  }
}
</style>
