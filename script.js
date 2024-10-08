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
let gameMode = 'ai'; // Default mode (playing with AI)
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
    if (!checkWin() && !checkDraw()) {
        currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
        updateStatus();
    }
}

function aiMove() {
    let symbolToPlay = aiSymbol; // AI plays as the opposite symbol

    if (difficulty === 'easy') {
        easyAiMove();
    } else if (difficulty === 'medium') {
        mediumAiMove();
    } else if (difficulty === 'hard') {
        hardAiMove();
    }
}

function easyAiMove() {
    let availableSpots = getAvailableSpots();
    const randomIndex = availableSpots[Math.floor(Math.random() * availableSpots.length)];
    makeMove(randomIndex, aiSymbol);
}

function mediumAiMove() {
    let blockingMove = findBlockingMove(playerSymbol);
    if (blockingMove !== null) {
        makeMove(blockingMove, aiSymbol);
    } else {
        easyAiMove();
    }
}

function hardAiMove() {
    let bestMove = minimax(board, aiSymbol).index;
    makeMove(bestMove, aiSymbol);
}

function findBlockingMove(player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === player && board[b] === player && board[c] === '') return c;
        if (board[a] === player && board[c] === player && board[b] === '') return b;
        if (board[b] === player && board[c] === player && board[a] === '') return a;
    }
    return null;
}

function getAvailableSpots() {
    return board.map((cell, index) => (cell === '' ? index : null)).filter(val => val !== null);
}

// Minimax Algorithm for Hard AI
function minimax(newBoard, player) {
    let availableSpots = getAvailableSpots();

    if (checkWinner(newBoard, playerSymbol)) return { score: -10 };
    if (checkWinner(newBoard, aiSymbol)) return { score: 10 };
    if (availableSpots.length === 0) return { score: 0 };

    let moves = [];
    for (let i = 0; i < availableSpots.length; i++) {
        let move = {};
        move.index = availableSpots[i];
        newBoard[availableSpots[i]] = player;

        if (player === aiSymbol) {
            let result = minimax(newBoard, playerSymbol);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, aiSymbol);
            move.score = result.score;
        }

        newBoard[availableSpots[i]] = '';
        moves.push(move);
    }

    let bestMove;
    if (player === aiSymbol) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    }
    return bestMove;
}

function checkWinner(board, player) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }
    return false;
}

function checkWin() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] === '' || board[b] === '' || board[c] === '') continue;
        if (board[a] === board[b] && board[b] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusElement.textContent = `${currentPlayer} has won!`;
        gameActive = false;
        return true;
    }
    return false;
}

function checkDraw() {
    if (!board.includes('')) {
        statusElement.textContent = 'Game ended in a draw!';
        gameActive = false;
        return true;
    }
    return false;
}

function updateStatus() {
    if (gameActive) {
        statusElement.textContent = `It's ${currentPlayer}'s turn`;
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
difficultySelect.addEventListener('change', () => {
    difficulty = difficultySelect.value;
    resetGame();
});
playerSymbolSelect.addEventListener('change', () => {
    resetGame();
});

initializeBoard();
function makeMove(index, player) {
    board[index] = player;
    const cellElement = document.querySelector(`[data-index='${index}']`);
    cellElement.textContent = player;
    // Add class based on the player's symbol
    cellElement.classList.add(player);

    if (!checkWin() && !checkDraw()) {
        currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
        updateStatus();
    }
}
