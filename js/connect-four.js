class ConnectFour {
    constructor() {
        this.board = Array(6).fill().map(() => Array(7).fill(0));
        this.currentPlayer = 1;
        this.gameOver = false;
        this.scores = { player1: 0, player2: 0 };
        this.playerNames = { player1: 'Player 1', player2: 'Player 2' };
        this.init();
    }

    init() {
        this.createBoard();
        document.getElementById('resetBtn').addEventListener('click', () => this.resetGame());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('startGameBtn').addEventListener('click', () => this.startGame());
        this.showNameModal();
    }

    showNameModal() {
        document.getElementById('nameModal').classList.add('show');
        document.getElementById('player1Name').focus();
    }

    startGame() {
        const p1Name = document.getElementById('player1Name').value.trim() || 'Player 1';
        const p2Name = document.getElementById('player2Name').value.trim() || 'Player 2';
        this.playerNames = { player1: p1Name, player2: p2Name };
        document.getElementById('player1NameDisplay').textContent = p1Name;
        document.getElementById('player2NameDisplay').textContent = p2Name;
        document.getElementById('nameModal').classList.remove('show');
        this.updateTurnIndicator();
    }

    createBoard() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => this.handleClick(col));
                boardElement.appendChild(cell);
            }
        }
    }

    handleClick(col) {
        if (this.gameOver) return;

        const row = this.getAvailableRow(col);
        if (row === -1) return;

        this.board[row][col] = this.currentPlayer;
        this.updateCell(row, col);

        if (this.checkWin(row, col)) {
            this.endGame(`Player ${this.currentPlayer} Wins!`);
            this.scores[`player${this.currentPlayer}`]++;
            this.updateScore();
        } else if (this.checkDraw()) {
            this.endGame("It's a Draw!");
        } else {
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
            this.updatePlayerTurn();
        }
    }

    getAvailableRow(col) {
        for (let row = 5; row >= 0; row--) {
            if (this.board[row][col] === 0) return row;
        }
        return -1;
    }

    updateCell(row, col) {
        const cells = document.querySelectorAll('.cell');
        const index = row * 7 + col;
        cells[index].classList.add(`player${this.currentPlayer}`);
    }

    checkWin(row, col) {
        return this.checkDirection(row, col, 0, 1) ||
               this.checkDirection(row, col, 1, 0) ||
               this.checkDirection(row, col, 1, 1) ||
               this.checkDirection(row, col, 1, -1);
    }

    checkDirection(row, col, dRow, dCol) {
        let count = 1;
        count += this.countInDirection(row, col, dRow, dCol);
        count += this.countInDirection(row, col, -dRow, -dCol);
        return count >= 4;
    }

    countInDirection(row, col, dRow, dCol) {
        let count = 0;
        let r = row + dRow;
        let c = col + dCol;
        
        while (r >= 0 && r < 6 && c >= 0 && c < 7 && this.board[r][c] === this.currentPlayer) {
            count++;
            r += dRow;
            c += dCol;
        }
        return count;
    }

    checkDraw() {
        return this.board[0].every(cell => cell !== 0);
    }

    updatePlayerTurn() {
        this.updateTurnIndicator();
        document.querySelectorAll('.player').forEach(p => p.classList.remove('active'));
        document.querySelector(`.player${this.currentPlayer}-info`).classList.add('active');
    }

    updateTurnIndicator() {
        const icon = this.currentPlayer === 1 ? '🔴' : '🟡';
        const name = this.playerNames[`player${this.currentPlayer}`];
        document.querySelector('.turn-icon').textContent = icon;
        document.querySelector('.turn-text').textContent = `${name}'s Turn`;
    }

    updateScore() {
        document.getElementById('player1Score').textContent = this.scores.player1;
        document.getElementById('player2Score').textContent = this.scores.player2;
    }

    endGame(message) {
        this.gameOver = true;
        const isDraw = message.includes('Draw');
        const icon = isDraw ? '🤝' : '🏆';
        const winnerName = this.playerNames[`player${this.currentPlayer}`];
        const displayMessage = isDraw ? "It's a Draw!" : `${winnerName} Wins!`;
        const subtitle = isDraw ? 'Well played both!' : 'Victory is yours!';
        
        document.getElementById('winnerIcon').textContent = icon;
        document.getElementById('modalMessage').textContent = displayMessage;
        document.getElementById('winSubtitle').textContent = subtitle;
        document.getElementById('modal').classList.add('show');
    }

    closeModal() {
        document.getElementById('modal').classList.remove('show');
        this.resetGame();
    }

    resetGame() {
        this.board = Array(6).fill().map(() => Array(7).fill(0));
        this.currentPlayer = 1;
        this.gameOver = false;
        this.createBoard();
        this.updatePlayerTurn();
    }
}

new ConnectFour();
