import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faRotateRight, faRepeat, faStar, faInfinity } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';

const OfflineGame = () => {
  
  const navigate = useNavigate();
  const [board, setBoard] = useState(Array(16).fill(null));
  const [isP1Next, setIsP1Next] = useState(true);
  const [winningCells, setWinningCells] = useState([]);
  const [p1Wins, setP1Wins] = useState(0);
  const [p2Wins, setP2Wins] = useState(0);
  const [draws, setDraws] = useState(0);
  const [timer, setTimer] = useState(null);
  const [player1, setPlayer1] = useState('X');
  const [player2, setPlayer2] = useState('O');
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");
  const [message, setMessage] = useState("Player1's turn");

  const goBack = () => {
    navigate('/home');
  };

  const changeP1Name = (e) => {
    const value = e.target.value;
    if (value.length <= 9) {
      setPlayer1Name(value);
    }
  };

  const changeP2Name = (e) => {
    const value = e.target.value;
    if (value.length <= 9) {
      setPlayer2Name(value);
    }
  };

  const resetBoard = () => {
    setBoard(Array(16).fill(null));
    setWinningCells([]);
    setTimer(null);
    setIsP1Next(true);
  };

  const switchPlayers = () => {
    setPlayer1((prev) => (prev === 'X' ? 'O' : 'X'));
    setPlayer2((prev) => (prev === 'O' ? 'X' : 'O'));
    setBoard((prevBoard) =>
      prevBoard.map((cell) => (cell === 'X' ? 'O' : cell === 'O' ? 'X' : null))
    );
  };

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

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2], [1, 2, 3], [4, 5, 6], [5, 6, 7], [8, 9, 10], [9, 10, 11], [12, 13, 14], [13, 14, 15],
      [0, 4, 8], [4, 8, 12], [1, 5, 9], [5, 9, 13], [2, 6, 10], [6, 10, 14], [3, 7, 11], [7, 11, 15],
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

  useEffect(() => {
    if (winningCells.length > 0) return;

    const winner = checkWinner(board);
    if (winner) {
      setWinningCells(winner);
      if (board[winner[0]] === player1) {
        setP1Wins((prev) => prev + 1);
        setMessage(`${player1Name} won!`);
      }
      else {
        setP2Wins((prev) => prev + 1);
        setMessage(`${player2Name} won!`);
      }
      setTimer(null);
      setTimeout(resetBoard, 2000);
    } else if (!board.includes(null)) {
      setDraws((prev) => prev + 1);
      setMessage("It's a draw!");
      setTimer(null);
      setTimeout(resetBoard, 2000);
    } else {
      setMessage(`${isP1Next ? player1Name : player2Name}'s turn`);
    }
  }, [board, winningCells, player1Name, player2Name]);

  useEffect(() => {
    let countdown;
    if (timer !== null) {
      countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 0) {
            handleTimeout();
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdown);
  }, [timer, winningCells]);

  const handleTimeout = () => {
    if (isP1Next) {
      setP2Wins((prev) => prev + 1);
      const winningCells = board.map((cell, index) => (cell === player2 ? index : null)).filter(index => index !== null);
      setWinningCells(winningCells);
      setMessage(`${player2Name} won by timeout!`);
    }
    else {
      setP1Wins((prev) => prev + 1);
      const winningCells = board.map((cell, index) => (cell === player1 ? index : null)).filter(index => index !== null);
      setWinningCells(winningCells);
      setMessage(`${player2Name} won by timeout!`);
    }
    setTimer(null);
    setTimeout(resetBoard, 2000);
  };

  const handleClick = (index) => {
    if (board[index] || winningCells.length > 0) return;

    if (timer === null) setTimer(10);

    const newBoard = [...board];
    const currentPlayer = isP1Next ? player1 : player2; // Dynamically get the correct player
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setIsP1Next(!isP1Next);
    setTimer(10);
  };

  return (
    <div className="flex flex-col items-center bg-gradient-to-t from-purple-50 to-white via-purple-50 min-h-screen justify-between">
      <div className='w-full flex '>
        <div onClick={goBack}>
          <button className="button-54 scale-80 mt-3" >Go Back</button>
        </div>
      </div>
      <div className='flex justify-between w-full px-2'>
        <div>
          <div className='flex flex-col bg-purple-100 rounded-4xl overflow-hidden py-1'>
            <div className='flex items-center'>
              <div className='ml-3 mr-2'>{(player1 === 'X') ? <FontAwesomeIcon className='w-4 h-4' icon={faXmark} /> : <FontAwesomeIcon className='w-4 h-4' icon={faCircle} />}</div>
              <input spellcheck="false" value={player1Name} onChange={(e) => changeP1Name(e)} className='w-[7rem] text-md outline-none' type="text" />
            </div>
            <div className='flex items-center'>
              <div className='ml-3 mr-2'><FontAwesomeIcon className='text-yellow-300 ' icon={faStar} /></div>
              <div className='text-sm'>{p1Wins}</div>
            </div>
          </div>
        </div>
        <div className='flex flex-col items-center'>
          <div><img className='object-contain w-14 h-14' src="./battle.png" /></div>
          <div>Draws : {draws}</div>
          <div></div>
        </div>
        <div>
          <div className='flex flex-col bg-purple-100 rounded-4xl overflow-hidden py-1'>
            <div className='flex items-center justify-end'>
              <input spellcheck="false" value={player2Name} onChange={(e) => changeP2Name(e)} className='w-[7rem] text-end text-md outline-none' type="text" />
              <div className='ml-2 mr-3'>{(player2 === 'X') ? <FontAwesomeIcon className='w-4 h-4' icon={faXmark} /> : <FontAwesomeIcon className='w-4 h-4' icon={faCircle} />}</div>
            </div>
            <div className='flex items-center justify-end'>
              <div className='text-sm'>{p2Wins}</div>
              <div className='ml-2 mr-3'><FontAwesomeIcon className='text-yellow-300 ' icon={faStar} /></div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className={'flex w-[5rem] p-3 rounded-xl ' + ((timer != null && timer <= 3) ? ' animate-pulse bg-red-400 text-white ' : ' bg-purple-200 ')}>
          <div><img className='object-contain w-6 h-6' src="./hourglass.png" /></div>
          <div>: {(timer != null) ? timer + 's' : <FontAwesomeIcon icon={faInfinity} />}</div>
        </div>
      </div>
      <div className="flex flex-wrap w-56 h-56 rounded-lg ">
        {board.map((cell, index) => (
          <div key={index} onClick={() => handleClick(index)} className={`flex items-center justify-center w-1/4 h-1/4 text-3xl border-purple-50 border-2 bg-purple-200 rounded-xl cursor-pointer ${setColor(cell, index)}`} >
            {cell && (cell === 'X' ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon className='w-6 h-6' icon={faCircle} />)}
          </div>
        ))}
      </div>
      <div>
        <div>
          {message}
        </div>
      </div>
      <div className='flex w-full justify-center mb-[6rem]'>
        <div onClick={switchPlayers}><button className="button-54 mr-10" ><div className=''><FontAwesomeIcon className='w-20 h-20' icon={faRepeat} /></div></button></div>
        <div onClick={resetBoard}><button className="button-54 px-0" ><div className=''><FontAwesomeIcon className='w-20 h-20' icon={faRotateRight} /></div></button></div>
      </div>
    </div>
  );
};

export default OfflineGame;