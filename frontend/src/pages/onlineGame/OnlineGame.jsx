import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/context';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faRepeat, faInfinity, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
//Components
import Loader from '../../components/Loader.jsx';
//Utils
import { io } from 'socket.io-client';

const OnlineGame = () => {

  const gameOverRef = useRef(false);
  const navigate = useNavigate();
  const { name, score, picture, backend_url, isAuth, setisAuth, setscore } = useContext(AppContext);
  const [socket, setSocket] = useState(null);
  const [board, setBoard] = useState(Array(16).fill(null));
  const [message, setMessage] = useState('Searching for a match...');
  const [isConnected, setIsConnected] = useState(false);
  const [isP1Next, setIsP1Next] = useState(true);
  const [winningCells, setWinningCells] = useState([]);
  const [p1Wins, setP1Wins] = useState(score);
  const [p2Wins, setP2Wins] = useState(0);
  const [timer, setTimer] = useState(null);
  const [player1, setPlayer1] = useState('X');
  const [player1Name, setPlayer1Name] = useState(name.trim().split(/\s+/)[0]);
  const [player2Name, setPlayer2Name] = useState("Player 2");
  const [roomID, setroomID] = useState("");
  const [player2Picture, setplayer2Picture] = useState(null);
  const [isPopup, setisPopup] = useState(false);
  const [isDraw, setisDraw] = useState(false);
  const [winner, setwinner] = useState(null);
  const [refresh, setrefresh] = useState(true);
  const [isBack, setisBack] = useState(false);

  const cancelBack = () => {
    setisBack(false);
  };

  const openBack = () => {
    setisBack(true);
  };

  const goBack = () => {
    navigate('/home');
  };

  const setColor = (cell, index) => {
    let color;
    if (winningCells && winningCells.length > 0) {
      if (winningCells.includes(index)) {
        color = 'text-red-600';
      }
      else {
        color = 'text-gray-500';
      }
    }
    else {
      if (cell === socket.id) {
        if (player1 === 'X') {
          color = 'text-purple-700';
        }
        else {
          color = 'text-black';
        }
      }
      else {
        if (player1 === 'X') {
          color = 'text-black';
        }
        else {
          color = 'text-purple-700'
        }
      }
    }
    return color;
  };

  const switchPlayers = () => {
    setPlayer1((prev) => (prev === 'X' ? 'O' : 'X'));
  };

  const playAgain = () => {
    gameOverRef.current = false;
    setBoard(Array(16).fill(null));
    setMessage('Searching for a match...');
    setIsConnected(false);
    setIsP1Next(true);
    setWinningCells([]);
    setP2Wins(0);
    setroomID("");
    setplayer2Picture(null);
    setisPopup(false);
    setisDraw(false);
    setwinner(null);
    setTimer(null);
    setrefresh(prev => !prev);
  };

  useEffect(() => {
    if (!isAuth) navigate('/home');
  }, [isAuth]);

  useEffect(() => {
    if (gameOverRef.current) return;
    const newSocket = io(`${backend_url}`, { withCredentials: true });

    newSocket.on("connect_error", (error) => {
      console.log(error);
      if (error.data.status == 469) {
        localStorage.setItem('isAuth', JSON.stringify(false));
        setisAuth(false);
      }
    });

    newSocket.on("authFailed", () => {
      localStorage.setItem('isAuth', JSON.stringify(false));
      setisAuth(false);
    });

    newSocket.on('connect', () => {
      setMessage('Searching for a match...');
    });

    newSocket.on('gameStart', (result) => {
      setIsConnected(true);
      setMessage('Match found!');
      setroomID(result.roomId);
      setBoard(result.game.board);
    });

    newSocket.on('gameState', (game) => {
      setBoard(game.board);
      setIsP1Next(game.currentPlayer === newSocket.id);
      if (!gameOverRef.current) {
        setMessage(`${game.currentPlayer === newSocket.id ? "Your turn" : "Opponent's turn"}`);
      }
    });

    newSocket.on('opponentDetails', (opponent) => {
      setPlayer2Name(opponent.name.trim().split(/\s+/)[0]);
      setP2Wins(opponent.score);
      setplayer2Picture(opponent.picture);
    });

    newSocket.on('gameOver', ({ winner, winningCells, isDraw, left, timer }) => {
      setTimer(null);
      setWinningCells(winningCells);
      setwinner(winner);
      setisDraw(isDraw);
      gameOverRef.current = true;
      let newScore = JSON.stringify(0);
      if (isDraw === true) {
        newScore = JSON.stringify(Number.parseInt(score) + 3);
        setMessage("It's a draw!");
      } else if (winner !== newSocket.id) {
        newScore = JSON.stringify(Number.parseInt(score) - 3);
        setMessage("You lost!");
      } else {
        newScore = JSON.stringify(Number.parseInt(score) + 5);
        setMessage("You won!");
      }
      if (left) {
        if (winner === newSocket.id) {
          newScore = JSON.stringify(Number.parseInt(score) + 5);
          setMessage("Opponent left the game!");
        }
        else {
          newScore = JSON.stringify(Number.parseInt(score) - 3);
          setMessage("You left the game!");
        }
      }
      if (timer) {
        if (winner === newSocket.id) {
          newScore = JSON.stringify(Number.parseInt(score) + 5);
          setMessage("Opponent's time ran out!");
        }
        else {
          newScore = JSON.stringify(Number.parseInt(score) - 3);
          setMessage("Your's time ran out!");
        }
      }

      localStorage.setItem("score", newScore);
      setscore(newScore);

      setTimeout(() => {
        setisPopup(true);
      }, 2000);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      setMessage('Disconnected from server.');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [refresh]);

  useEffect(() => {
    setP1Wins(score);
  }, [isPopup]);

  const handleClick = (index) => {
    if (board[index] === null && isP1Next && isConnected) {
      socket.emit('makeMove', { roomId: roomID, index });
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('timerUpdate', (time) => {
      setTimer(time);
    });

    return () => {
      socket.off('timerUpdate');
    };
  }, [socket]);

  return (
    <>
      {!isConnected && <Loader />}
      {isBack && <div className='fixed z-[10] top-0 left-0 backdrop-blur-sm duration-200 w-screen flex justify-center items-center h-screen '>
        <div className='bg-gradient-to-tr from-purple-200 to-purple-100 via-purple-100 p-6 rounded-4xl'>
          <div className="">Do you really want to leave the game?</div>
          <div className="text-sm">(Your ratings will decrease)</div>
          <div className="flex mt-3 flex-row-reverse">
            <div onClick={goBack}>
              <button className="button-54 scale-80 bg-red-400" >Go Back</button>
            </div>
            <div onClick={cancelBack}>
              <button className="button-54 scale-80 bg-purple-50" >Stay</button>
            </div>
          </div>
        </div>
      </div>}
      {isConnected && <div className="flex z-[-1] flex-col items-center bg-gradient-to-t from-purple-50 to-white via-purple-50 min-h-screen justify-between">
        <div className='w-full flex '>
          <div onClick={openBack}>
            <button className="button-54 scale-80 mt-3" >Go Back</button>
          </div>
        </div>
        <div className='flex justify-between w-full px-2'>
          <div>
            <div className='flex bg-purple-100 rounded-4xl overflow-hidden py-1 items-center'>
              <div><img referrerPolicy="no-referrer" className='ml-2 sm:w-11 rounded-full sm:h-11 w-9 h-9 object-contain' src={picture} /></div>
              <div className='ml-1'>
                <div className='sm:w-[6rem] w-[5rem] sm:text-base text-sm'>{player1Name}</div>
                <div className='flex items-center'>
                  <div className=''>{(player1 === 'X') ? <FontAwesomeIcon className='w-3 h-3' icon={faXmark} /> : <FontAwesomeIcon className='w-3 h-3' icon={faCircle} />}</div>
                  <div className='text-xs ml-1'>: {p1Wins}</div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-col items-center'>
            <div><img className='object-contain w-14 h-14' src="./battle.png" /></div>
          </div>
          <div>
            <div className='flex bg-purple-100 rounded-4xl overflow-hidden py-1 items-center'>
              <div className='mr-1'>
                <div className='sm:w-[6rem] w-[5rem] sm:text-base text-sm text-right'>{player2Name}</div>
                <div className='flex items-center flex-row-reverse'>
                  <div className=''>{(player1 === 'O') ? <FontAwesomeIcon className='w-3 h-3' icon={faXmark} /> : <FontAwesomeIcon className=' w-3 h-3 ' icon={faCircle} />}</div>
                  <div className='text-xs mr-1'>{p2Wins} :</div>
                </div>
              </div>
              <div><img referrerPolicy="no-referrer" className='mr-2 sm:w-11 rounded-full sm:h-11 w-9 h-9 object-contain' src={player2Picture} /></div>
            </div>
          </div>
        </div>
        <div>
          <div className={'flex w-[7rem] p-3 rounded-xl justify-center ' + ((timer != null && timer <= 3) ? ' animate-pulse bg-red-400 text-white ' : ' bg-purple-200 ')}>
            <div><img className='object-contain w-6 h-6' src="./hourglass.png" /></div>
            <div>: {(timer != null) ? timer + 's' : <FontAwesomeIcon icon={faInfinity} />}</div>
          </div>
        </div>
        <div className="flex flex-wrap w-56 h-56 rounded-lg ">
          {board.map((cell, index) => (
            <div key={index} onClick={() => handleClick(index)} className={`flex items-center justify-center w-1/4 h-1/4 text-3xl border-purple-50 border-2 bg-purple-200 rounded-xl cursor-pointer ${setColor(cell, index)}`} >
              {cell && ((cell === socket.id) ? ((player1 == 'X') ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon className='w-6 h-6' icon={faCircle} />) : ((player1 == 'O') ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon className='w-6 h-6' icon={faCircle} />))}
            </div>
          ))}
        </div>
        <div>{message}</div>
        <div className='flex w-full justify-center mb-[5rem]'>
          <div onClick={switchPlayers}><button className="button-54" ><div className=''><FontAwesomeIcon className='w-20 h-20' icon={faRepeat} /></div></button></div>
        </div>
        <div className='text-xs'>Room ID : {roomID}</div>
      </div>}
      {isPopup && <div className="fixed top-0 left-0 w-screen backdrop-blur-sm duration-200 flex justify-center items-center h-screen ">
        <div className='flex flex-col bg-gradient-to-tr from-purple-200 to-purple-100 via-purple-100 items-center p-6 rounded-4xl'>
          <div>
            {(isDraw) ? <img className='w-[13rem] mt-6' src='/wellplayed.png' /> : ((winner == socket.id) ? <img className='w-[15rem] mt-6' src='/congratulations.png' /> : <img className='w-[17rem] mt-6' src='/oops.png' />)}
          </div>
          <div>
            {(isDraw) ? <div className='font-bold my-2'>It's a Draw!</div> : ((winner == socket.id) ? <div className='font-bold my-2'>You won!</div> : <div className='font-bold my-2'>You lose!</div>)}
          </div>
          <div className='flex items-center bg-white p-2 rounded-4xl'>
            <div><img className='w-10 h-10 object-contain rounded-full mr-2' referrerPolicy="no-referrer" src={picture} /></div>
            <div className='flex items-center'>
              <div className='mr-1'>{(isDraw) ? <div>{Number.parseInt(score) - 3}</div> : ((winner == socket.id) ? <div>{Number.parseInt(score) - 5}</div> : <div>{Number.parseInt(score) + 3}</div>)}</div>
              <div className='mr-1'><FontAwesomeIcon className='w-3 h-3' icon={faArrowRight} /></div>
              <div className='mr-2'>
                {score}
              </div>
              <div className=''>
                {(isDraw) ? <div className='text-green-500'>(+3)</div> : ((winner == socket.id) ? <div className='text-green-500'>(+5)</div> : <div className='text-red-500'>(-3)</div>)}
              </div>
            </div>
          </div>
          <div className='flex my-6'>
            <div onClick={goBack}>
              <button className="button-54 scale-80" >Go Back</button>
            </div>
            <div onClick={playAgain}>
              <button className="button-54 scale-80 bg-purple-50" >Play again</button>
            </div>
          </div>
        </div>
      </div>}
    </>
  );
};

export default OnlineGame;