import React, { useEffect, useState } from 'react';
import "./Login.css";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { userActor } from '../../states/actors/userActor';

const Login = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.account);
    const [userDetails, setUserDetails] = useState({ password: "", username: "" });
    const [loading, setLoading] = useState(false); // Optional: for loading state

    const onChanage = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);  // Add isAuthenticated as a dependency

    const loginUser = async (e) => {
        e.preventDefault();

        const { username, password } = userDetails;

        // Basic form validation
        if (!username || !password) {
            toast.error("Please fill in both fields");
            return;
        }

        setLoading(true);  // Set loading state to true while fetching
        const data = JSON.stringify({ password, username });

        try {
            const res = await fetch("http://localhost:5001/api/user/login", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: data,
            });

            const d = await res.json();

            if (res.ok && d.success) {
                toast.success(d.message);
                localStorage.setItem("token", d.token); // Store token as a plain string
                dispatch(userActor(d.user));  // Update user state in Redux store
                navigate('/');  // Redirect to homepage after login
            } else {
                toast.error(d.message || "Login failed");
            }
        } catch (error) {
            toast.error("An error occurred while logging in");
            console.error(error);
        } finally {
            setLoading(false);  // Reset loading state after request
        }
    };

    return (
        <>
            <header className='px-10 py-5'>
                <div className="logo">
                    <Link to='/'><img src="/assets/white_logo.png" width={120} alt="Spotify Logo" /></Link>
                </div>
            </header>
            <div className="container py-10">
                <div className='bg-black text-center w-1/2 mx-auto py-10 rounded-lg'>
                    <h1 className='text-5xl font-bold my-12'>Log in to Spotify</h1>
                    <div className="border-b border-gray-200 w-3/4 mx-auto my-4"></div>
                    <form onSubmit={loginUser} className='text-center mx-auto w-1/2 py-4'>
                        <div className='w-full text-left py-4'>
                            <label htmlFor="username" className='font-semibold inline-block mb-2'>Email or username</label>
                            <input 
                                type="text" 
                                id='username' 
                                name='username' 
                                value={userDetails.username} 
                                onChange={onChanage} 
                                placeholder='Email or username' 
                                className='block w-full rounded-md border-0 text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 focus:ring-[3px] focus:ring-inset focus:ring-white-600 outline-none p-3 hover:ring-white bg-[#1a1919]' 
                            />
                        </div>
                        <div className='w-full text-left py-4'>
                            <label htmlFor="password" className='font-semibold inline-block mb-2'>Password</label>
                            <input 
                                type="password" 
                                id='password' 
                                name='password' 
                                value={userDetails.password} 
                                onChange={onChanage} 
                                placeholder='Enter your password' 
                                className='block w-full rounded-md border-0 text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 focus:ring-[3px] focus:ring-inset focus:ring-white-600 outline-none p-3 hover:ring-white bg-[#1a1919]' 
                            />
                        </div>
                        <div className='w-full text-left py-4'>
                            <input 
                                type="submit" 
                                id='submit' 
                                name='submit' 
                                className='block w-full outline-none p-3 hover:scale-105 transition-all duration-200 bg-green-500 hover:bg-green-400 text-black hover:font-semibold text-center rounded-full' 
                                disabled={loading}  // Disable submit button while loading
                            />
                        </div>
                        <div className='w-full text-center py-4'>
                            <Link to="/password/forgot" className='text-white font-semibold underline'>Forgot your password?</Link>
                        </div>
                    </form>
                    <div className="border-b border-gray-200 w-3/4 mx-auto my-4"></div>
                    <p className='pt-8'>
                        <span className='text-gray-300 font-semibold'>Don't have an account?</span> 
                        <Link to="/signup" className='text-white font-semibold underline text-center hover:text-green-400'>Sign up for Spotify</Link>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
