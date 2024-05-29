<template>
  <div class="tic-tac-toe">
    <div style="margin-bottom:20px;">Tries: {{tries}} Line to Win: {{nToWin}}</div>
    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
      <div
          v-for="(cell, cellIndex) in row"
          :key="cellIndex"
          :class="['cell', { 'fading': isFading(rowIndex, cellIndex), 'winning': isWinningCell(rowIndex, cellIndex) }]"
          @click="() => makeMove(rowIndex, cellIndex)"
      >
        {{ cell }}
      </div>
    </div>
    <div v-if="winner" class="winner">
      Победитель: {{ winner }}
    </div>
    <button class="btn" @click="resetGame">Сбросить игру</button>
    <button class="btn" @click="emits('back')">В меню</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['gameSet'])
const emits = defineEmits(['back'])
// Размер поля и условия победы
const rows = props.gameSet ? props.gameSet.rows : 5;
const cols =  props.gameSet ? props.gameSet.rows : 5;
const tries = props.gameSet ? props.gameSet.tries : 4;  // Максимальное количество одновременно поставленных крестиков или ноликов
const nToWin = props.gameSet ? props.gameSet.nToWin : 4;  // Количество крестиков или ноликов для победы

const board = ref(Array.from({ length: rows }, () => Array(cols).fill('')));
const currentPlayer = ref('X');
const winner = ref(null);
const movesHistory = ref({ X: [], O: [] });  // История ходов для каждого игрока
const winningCells = ref([]);  // Ячейки выигрышной линии

const checkWinner = () => {
  winningCells.value = [];

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
  return currentMoves.length === tries && currentMoves[0].row === row && currentMoves[0].col === col && !winner.value;
};

const isWinningCell = (row, col) => {
  return winningCells.value.some(cell => cell.row === row && cell.col === col);
};

const resetGame = () => {
  board.value = Array.from({ length: rows }, () => Array(cols).fill(''));
  currentPlayer.value = 'X';
  winner.value = null;
  movesHistory.value = { X: [], O: [] };
  winningCells.value = [];
};
</script>

<style>
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
  border: 1px solid #FFF;
  background: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

.fading {
  animation: flash infinite;
  animation-duration: 1s;
}

.winning {
  background-color: green;
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
