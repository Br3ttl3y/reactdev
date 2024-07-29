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
  const isWinner = calculateWinner(squares);
  let status = isWinner ? 
    isWinner + " Wins!" : 
    "Player: " + (isXNext ? 'X' : 'O');
  
  function handleMove(squareIndex) {
    if(calculateWinner(squares) || squares[squareIndex]){ 
      return; 
    }

    const nextSquares = squares.slice();
    nextSquares[squareIndex] = isXNext ? 'X' : 'O';
    onMove(nextSquares);
  }

  function ThreeByThreeBoard(){
    const rows = [];
    for(let row = 0; row < 3; row++){
      rows.push(
        <div key={row} className="board-row">
          {buildRow(row)}
        </div>
      );
    }
    
    return rows;
  }

  function buildRow(row){
    const cols = [];
    for(let col = 0; col < 3; col++){
      const index = row * 3 + col;
      cols.push(<Square key={index} value={squares[index]} onSquareClick={() => handleMove(index)} />)
    }
    return cols;
  }

  return (
    <>
      <div className="status">{status}</div>
      <ThreeByThreeBoard />
    </>
  );
}

function History({history, onJumpTo}){
  const [isSortAscending, setIsSortAscending] = useState(true);

  const moves = history.map((_, move) =>{
    const description = move > 0 ? 
      'Go to move #' + move : 
        'Go to game start';  

    return (
      <div key={move}>
        <button onClick={() => onJumpTo(move)}>
          {description}
        </button>
      </div>
    );
  });

  function toggleSortOrder(){
    setIsSortAscending(!isSortAscending);
  }

  return (
    <div className="game-info">
      Sort Moves: <button onClick={toggleSortOrder}>{isSortAscending ? 'V' : '^'}</button>
      {isSortAscending ? moves : [...moves].reverse()}
      You are at move: {history.length}
    </div>
  )
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

  return (
    <div className="game">
      <div className="game-board">
        <Board isXNext={isXNext} squares={currentSquares} onMove={handleMove} />
      </div>
      <History history={history} onJumpTo={jumpTo} />
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
  * When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw).
  * Display the location for each move in the format (row, col) in the move history list.
*/