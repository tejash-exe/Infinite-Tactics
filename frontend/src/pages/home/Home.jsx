import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/context';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';
//Components
import LoginLogoutButton from '../../components/LoginLogoutButton';
import TicTacToeAnimation from '../../components/TicTacToeAnimation';

const Home = () => {

    const navigate = useNavigate();
    const { name, score, setscore, picture, isAuth, loading, backend_url } = useContext(AppContext);
    const [scoreLoading, setscoreLoading] = useState(false);
    const [authPopup, setauthPopup] = useState(false);

    const cancelPopup = () => {
        setauthPopup(false);
    };

    const gotoLeaderboard = () => {
        navigate('/leaderboard');
    };

    const playOffline = () => {
        if (!loading) navigate('/offline');
    };

    const playOnline = () => {
        if (!loading && isAuth) navigate('/online');
        if (!isAuth) setauthPopup(true);
    };

    const fetchScore = async () => {
        try {
            setscoreLoading(true);
            const response = await fetch(`${backend_url}/api/users/refresh-score`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const result = await response.json();
            if (result.status == 200) {
                localStorage.setItem("score", score);
                setscore(result.data.score);
                // console.log(result.data.score);
            }
            else {
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setscoreLoading(false);
        }
    };

    useEffect(() => {
        if (isAuth) fetchScore();
    }, []);

    return (
        <>
            {authPopup && <div className='fixed z-[10] top-0 left-0 backdrop-blur-sm duration-200 w-screen flex justify-center items-center h-screen '>
                <div className='bg-gradient-to-tr from-purple-200 to-purple-100 via-purple-100 p-6 rounded-4xl'>
                    <div className="">Please login to play online!</div>
                    <div className="flex mt-3 flex-row-reverse">
                        <div onClick={cancelPopup}>
                            <button className="button-54 scale-70 bg-purple-50" >Understood</button>
                        </div>
                    </div>
                </div>
            </div>}
            <div className="min-h-screen w-full bg-gradient-to-t from-purple-50 to-white via-purple-50 flex flex-col items-center justify-between">
                <div className={`w-full flex ${(isAuth) ? ' flex-row justify-between ' : ' flex-row-reverse '} p-4`}>
                    {isAuth && <div className='flex items-center border-2 rounded-4xl pl-2 pr-4 py-1'>
                        <div><img className='w-8 h-8 mr-2 rounded-full' src={picture} alt="" referrerPolicy="no-referrer" /></div>
                        <div>
                            <div className='font-semibold'>{name.trim().split(/\s+/)[0]}</div>
                            <div className={'text-xs rounded-4xl ' + ((scoreLoading) ? ' animate-pulse text-purple-100 bg-purple-100 ' : ' ')}>{score}</div>
                        </div>
                    </div>}
                    <div>
                        <LoginLogoutButton />
                    </div>
                </div>
                <div className='flex flex-col w-[15rem]'>
                    <img className='object-contain mr-10' src="./brand.png" alt="" />
                    <img className='ml-10 object-contain' src="./brand1.png" alt="" />
                </div>
                <div className={`w-full flex flex-row-reverse px-4`}>
                    <div onClick={gotoLeaderboard}>
                        <button className="button-74 "><FontAwesomeIcon className='pr-2' icon={faMedal} />Leaderboard</button>
                    </div>
                </div>
                <div className='flex justify-center items-center w-full'>
                    <TicTacToeAnimation />
                </div>
                <div className='flex justify-around w-full mb-[4rem]'>
                    <div onClick={playOnline}>
                        <button className="button-54 bg-purple-200 w-[9rem]">
                            <div className='flex justify-center items-center'>
                                <div><img className='w-6 h-6 mr-2' src="/signal.png" alt="" /></div>
                                <div>Play</div>
                            </div>
                            <div className='text-xs'>(online)</div>
                        </button>
                    </div>
                    <div onClick={playOffline}>
                        <button className="button-54 w-[9rem]">
                            <div className='flex justify-center items-center '>
                                <div><img className='w-6 h-6 mr-2' src="/no-signal.png" alt="" /></div>
                                <div>Play</div>
                            </div>
                            <div className='text-xs'>(offline)</div>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
};

export default Home;