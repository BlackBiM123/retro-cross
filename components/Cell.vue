<template>
  <div
      :style="generatePosition()"
      :class="[
          'cell',
           {
             'fading': isFading(props.rowIndex, props.cellIndex),
             'cell-x': props.cell === 'X',
             'cell-o': props.cell === 'O',
             'winning': isWinningCell(props.rowIndex, props.cellIndex),
             'boom': boomAnimate
           }
      ]"
      @click="makeMove"

  >
    <div class="game-bomb" v-if="props.withBomb">
      <Icon name="💣" size="48" class="game-bomb-icon" />
    </div>

    <Icon class="square origin-center" v-else-if="props.cell === 'X'" :name="iconX" size="38" />
    <Icon class="square origin-center" v-else-if="props.cell === 'O'" name="cryptocurrency-color:eth" size="38" />
  </div>
</template>

<script setup>
import {useGameStore} from "../store/gameStore.js";

const props = defineProps(['cell', 'rowIndex', 'cellIndex', 'initDone', 'winningCells', 'tries', 'currentPlayer', 'movesHistory', 'winner', 'newIcon', 'withBomb', 'makeBoom'])
const emits = defineEmits(['makeMove'])
const gameStore = useGameStore()
const isFading = (row, col) => {
  const currentMoves = props.movesHistory[props.currentPlayer];
  return currentMoves.length === props.tries && currentMoves[0].row === row && currentMoves[0].col === col && !props.winner;
};

const iconX = computed(()=>{
  //if (props.newIcon) return props.newIcon
  //return 'cryptocurrency-color:btc'
  console.log(gameStore.inventory.xSkins[0])
  return gameStore.inventory.xSkins[0]
})

const boomAnimate = computed(()=>{
  return props.withBomb && props.makeBoom
})

function makeMove() {
  emits('makeMove', props.rowIndex, props.cellIndex)
}

function generatePosition() {
  let min = -200, max = 200
  let left = !props.initDone ? Math.floor(Math.random() * (max - min + 1)) + min : 0
  let top = !props.initDone ? Math.floor(Math.random() * (50 - -50 + 1)) + -50 : 0
  let index = !props.initDone ? Math.floor(Math.random() * (30 - 1 + 1)) + 1 : 1
  let scale = !props.initDone ? Math.random() * (2 - 0.1) + 0.1 : 1
  let opacity = !props.initDone ? Math.random() * (0.2 - 0.01) + 0.01 : 1
  let td = Math.random() * (1 - 0.1) + 0.1
  return [`left: ${left}px`, `top: ${top}px`, `z-index: ${index}`, `transform: scale(${scale})`, `opacity: ${opacity}`, `transition-duration: ${td}s`]
}

const isWinningCell = (row, col) => {
  return props.winningCells.some(cell => cell.row === row && cell.col === col);
};

</script>

<style scoped lang="scss">
.fading {
  svg{
    animation: flash infinite;
    animation-duration: 1s;
  }

}
.cell.boom{
  position: relative;
  z-index: 99999;
  .game-bomb{
    opacity: 1;
    animation: shaking 0.15s linear infinite
  }
  .game-bomb-icon{
    animation: zoom 3s linear;
  }
}


.game-bomb {
  opacity: 0.2;
}
.cell{
  &.cell-x{
    //background: #2c156b;
    background: #ffbb4b;
  }
  &.cell-o{
    background: #392bbb;
  }
}


.square {
  position: relative;
  color: #fff;
  font-size: 1.5em;
  text-align: center;
  //animation: 1s cubic-bezier(.29,.64,.7,.26) rotate;
}

.origin {
  &-center {
    transform-origin: center;
  }
}

@keyframes rotate {
  from {
    transform: rotateY(0deg);
  }

  to {
    transform: rotateY(360deg);
  }
}


</style>
