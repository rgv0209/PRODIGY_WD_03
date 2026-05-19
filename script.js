let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = true;
let isAiMode = false;

const cells = document.querySelectorAll('.cell');
const statusMsg = document.getElementById('statusMsg');
const pvpBtn = document.getElementById('pvpBtn');
const aiBtn = document.getElementById('aiBtn');

const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Switch Game Modes
pvpBtn.addEventListener('click', () => changeMode(false));
aiBtn.addEventListener('click', () => changeMode(true));

function changeMode(aiActive) {
  isAiMode = aiActive;
  pvpBtn.classList.toggle('active', !aiActive);
  aiBtn.classList.toggle('active', aiActive);
  resetGame();
}

// Handle User Move Selection Clicks
cells.forEach(cell => {
  cell.addEventListener('click', (e) => {
    const clickedCell = e.target;
    const index = parseInt(clickedCell.getAttribute('data-index'));

    if (boardState[index] !== "" || !isGameActive) return;

    makeMove(clickedCell, index, "X");
    checkResult();

    if (isGameActive && isAiMode && currentPlayer === "O") {
      setTimeout(aiMove, 400); // Small delay to make the AI look like it's thinking
    }
  });
});

function makeMove(cell, index, player) {
  boardState[index] = player;
  cell.classList.add(player.toLowerCase());
  
  currentPlayer = player === "X" ? "O" : "X";
  statusMsg.textContent = `Player ${currentPlayer}'s Turn`;
}

// AI logic execution
function aiMove() {
  let emptyIndices = [];
  boardState.forEach((val, idx) => { if (val === "") emptyIndices.push(idx); });

  if (emptyIndices.length === 0 || !isGameActive) return;

  // Simple automated random square picker algorithm
  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  const targetCell = document.querySelector(`[data-index="${randomIndex}"]`);
  
  makeMove(targetCell, randomIndex, "O");
  checkResult();
}

// Validate Win & Draw States
function checkResult() {
  let roundWon = false;

  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    // The previous player won the game
    const winner = currentPlayer === "X" ? "O" : "X";
    statusMsg.textContent = `Player ${winner} Wins! 🎉`;
    isGameActive = false;
    return;
  }

  if (!boardState.includes("")) {
    statusMsg.textContent = "It's a Draw! 🤝";
    isGameActive = false;
    return;
  }
}

function resetGame() {
  boardState = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  isGameActive = true;
  statusMsg.textContent = "Player X's Turn";
  cells.forEach(cell => {
    cell.className = "cell"; // Clears added .x or .o styling structural classes
  });
}

document.getElementById('restartBtn').addEventListener('click', resetGame);
