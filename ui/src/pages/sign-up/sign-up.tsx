import './sign-up.scss';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {APIService} from '../../services';

const API_URL: string = process.env.CHAT_API_ENDPOINT || 'http://localhost:5000';

interface SignUpProps {
}

export const SignUpPage: React.FunctionComponent<SignUpProps> = () => {
    
    // need to be able to create user
    const creatingUser = true;
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [message, setMessage] = useState('');

    const showResponse = () => {
        if (isLoaded) {
            return message
        }
        return ''
    }

    const signUp = () => {
        if (creatingUser) {
            APIService.do(`${API_URL}/users`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: username,
                })
            }).then(r => {
                setMessage(r.message)
                setIsLoaded(true)
                setIsError(false)
            }).catch(e => {
                setMessage(e.message)
                setIsLoaded(true)
                setIsError(true)
            })
        }
    };

    return (
        <div id='container'>
            <div className='sign-up'>
                <div className='welcome-card'>
                    <h1>
                        welcome to <span className='app-name'>the chat site</span>
                    </h1>
                    <h2>Create your account or <Link to='/login'>back to login</Link></h2>
                    {showResponse()}
                    <label>
                        Username
                        <input type='text' value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} />
                    </label>
                    <label>
                        Name
                        <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
                    </label>
                    <button onClick={() => signUp()} type='submit' >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};
