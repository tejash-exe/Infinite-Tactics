import React from 'react';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
    const navigate = useNavigate();

    const goHome = () => {
        navigate('/home');
    };
    
    return (
        <div className='flex justify-center items-center w-screen min-h-screen'>
            <div className="flex flex-col items-center bg-gradient-to-t from-purple-200 w-[25rem] to-white via-purple-100 min-h-screen justify-center">
                <div className='bg-purple-300 p-6 rounded-3xl'>
                    <div className='text-xl'>Page not Found!</div>
                    <div>
                        <div onClick={goHome}>
                            <button className="button-54 scale-80 mt-3 bg-purple-50" >Go Home</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default PageNotFound;