const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const modeSelect = document.getElementById('mode');
const playerSymbolSelect = document.getElementById('playerSymbol');
const difficultySelect = document.getElementById('difficulty');
const symbolSelection = document.getElementById('symbolSelection');
const difficultySelection = document.getElementById('difficultySelection');

let board = ['', '', '', '', '', '', '', '', ''];
let playerSymbol = 'X'; // Default symbol for player
let aiSymbol = 'O';
let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'friend'; // Set to 'friend' by default
let difficulty = 'easy'; // Default difficulty level

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Initialize the board
function initializeBoard() {
    boardElement.innerHTML = '';
    board.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.setAttribute('data-index', index);
        cellElement.addEventListener('click', handleMove);
        boardElement.appendChild(cellElement);
    });
    updateStatus();
}

function handleMove(event) {
    const index = event.target.getAttribute('data-index');
    if (board[index] !== '' || !gameActive) return;

    if (gameMode === 'friend') {
        // Two-player mode
        makeMove(index, currentPlayer);
    } else {
        // Player vs AI mode
        makeMove(index, playerSymbol);
        if (!checkWin() && !checkDraw()) {
            setTimeout(aiMove, 500); // AI move with slight delay
        }
    }
}

function makeMove(index, player) {
    board[index] = player;
    const cellElement = document.querySelector(`[data-index='${index}']`);
    cellElement.textContent = player;
    cellElement.classList.add(player); // Add class based on symbol

    if (!checkWin() && !checkDraw()) {
        currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
        updateStatus();
    }
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    playerSymbol = playerSymbolSelect.value;
    aiSymbol = (playerSymbol === 'X') ? 'O' : 'X';
    gameActive = true;
    initializeBoard();
}

function updateStatus() {
    if (gameActive) {
        statusElement.textContent = `It's ${currentPlayer}'s turn`;
    }
}

// Check for win or draw (add this function if missing)
function checkWin() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            statusElement.textContent = `${board[a]} wins!`;
            gameActive = false;
            return true;
        }
    }
    return false;
}

function checkDraw() {
    if (!board.includes('')) {
        statusElement.textContent = "It's a draw!";
        gameActive = false;
        return true;
    }
    return false;
}

// Placeholder for AI move function (implement this based on your difficulty logic)
function aiMove() {
    // Implement AI logic here based on the selected difficulty level
    // For now, we'll just make a random move
    const availableIndices = board.map((cell, index) => (cell === '' ? index : null)).filter(index => index !== null);
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    makeMove(randomIndex, aiSymbol);
}

// Add event listeners for reset and mode changes
resetBtn.addEventListener('click', resetGame);
modeSelect.addEventListener('change', () => {
    gameMode = modeSelect.value;

    // Show or hide options based on game mode
    if (gameMode === 'ai') {
        symbolSelection.classList.remove('hidden');
        difficultySelection.classList.remove('hidden');
    } else {
        symbolSelection.classList.add('hidden');
        difficultySelection.classList.add('hidden');
    }
    resetGame();
});

// Show options if the mode is set to AI by default
function setDefaultGameMode() {
    modeSelect.value = 'friend'; // Set the select option to "friend" at the start
    symbolSelection.classList.add('hidden'); // Hide symbol selection initially
    difficultySelection.classList.add('hidden'); // Hide difficulty selection initially
}

// Initialize the game
setDefaultGameMode();
initializeBoard();
