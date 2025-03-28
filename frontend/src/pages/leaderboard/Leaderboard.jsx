import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/context';

const Leaderboard = () => {

    const navigate = useNavigate();
    const { backend_url } = useContext(AppContext);
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, seterror] = useState(false);

    const goBack = () => {
        navigate('/home');
    };

    const refresh = () => {
        fetchRatings();
        seterror(false);
    };

    const fetchRatings = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${backend_url}/api/users/leaderboard`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (result.status === 200) {
                setRatings(result.data);
            } else {
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRatings();
    }, []);

    return (
        <div className="h-screen w-full bg-gradient-to-t from-purple-100 to-purple-50 via-purple-100 flex flex-col items-center overflow-x-hidden">
            <div className="w-full flex mt-3">
                <div onClick={goBack}>
                    <button className="button-54 scale-80">Go Back</button>
                </div>
            </div>
            <div className="w-full flex items-end mt-16 mb-6">
                <img className="ml-4 w-[15rem] mr-2" src="leaderboard.png" alt="Leaderboard" />
                <img className="w-14 h-14" src="trophy.png" alt="Trophy" />
            </div>
            {!loading && !error && ratings && <div className="w-[90%] mx-auto rounded-lg shadow-lg overflow-hidden flex flex-col mb-4">
                <table className="w-full table-fixed border-collapse">
                    <thead className="bg-purple-600 text-white sticky top-0 z-10">
                        <tr>
                            <th className="py-3 px-3 w-[20%] text-left">Rank</th>
                            <th className="py-3 px-3 w-[20%] text-center">User</th>
                            <th className="py-3 px-3 w-[40%] text-left">Name</th>
                            <th className="py-3 px-3 w-[20%] text-center">Score</th>
                        </tr>
                    </thead>
                </table>
                <div className="overflow-y-auto max-h-[65vh]">
                    <table className="w-full table-fixed border-collapse">
                        <tbody>
                            {ratings.map((rating, index) => (
                                <tr key={rating.email} className={index % 2 === 0 ? "bg-purple-50" : "bg-white"}>
                                    <td className="py-3 px-3 text-sm text-left">{index + 1}</td>
                                    <td className="py-3 px-3 text-center">
                                        <img className="w-8 h-8 rounded-full object-cover" src={rating.picture} referrerPolicy="no-referrer" alt={rating.name}/>
                                    </td>
                                    <td className="py-3 text-left px-3 text-sm truncate overflow-hidden whitespace-nowrap">
                                        {rating.name.trim().split(/\s+/)[0]}
                                    </td>
                                    <td className="py-3 px-3 text-sm truncate text-center overflow-hidden whitespace-nowrap">
                                        {rating.score}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>}
            {loading && <div className='my-auto pb-[10rem]'><img className='w-[6rem] h-[6rem] animate-spin' src="loading.png"/></div>}
            {error && <div className=' pt-[1rem] flex w-[90%]'>
                <div className='w-[15rem] mx-2'>
                    <div>An error occured while fetching leaderboard!</div>
                    <div onClick={refresh}><button className="button-54 mt-3 text-sm">Refresh</button></div>
                </div>
            </div>}
        </div>
    );
};

export default Leaderboard;