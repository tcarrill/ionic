import './login.scss';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {APIService} from '../../services';

const API_URL: string = process.env.CHAT_API_ENDPOINT || 'http://localhost:5000';

export interface LoginProps { }

export const LoginPage: React.FunctionComponent<LoginProps> = () => {
    const loggingIn = true;
    const [username, setUsername] = useState('');
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [message, setMessage] = useState('');

    const showResponse = () => {
        if (isLoaded) {
            return message
        }
        return ''
    }

    // need to be able to login
    const login = () => {
        if (loggingIn) {
           APIService.do(`${API_URL}/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: username,
                })
            }).then(r => {
                localStorage.setItem('token', r.token);
                setMessage(r.token)
                setIsLoaded(true)
                setIsError(false)
            }).catch(e => {
                setMessage(e.message)
                setIsLoaded(true)
                setIsError(true)
            })
        }
    }

    return (
        <div id='container'>
            <div className='login'>
                <div className='welcome-card'>
                    <h1>
                        welcome to <span className='app-name'>the chat site</span>
                    </h1>
                    {showResponse()}
                    <h2>Please login or <Link to='/sign-up'>sign up</Link></h2>
                    <label>
                        Username
                        <input type='text' value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} />
                    </label>
                    <button type='submit' onClick={() => login()}>
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};
