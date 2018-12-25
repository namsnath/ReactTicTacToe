import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, color, status) {
    var col;

    col = color ? 'square-win' : 'square';
    col = status === 'Draw' ? 'square-draw' : col;
    
    return (
      <Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)} 
        key = {i}
        className = {col}
      />
    );
  }

  createBoard(win) {
    let table = [];

    for(let i = 0; i < 3; i++) {
      let children = [];

      for(let j = 0; j < 3; j++) {
        var color = win[1].indexOf(3 * i + j) > -1;
        children.push(this.renderSquare(3 * i + j, color, win[0]));
      }
      table.push(<div className="board-row" key={i}>{children}</div>);
    }

    return table;
  }

  render() {
    return (
      <div>
        {this.createBoard(this.props.win)}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        loc: [null, null],
        win: [null, Array(3).fill(null)],
      }],
      xIsNext: true,
      stepNumber: 0,
      reversed: false,
    };
  }

  resetGame() {
    this.setState({
      history: [{
        squares: Array(9).fill(null),
        loc: [null, null],
        win: [null, Array(3).fill(null)],
      }],
      xIsNext: true,
      stepNumber: 0,
      reversed: true,
    });
  }

  handleSortToggle() {
    this.setState({
      reversed: !this.state.reversed
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares)[0] || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        loc: [parseInt(i / 3), i % 3],
        win: calculateWinner(squares),
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    var history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const reversed = this.state.reversed;

    const moves = history.map((step, move) => {
      let x = (move % 2) === 0;
      let turn = x ? 'X' : 'O';
      let bold;

      if(this.state.stepNumber === move)
        bold = true;
      else
        bold = false;

      var loc = this.state.history[move].loc;

      const desc = move ?
        'Go to move #' + move + ' for ' + turn + ' at (' + loc[0] + ',' + loc[1] + ')':
        'Go to game start';

      return (
        <li key={move}>
          <button className={bold ? 'bold' : ''} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if(this.state.reversed) {
      moves.reverse();
    }


    let status;
    if(winner[0] === 'Draw')
      status = 'Draw';
    else if(winner[0]) {
      status = 'Winner: ' + winner[0];
    }
    else
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
            win = {current.win}
          />
        </div>
        <div className="game-info">
          <button onClick={() => this.resetGame()}>Reset Game</button>
          <br/><br/>
          <div>{ status }</div>
          <br/><br/>
          <button onClick={() => this.handleSortToggle()}>
            {reversed ? 'Descending' : 'Ascending'}
          </button>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  var count = 0;
  for(let i = 0; i < squares.length; i++)
    if(squares[i])
      count++;

  if(count === 9)
    return ['Draw', Array(3).fill(null)];  

  return [null, Array(3).fill(null)];
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
