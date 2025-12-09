const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class Board {
  constructor() {
    this.grid = Array(6).fill().map(() => Array(7).fill('_'));
  }

  display() {
    this.grid.forEach(row => console.log(row.join(' ')));
    console.log('1 2 3 4 5 6 7');
  }

  reset() {
    this.grid = Array(6).fill().map(() => Array(7).fill('_'));
  }

  setCoin(col, player) {
    if (col < 0 || col >= 7) {
      console.log("Invalid column. Choose between 0 and 6.");
      return false;
    }

    for (let i = 5; i >= 0; i--) {
      if (this.grid[i][col] === '_') {
        this.grid[i][col] = player;
        return true;
      }
    }
    console.log("Column is full. Choose another column.");
    return false;
  }
}

class Player {
  constructor(playerName, symbol) {
    this.playerName = playerName;
    this.symbol = symbol;
  }
}

class WinGame {
  isWin(grid) {
    return this.row(grid) || this.column(grid) || this.downLeft(grid) || this.downRight(grid);
  }

  row(grid) {
    for (let row of grid) {
      for (let i = 0; i < 4; i++) {
        if (row[i] !== '_' && row[i] === row[i + 1] && row[i] === row[i + 2] && row[i] === row[i + 3]) {
          return true;
        }
      }
    }
    return false;
  }

  column(grid) {
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row < 3; row++) {
        if (grid[row][col] !== '_' && grid[row][col] === grid[row + 1][col] && 
            grid[row][col] === grid[row + 2][col] && grid[row][col] === grid[row + 3][col]) {
          return true;
        }
      }
    }
    return false;
  }

  downLeft(grid) {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (grid[row][col] !== '_' && grid[row][col] === grid[row + 1][col + 1] && 
            grid[row][col] === grid[row + 2][col + 2] && grid[row][col] === grid[row + 3][col + 3]) {
          return true;
        }
      }
    }
    return false;
  }

  downRight(grid) {
    for (let row = 5; row >= 3; row--) {
      for (let col = 0; col < 4; col++) {
        if (grid[row][col] !== '_' && grid[row][col] === grid[row - 1][col + 1] && 
            grid[row][col] === grid[row - 2][col + 2] && grid[row][col] === grid[row - 3][col + 3]) {
          return true;
        }
      }
    }
    return false;
  }

  isDraw(grid) {
    return grid.every(row => !row.includes('_'));
  }
}

class Game {
  constructor(playerOne, playerTwo) {
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
    this.currentPlayer = playerOne;
    this.board = new Board();
    this.winLogic = new WinGame();
    this.loopEnd = true;
  }

  async playGame() {
    this.board.display();
    const col = await this.question(`${this.currentPlayer.playerName} (${this.currentPlayer.symbol}), enter column (1-7): `);
    
    if (this.board.setCoin(parseInt(col) - 1, this.currentPlayer.symbol)) {
      console.log("Successfully added.");
    } else {
      console.log("Invalid input. Please try again.");
      return;
    }

    if (this.winLogic.isWin(this.board.grid)) {
      this.board.display();
      console.log(`${this.currentPlayer.playerName} (${this.currentPlayer.symbol}) wins!`);
      if (await this.replay()) {
        if (await this.playerChange()) {
          console.log("Players updated.");
        }
        this.board.reset();
        await this.start();
      } else {
        this.loopEnd = false;
      }
    } else if (this.winLogic.isDraw(this.board.grid)) {
      this.board.display();
      console.log("It's a draw!");
      if (await this.replay()) {
        this.board.reset();
        await this.start();
      } else {
        this.loopEnd = false;
      }
    } else {
      this.currentPlayer = (this.currentPlayer === this.playerOne) ? this.playerTwo : this.playerOne;
    }
  }

  async replay() {
    const answer = await this.question("Do you want to play again? Enter 1 for Yes: ");
    return answer === "1";
  }

  async playerChange() {
    const answer = await this.question("Do you want to change the players? Enter 1 to change: ");
    if (answer === "1") {
      const name1 = await this.question("Enter the X player Name: ");
      this.playerOne = new Player(name1, 'X');
      
      const name2 = await this.question("Enter the O player Name: ");
      this.playerTwo = new Player(name2, 'O');
      this.currentPlayer = this.playerOne;
      return true;
    }
    return false;
  }

  async start() {
    console.log("Game Start!");
    while (this.loopEnd) {
      await this.playGame();
    }
    rl.close();
  }

  question(query) {
    return new Promise(resolve => rl.question(query, resolve));
  }
}

async function main() {
  const name1 = await new Promise(resolve => rl.question("Enter the X player Name: ", resolve));
  const playerOne = new Player(name1, 'X');

  const name2 = await new Promise(resolve => rl.question("Enter the O player Name: ", resolve));
  const playerTwo = new Player(name2, 'O');

  const game = new Game(playerOne, playerTwo);
  await game.start();
}

main();
