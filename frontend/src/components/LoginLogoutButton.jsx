import React, { useContext } from 'react';
import { AppContext } from '../context/context';
//Utils
import { useGoogleLogin } from '@react-oauth/google';

const LoginLogoutButton = () => {
    
    const { backend_url, isAuth, setisAuth, setname, setemail, setscore, setpicture, loading, setloading } = useContext(AppContext);

    const responseGoogle = async (authResult) => {
        try {
            setloading(true);
            if (authResult.code) {
                const response = await fetch(`${backend_url}/api/users/login?code=${authResult.code}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const result = await response.json();

                if (result.status == 200) {
                    localStorage.setItem("name", result.data.user.name);
                    localStorage.setItem("email", result.data.user.email);
                    localStorage.setItem("picture", result.data.user.picture);
                    localStorage.setItem("score", result.data.user.score);
                    setname(result.data.user.name);
                    setemail(result.data.user.email);
                    setpicture(result.data.user.picture);
                    setscore(result.data.user.score);

                    localStorage.setItem("isAuth", JSON.stringify(true));
                    setisAuth(true);
                }
                else {
                    // console.log(result);
                    throw new Error(result.message);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setloading(false);
        }
    };

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: 'auth-code',
        ux_mode: "popup",
        prompt: "select_account",
    });

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            setloading(true);
            const response = await fetch(`${backend_url}/api/users/logout`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const result = await response.json();
        } catch (error) {
            console.log(error);
        } finally {
            localStorage.setItem("isAuth", "false");
            setisAuth(false);
            setloading(false);
        }
    };

    return (
        <>
            {(isAuth) ? <button disabled={loading} className='text-white active:scale-95 duration-300 cursor-pointer font-semibold px-5 py-2 bg-red-700 rounded-lg' onClick={handleLogout}>Logout</button> : <button disabled={loading} className='text-white active:scale-95 duration-300 cursor-pointer font-semibold px-5 py-2 bg-purple-700 rounded-lg' onClick={googleLogin}>{(loading) ? ' Logging ' : ' Login '}</button>}
        </>
    )
};

export default LoginLogoutButton;