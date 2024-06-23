<template>
  <div class="search" v-if="game.isSearching">
    <div class="searching-icon">
      <Icon name="🔍" size="44" class="gfg"/>
    </div>
    <span class="waiting-status">Game search <span class="loader"></span></span>
  </div>
  <div class="tic-tac-toe" v-else>
    <div class="boom-layout" v-if="boomLayout">
      <img src="public/boom.png">
    </div>
    <div class="tic-tac-toe-info-panel flex">
      <div class="step-status">
<!--  <span class="trick-user">Player 1</span> is planning something<Icon name="👀" size="22" style="margin-left:10px;"/>-->
        <br>
        <span class="" :class="['count-down', { 'out-of-time': outOfTime, 'out-of-time-anim': outOfTimeAnim}]">{{countDown}}<span>s</span></span>
      </div>
    </div>
    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row" :class="{'front': rowIndex === bombPosition[0] && makeBoom}">
      <cell
          v-for="(cell, cellIndex) in row"
          :key="cellIndex"
          :cell="cell"
          :row-index="rowIndex"
          :cell-index="cellIndex"
          :initDone="initDone"
          :tries="tries"
          :current-player="currentPlayer"
          :moves-history="movesHistory"
          :winner="winner"
          :with-bomb="bombPosition[0] === rowIndex && bombPosition[1] === cellIndex"
          :make-boom="makeBoom[0] === rowIndex && makeBoom[1] === cellIndex"
          @make-move="makeMove"
      />
    </div>
    <div class="game-inventory">
      <Icon name="💣" size="48" class="game-bomb" :class="{'active': activeBomb}" @click="bombActivate"/> <span style="margin-left:10px;">x <span class="number">{{gameStore.inventory.bombs}}</span></span>
    </div>
  </div>
</template>

<script setup>

import {onMounted, computed, ref, watch} from 'vue';
import Cell from './Cell.vue'
import { useVibrate, useWebSocket } from '@vueuse/core'
import {useGameStore} from "../store/gameStore.js";
const gameStore = useGameStore()

const { vibrate, stop, isSupported } = useVibrate({ pattern: [300, 100, 300] })
const { data, state, close, send } = useWebSocket('wss://cross.2cubes.ru', {
  autoReconnect: {
    retries: 3,
    delay: 1000,
    onFailed() {
      console.log('Failed to connect')
      emits('back')
    },
  },
})

const props = defineProps(['gameSet'])
const emits = defineEmits(['back'])

// Размер поля и условия победы
const rows = props.gameSet ? props.gameSet.rows : 5;
const cols =  props.gameSet ? props.gameSet.cols : 5;
const tries = props.gameSet ? props.gameSet.tries : 4;  // Максимальное количество одновременно поставленных крестиков или ноликов
const nToWin = props.gameSet ? props.gameSet.nToWin : 4;  // Количество крестиков или ноликов для победы

const board = ref(Array.from({ length: rows }, () => Array(cols).fill('')));
const currentPlayer = ref('X');
const winner = ref(null);

let initDone = ref(false)
let activeBomb = ref(false),
    makeBoom = ref(false),
    countDown = ref(8),
    bombPosition = ref([null, null]),
    enemyBombPosition = ref([null, null]),
    boomLayout = ref(false),
    game = ref({
      isSearching: true,
      id: null,
      user: null
    })

const movesHistory = ref({ X: [], O: [] });  // История ходов для каждого игрока
const winningCells = ref([]);  // Ячейки выигрышной линии

