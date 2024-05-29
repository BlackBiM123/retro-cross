<template>
  <div class="tic-tac-toe">
    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
      <div
          v-for="(cell, cellIndex) in row"
          :key="cellIndex"
          :class="['cell', { 'fading': isFading(rowIndex, cellIndex) }]"
          @click="() => makeMove(rowIndex, cellIndex)"
      >
        {{ cell }}
      </div>
    </div>
    <div v-if="winner" class="winner">
      Победитель: {{ winner }}
    </div>
    <button class="btn" @click="resetGame">Сбросить игру</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Размер поля
const rows = 4;
const cols = 4;
const tries = 4;  // Максимальное количество одновременно поставленных крестиков или ноликов

const board = ref(Array.from({ length: rows }, () => Array(cols).fill('')));
const currentPlayer = ref('X');
const winner = ref(null);
const movesHistory = ref({ X: [], O: [] });  // История ходов для каждого игрока

const checkWinner = () => {
  const checkLine = (line) => line.every(cell => cell && cell === line[0]);

  // Проверка горизонтальных линий
  for (let row = 0; row < rows; row++) {
    if (checkLine(board.value[row])) {
      winner.value = board.value[row][0];
      return;
    }
  }

  // Проверка вертикальных линий
  for (let col = 0; col < cols; col++) {
    const column = board.value.map(row => row[col]);
    if (checkLine(column)) {
      winner.value = column[0];
      return;
    }
  }

  // Проверка диагоналей
  const mainDiagonal = board.value.map((row, idx) => row[idx]);
  if (checkLine(mainDiagonal)) {
    winner.value = mainDiagonal[0];
    return;
  }

  const antiDiagonal = board.value.map((row, idx) => row[cols - 1 - idx]);
  if (checkLine(antiDiagonal)) {
    winner.value = antiDiagonal[0];
    return;
  }

  // Проверка на ничью
  if (board.value.flat().every(cell => cell)) {
    winner.value = 'Ничья';
  }
};

const makeMove = (row, col) => {
  if (!board.value[row][col] && !winner.value) {
    const currentMoves = movesHistory.value[currentPlayer.value];
    if (currentMoves.length === tries) {
      const oldestMove = currentMoves.shift();
      board.value[oldestMove.row][oldestMove.col] = '';
    }

    board.value[row][col] = currentPlayer.value;
    currentMoves.push({ row, col });
    checkWinner();
    currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X';
  }
};

const isFading = (row, col) => {
  const currentMoves = movesHistory.value[currentPlayer.value];
  return currentMoves.length === tries && currentMoves[0].row === row && currentMoves[0].col === col;
};

const resetGame = () => {
  board.value = Array.from({ length: rows }, () => Array(cols).fill(''));
  currentPlayer.value = 'X';
  winner.value = null;
  movesHistory.value = { X: [], O: [] };
};
</script>

<style>
@keyframes flash {
  0% {opacity: 1}
  50% {opacity: 0}
  100% {opacity: 1}
}
.tic-tac-toe {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.row {
  display: flex;
}

.cell {
  width: 50px;
  height: 50px;
  border: 2px solid #FFF;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
}

.fading {
  animation: flash infinite;
  animation-duration: 1s;
}
.btn{
  margin-top:30px;
}
.winner {
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
}
</style>
