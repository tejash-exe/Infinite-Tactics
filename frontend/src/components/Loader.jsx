import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';

const Loader = () => {
    
    const navigate = useNavigate();
    const symbols = ["X", "O", "X", "O"];
    const gridOrder = [0, 1, 3, 2]; // Clockwise order: top-left, top-right, bottom-right, bottom-left
    const [visibleIndex, setVisibleIndex] = useState(0);
    const [filling, setFilling] = useState(true);

    const goBack = () => {
        navigate('/home');
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setVisibleIndex((prev) => {
                if (prev === symbols.length - 1) {
                    setFilling(!filling); // Toggle filling and emptying
                    return 0;
                }
                return prev + 1;
            });
        }, 600);

        return () => clearInterval(interval);
    }, [filling]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-t via-purple-100 from-purple-200 to-white">
            <div className='w-full mb-auto flex mt-3'>
                <div onClick={goBack}>
                    <button className="button-54 scale-80" >Go Back</button>
                </div>
            </div>
            <div className='flex mt-[50%] -translate-y-1/2 justify-center items-center rounded-full shadow-[0px_0px_0px_60px_rgb(218,178,255,0.3)]'>
                <div className='flex justify-center items-center rounded-full bg-[rgb(218,178,255,0.9)] shadow-[0px_0px_0px_30px_rgb(218,178,255,0.9)]'>
                    <div className="grid grid-cols-2 grid-rows-2 gap-2 w-24 h-24 ">
                        {gridOrder.map((pos, index) => (
                            <div key={index} className={`flex rounded-xl items-center ${(symbols[pos] === 'X') ? ' bg-white ' : ' bg-purple-600 '} justify-center text-4xl font-bold text-white transition-opacity duration-500`}>
                                {(symbols[pos] === 'X') ? <FontAwesomeIcon className={` w-5 h-5 text-purple-600 duration-500 ${(filling && visibleIndex >= pos) || (!filling && visibleIndex < pos) ? "opacity-100" : "opacity-0"} `} icon={faXmark} /> : <FontAwesomeIcon className={` duration-500 w-5 h-5 ${(filling && visibleIndex >= pos) || (!filling && visibleIndex < pos) ? "opacity-100" : "opacity-0"} `} icon={faCircle} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='font-bold mt-20 text-gray-600 mb-auto'> Searching for a match...</div>
        </div>
    )
};

export default Loader;