/*const checkWinner = () => {
  // Проверка линии на победу
  const checkLine = (cells) => {
    let count = 1;  // Начинаем с 1, так как первый символ в цепочке всегда одинаковый
    for (let i = 1; i < cells.length; i++) {
      if (cells[i].value === cells[i-1].value && cells[i].value) {
        count++;
        if (count === nToWin) {
          winningCells.value = cells.slice(i - nToWin + 1, i + 1);
          return cells[i].value;
        }
      } else {
        count = 1;
      }
    }
    return null;
  };

  // Проверка горизонтальных линий
  for (let row = 0; row < rows; row++) {
    const line = board.value[row].map((value, col) => ({ value, row, col }));
    const result = checkLine(line);
    if (result) {
      winner.value = result;
      return;
    }
  }

  // Проверка вертикальных линий
  for (let col = 0; col < cols; col++) {
    const line = board.value.map((row, rowIndex) => ({ value: row[col], row: rowIndex, col }));
    const result = checkLine(line);
    if (result) {
      winner.value = result;
      return;
    }
  }

  // Проверка диагоналей
  const diagonals = (row, col, rowStep, colStep) => {
    const line = [];
    for (let k = 0; k < nToWin; k++) {
      const newRow = row + k * rowStep;
      const newCol = col + k * colStep;
      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
        line.push({ value: board.value[newRow][newCol], row: newRow, col: newCol });
      } else {
        break;
      }
    }
    return line;
  };

  // Проверка диагоналей слева направо
  for (let row = 0; row <= rows - nToWin; row++) {
    for (let col = 0; col <= cols - nToWin; col++) {
      const mainDiagonal = diagonals(row, col, 1, 1);
      const result = checkLine(mainDiagonal);
      if (result) {
        winner.value = result;
        return;
      }
    }
  }

  // Проверка диагоналей справа налево
  for (let row = 0; row <= rows - nToWin; row++) {
    for (let col = nToWin - 1; col < cols; col++) {
      const antiDiagonal = diagonals(row, col, 1, -1);
      const result = checkLine(antiDiagonal);
      if (result) {
        winner.value = result;
        return;
      }
    }
  }

  // Проверка на ничью
  if (board.value.flat().every(cell => cell)) {
    winner.value = 'Ничья';
  }
};*/
const outOfTime = computed(()=>{
  return countDown.value < 4
})
const outOfTimeAnim = computed(()=>{
  return countDown.value < 4 && countDown.value !== 0
})
function runCountDown(){
    if (countDown.value > 0) {
      setTimeout(() => {
       countDown.value -= 1
        runCountDown()
      }, 1000)
    }
}

function setBomb(row, col) {
  bombPosition.value = [row, col]
  gameStore.bombUpdate(true, 1)
  let data = {"type": "bomb","gameId": game.value.id, x: row, y: col}
  send(JSON.stringify(data))
  activeBomb.value = false
}
function boom(x,y) {
  makeBoom.value = [x, y]
  setTimeout(()=>{
    bombPosition.value[0] = null
    bombPosition.value[1] = null
    makeBoom.value = false
    boomLayout.value = true
  },2000)
  setTimeout(()=> boomLayout.value = false, 2600)

}

const makeMove = (row, col) => {
  console.log(currentPlayer.value, game.value.user, currentPlayer.value !== game.value.user)
  if (currentPlayer.value !== game.value.user) {
    return
  }
  if (!winner.value) {

    if (activeBomb.value) {
      setBomb(row, col)
      return
    }
    if (bombPosition.value[0] === row && bombPosition.value[1] === col) {
      boom()
      return
    }
    const currentMoves = movesHistory.value[currentPlayer.value];
    if (currentMoves.length === tries) {
      currentMoves.shift();
    }
    //board.value[row][col] = currentPlayer.value;
    currentMoves.push({ row, col });


    let data = {"type": "move","gameId": game.value.id, x: row, y: col}
    send(JSON.stringify(data))
  }
};

function bombActivate() {
  if (gameStore.inventory.bombs > 0)  {
    send(JSON.stringify({type: "trick_planned", "gameId": game.value.id}))
    activeBomb.value = true
  }
}

const resetGame = () => {
  board.value = Array.from({ length: rows }, () => Array(cols).fill(''));
  currentPlayer.value = 'X';
  winner.value = null;
  movesHistory.value = { X: [], O: [] };
  winningCells.value = [];
};

