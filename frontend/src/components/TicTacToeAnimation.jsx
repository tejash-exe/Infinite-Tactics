import React, { useState, useEffect } from 'react';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';

const TicTacToeAnimation = () => {

  const [board, setBoard] = useState(Array(16).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winningCells, setWinningCells] = useState([]);

  const getRandomEmptyCell = (board) => {
    const emptyCells = board.map((cell, index) => (cell === null ? index : null)).filter((i) => i !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  };

  const checkWinner = (board) => {
    const lines = [
      // Rows
      [0, 1, 2], [1, 2, 3], [4, 5, 6], [5, 6, 7], [8, 9, 10], [9, 10, 11], [12, 13, 14], [13, 14, 15],
      // Columns
      [0, 4, 8], [4, 8, 12], [1, 5, 9], [5, 9, 13], [2, 6, 10], [6, 10, 14], [3, 7, 11], [7, 11, 15],
      // Diagonals
      [0, 5, 10], [1, 6, 11], [4, 9, 14], [5, 10, 15], [2, 5, 8], [3, 6, 9], [6, 9, 12], [7, 10, 13]
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return line;
      }
    }
    return null;
  };

  const checkTie = (board) => {
    return board.every(cell => cell !== null);
  };

  useEffect(() => {
    const playMove = () => {
      if (winningCells.length > 0) return; // Pause if there's a winner

      const index = getRandomEmptyCell(board);
      if (index === undefined) return;
      const newBoard = [...board];
      newBoard[index] = isXNext ? 'X' : 'O';
      setBoard(newBoard);
      setIsXNext(!isXNext);

      const winner = checkWinner(newBoard);
      if (winner) {
        setWinningCells(winner);
        setTimeout(() => {
          setBoard(Array(16).fill(null));
          setWinningCells([]);
        }, 2000); // Restart after 2 seconds
      }
      else if (checkTie(newBoard)) {
        setTimeout(() => {
          setBoard(Array(16).fill(null));
        }, 2000); // Restart after 2 seconds if tie
      }
    };

    const interval = setInterval(playMove, 700); // Play every 700ms

    return () => clearInterval(interval);
  }, [board, isXNext, winningCells]);

  const setColor = (cell, index) => {
    let color;
    if (winningCells.length > 0) {
      if (winningCells.includes(index)) {
        color = 'text-red-600';
      }
      else {
        color = 'text-gray-500';
      }
    }
    else {
      if (cell === 'X') {
        color = 'text-purple-700';
      }
      else {
        color = 'text-black';
      }
    }
    return color;
  };

  return (
    <div className="flex flex-wrap w-56 h-56 rounded-lg my-6">
      {board.map((cell, index) => (
        <div key={index} className={`flex items-center justify-center w-1/4 h-1/4 text-3xl rounded-xl border-purple-50 bg-purple-200 border-2 ${setColor(cell, index)}`}>
          {cell && (cell === 'X') ? <FontAwesomeIcon icon={faXmark} /> : (cell === 'O') ? <FontAwesomeIcon className='w-6 h-6' icon={faCircle} /> : <span className='invisible'>X</span>}
        </div>
      ))}
    </div>
  );
};

export default TicTacToeAnimation;