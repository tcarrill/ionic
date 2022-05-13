import React, { useState } from 'react';
import './new-chatroom.scss';
import {APIService} from '../../services';

const API_URL: string = process.env.CHAT_API_ENDPOINT || 'http://localhost:5000';

export interface NewChatroomProps {
}

export const NewChatroom: React.FunctionComponent<NewChatroomProps> = () => {
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

    // need to be able to create room
    const create = () => {

            APIService.do(`${API_URL}/rooms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    name: name,
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
            return;
    };

    return (
        <div className='new-chatroom'>
            <div className='card'>
                <h2>Choose a name for the new room</h2>
                {showResponse()}
                <label>
                    Room name
                    <input value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <button onClick={() => create()}>
                    Create Room
                </button>
            </div>
        </div>
    );
};