watch(data, (message) => {
  let data = typeof message === 'string' ? JSON.parse(message) : message
  console.log('data', data, data.type, data.type === 'start')
  if (data && data.type === 'boom') {
    boom(data.x, data.y)
    return
  }
  if (data && data.type && data.type === 'start') {
    game.value.isSearching = false
    game.value.id = data.gameId
    game.value.user = data.symbol
    countDown.value = 10
    runCountDown()
    setTimeout(()=>{
      document.querySelectorAll('.cell').forEach(item => item.classList.add('ready'))
      initDone.value = true
    }, 100)
  }
  if (data && data.type && data.type === 'move', data.board) {
    board.value = data.board
    countDown.value = 10

  }
  if (data && data.currentPlayer) {
    currentPlayer.value = data.currentPlayer
  }
  if (data && data.winPlayer) {
    winner.value = data.winPlayer
  }
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function test() {
  let data = {"type": "move","gameId": game.value.id, x: null, y: null}
  send(JSON.stringify(data))
}

onMounted(()=>{
  console.log(window.Telegram.WebApp.initDataUnsafe.user)
  let data = {"type": "join","userId": window.Telegram.WebApp.initDataUnsafe.user ? window.Telegram.WebApp.initDataUnsafe.user.id : getRandomInt(9999999)}
  send(JSON.stringify(data))
})

</script>

<style lang="scss">
.mover {
  offset-rotate: reverse;
  offset-rotate: 0deg;
  offset-path: circle(40px at center);
  position: absolute;
  left: 30%;
  top: 100px;
  offset-path: path('M0,144 C79.529004,144 144,79.529004 144,0 C144,-79.529004 79.529004,-144 0,-144 C-79.529004,-144 -144,-79.529004 -144,0 C-144,79.529004 -79.529004,144 0,144 Z');  animation: move 2s linear infinite;

}
@keyframes l1 {to{clip-path: inset(0 -34% 0 0)}}
@keyframes move {
  to {
    offset-distance: 100%;
  }
}
@keyframes pulse {
  0% {
    transform: scale(1.5);
  }
  40% {
    transform: scale(1);
  }
}
.search{
  display:flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  align-items: center;
  .searching-icon{
    width:100%;
    flex-grow: 1;
    display:flex;
    align-items: center;
    justify-content: center;
  }
  .waiting-status{
    display:flex;
    align-items: flex-end;
    padding:30px;
    font-size:18px;
    text-transform: lowercase;
    letter-spacing: 1px;
    .loader {
      margin-left:5px;
      margin-bottom:3px;
      display:block;
      width: 20px;
      aspect-ratio: 4;
      background: radial-gradient(circle closest-side,#FFF 80%,#0000) 0/calc(100%/3) 100% space;
      clip-path: inset(0px 100% 0px 0px);
      animation: l1 1s steps(4) infinite;
    }

  }
}
.gfg{
  animation: GFG 1s infinite linear;
}
@keyframes GFG {
  0% {
    transform: rotate(0deg)
    translateY(10px) rotate(0deg);
  }

  100% {
    transform: rotate(360deg)
    translateY(10px) rotate(-360deg);
  }
}
.tic-tac-toe {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.row {
  display: flex;
  &.front{
    position: relative;
    z-index: 99999;
  }
}
.boom-layout{
  display:flex;
  position: fixed;
  left:0;
  top:0;
  width:100%;
  height:100%;
  background:#FFF;
  background-image: linear-gradient(to bottom, #080018, #0d0a31, #261b50, #2d2057, #53319b);

  align-items: center;
  justify-content: center;
  z-index: 9999999;
  opacity: 1;
  img{
    width:90%;
    z-index: 99999999;
    position: relative;
  }
}
.cell {
  width: 60px;
  height: 60px;
  border: 1px solid #FFF;
  background: linear-gradient(to right bottom, rgba(255,255,255,0.03), rgba(255,255,255,0.13));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  position: relative;
  z-index: 1;
}
.cell.ready{
  left:0 !important;
  top:0 !important;
  transform: none !important;
  opacity: 1 !important;
}
.winning {
  background-color: #01d705 !important;
}
.btn{
  margin-top:30px;
}
.winner {
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
  span{
    font-size:24px;
    color:#01d705;
  }
}
.tic-tac-toe-info-panel{
  display:flex;
  flex-direction: column;
  width:100%;
  padding:10px;
  box-sizing: border-box;
  font-size:18px;
  .flex{
    width:100%;
    display:flex;
    justify-content: space-between;
  }
  .step-status{
    display:flex;
    width:100%;
    justify-content: center;
  }
  .count-down{
    font-size:24px;
    font-weight: 900;
    color:#f5bf65;
    padding:20px 0;
    &.out-of-time{
      color:red;
    }
    &.out-of-time-anim{
      animation: pulse 1s infinite;
    }
    span{
      display: inline-block;
      margin-left:3px;
      color:#FFF;
      font-size: 18px;
      font-weight: 300;
    }
  }
  .winner{
    width:100%;
    display:flex;
    align-items: center;
    justify-content: center;
  }
}
.game-inventory{
  margin-top:20px;
  display:flex;
  align-items: center;
  .number{
    font-size: 20px;
    margin-left:10px;
  }
  .game-bomb{
    &.active{
      animation: flash infinite;
      animation-duration: 1s;
    }
  }

}
</style>
