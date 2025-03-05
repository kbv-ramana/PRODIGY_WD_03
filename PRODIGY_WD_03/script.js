class TicTacToe {
    constructor(isAI = false) {
        this.currentPlayer = 'X';
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.isGameActive = true;
        this.isAIMode = isAI;
        
        this.winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        this.cells = document.querySelectorAll('.cell');
        this.statusDisplay = document.getElementById('status-display');
        this.restartButton = document.getElementById('restart-btn');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.cells.forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });
        this.restartButton.addEventListener('click', () => this.restartGame());
    }

    handleCellClick(index) {
        if (!this.isGameActive || this.board[index] !== '') return;

        this.board[index] = this.currentPlayer;
        this.updateCell(index);
        
        if (this.checkWin()) {
            this.endGame(false);
            return;
        }

        if (this.checkDraw()) {
            this.endGame(true);
            return;
        }

        this.switchPlayer();

        if (this.isAIMode && this.currentPlayer === 'O') {
            this.makeAIMove();
        }
    }

    makeAIMove() {
        const bestMove = this.findBestMove();
        this.handleCellClick(bestMove);
    }

    findBestMove() {
        let bestScore = -Infinity;
        let move;

        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i] === '') {
                this.board[i] = 'O';
                let score = this.minimax(this.board, 0, false);
                this.board[i] = '';

                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }

        return move;
    }

    minimax(board, depth, isMaximizing) {
        const result = this.checkGameState(board);
        if (result !== null) {
            return result;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = this.minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = this.minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    checkGameState(board) {
        // Check for winning conditions
        for (let condition of this.winningConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a] === 'O' ? 10 : -10;
            }
        }

        // Check for draw
        if (board.every(cell => cell !== '')) {
            return 0;
        }

        // Game is not over
        return null;
    }

    updateCell(index) {
        this.cells[index].classList.add(this.currentPlayer.toLowerCase());
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.statusDisplay.textContent = `Current Player: ${this.currentPlayer}`;
    }

    checkWin() {
        return this.winningConditions.some(condition => {
            const [a, b, c] = condition;
            return this.board[a] && 
                   this.board[a] === this.board[b] && 
                   this.board[a] === this.board[c];
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    endGame(isDraw) {
        this.isGameActive = false;
        if (isDraw) {
            this.statusDisplay.textContent = 'Game Draw!';
        } else {
            this.statusDisplay.textContent = `Player ${this.currentPlayer} Wins!`;
            this.highlightWinningCells();
        }
    }

    highlightWinningCells() {
        const winningCondition = this.winningConditions.find(condition => {
            const [a, b, c] = condition;
            return this.board[a] && 
                   this.board[a] === this.board[b] && 
                   this.board[a] === this.board[c];
        });

        if (winningCondition) {
            winningCondition.forEach(index => {
                this.cells[index].classList.add('winning-cell');
            });
        }
    }

    restartGame() {
        this.currentPlayer = 'X';
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.isGameActive = true;
        this.statusDisplay.textContent = 'Current Player: X';

        this.cells.forEach(cell => {
            cell.classList.remove('x', 'o', 'winning-cell');
        });
    }
}

// Game Mode Selection
document.addEventListener('DOMContentLoaded', () => {
    const gameModeSelection = document.getElementById('game-mode-selection');
    const gameBoard = document.getElementById('game-board');
    const playerVsPlayerBtn = document.getElementById('player-vs-player');
    const playerVsAIBtn = document.getElementById('player-vs-ai');

    playerVsPlayerBtn.addEventListener('click', () => {
        gameModeSelection.classList.add('hidden');
        gameBoard.classList.remove('hidden');
        new TicTacToe(false);
    });

    playerVsAIBtn.addEventListener('click', () => {
        gameModeSelection.classList.add('hidden');
        gameBoard.classList.remove('hidden');
        new TicTacToe(true);
    });
});