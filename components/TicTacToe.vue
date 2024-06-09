<template>
  <div class="search" v-if="game.isSearching">
    <div class="searching-icon">
      <Icon name="🔍" size="88" class=""/>
    </div>
    <span>Game search</span>
  </div>
  <div class="tic-tac-toe" v-else>
    <div class="boom-layout" v-if="boomLayout">
      <img src="public/boom.png">
    </div>
    <div class="tic-tac-toe-info-panel flex">
      <div class="step-status">
<!--        <span class="trick-user">Player 1</span> is planning something<Icon name="👀" size="22" style="margin-left:10px;"/>-->
      {{winner + ''}}
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
          :make-boom="makeBoom"
          @make-move="makeMove"
      />
    </div>
    <div class="game-inventory">
      <Icon name="💣" size="48" class="game-bomb" :class="{'active': activeBomb}" @click="bombActivate"/> <span style="margin-left:10px;">x <span class="number">{{gameStore.inventory.bombs}}</span></span>
    </div>
  </div>
</template>

<script setup>

import {onMounted, ref, watch} from 'vue';
import Cell from './Cell.vue'
import { useVibrate, useWebSocket } from '@vueuse/core'
import {useGameStore} from "../store/gameStore.js";
const gameStore = useGameStore()

const { vibrate, stop, isSupported } = useVibrate({ pattern: [300, 100, 300] })
const { data, state, close, send } = useWebSocket('WS://62.109.29.111:3010', {
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
    bombPosition = ref([null, null]),
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

function setBomb(row, col) {
  bombPosition.value = [row, col]
  gameStore.bombUpdate(true, 1)
  let data = {"type": "bomb","gameId": game.value.id, x: row, y: col}
  send(JSON.stringify(data))
  activeBomb.value = false
}
function boom() {
  makeBoom.value = true
  setTimeout(()=>{
    bombPosition.value[0] = null
    bombPosition.value[1] = null
    currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X';
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
  if (!board.value[row][col] && !winner.value) {

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
  if (gameStore.inventory.bombs > 0)  activeBomb.value = true
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
  if (data && data.type && data.type === 'start') {
    game.value.isSearching = false
    game.value.id = data.gameId
    game.value.user = data.symbol
    setTimeout(()=>{
      document.querySelectorAll('.cell').forEach(item => item.classList.add('ready'))
      initDone.value = true
    }, 100)
  }
  if (data && data.type && data.type === 'move', data.board) {
    board.value = data.board
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
}


.mover {
  offset-path: path('M0,144 C79.529004,144 144,79.529004 144,0 C144,-79.529004 79.529004,-144 0,-144 C-79.529004,-144 -144,-79.529004 -144,0 C-144,79.529004 -79.529004,144 0,144 Z');  animation: move 2s linear infinite;
}
@keyframes move {
  to {
    offset-distance: 100%;
  }
}


.mover {
  position: absolute;
  left: 30%;
  top: 100px;
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
