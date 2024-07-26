import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button 
      className="square"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({isXNext, squares, onMove}) {
  function handleMove(squareIndex) {
    if(calculateWinner(squares) || squares[squareIndex]){ 
      return; 
    }

    const nextSquares = squares.slice();
    nextSquares[squareIndex] = isXNext ? 'X' : 'O';
    onMove(nextSquares);
  }

  const isWinner = calculateWinner(squares);
  let status = isWinner ? 
    isWinner + " Wins!" : 
    "Player: " + (isXNext ? 'X' : 'O');

  return (
    <>
    <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleMove(0)} />
        <Square value={squares[1]} onSquareClick={() => handleMove(1)} />
        <Square value={squares[2]} onSquareClick={() => handleMove(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleMove(3)} />
        <Square value={squares[4]} onSquareClick={() => handleMove(4)} />
        <Square value={squares[5]} onSquareClick={() => handleMove(5)} />
      </div> 
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleMove(6)} />
        <Square value={squares[7]} onSquareClick={() => handleMove(7)} />
        <Square value={squares[8]} onSquareClick={() => handleMove(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const isXNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  
  function handleMove(nextSquares){
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description = move > 0 ?
      'Go to move #' + move :
      'Go to game start';

      return(
        <li key={move}>
          <button 
            onClick={() => jumpTo(move)}
          >
            {description}
          </button>
        </li>
      );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board isXNext={isXNext} squares={currentSquares} onMove={handleMove}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
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
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

/*
  TODO:
  * For the current move only, show “You are at move #…” instead of a button.
  * Rewrite Board to use two loops to make the squares instead of hardcoding them.
  * Add a toggle button that lets you sort the moves in either ascending or descending order.
  * When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw).
  * Display the location for each move in the format (row, col) in the move history list.
*/