import React, { useState } from 'react';
import './new-chatroom.scss';

export interface NewChatroomProps {
}

export const NewChatroom: React.FunctionComponent<NewChatroomProps> = () => {
    const [name, setName] = useState('');
    const creatingRoom = false;

    // need to be able to create room
    const create = () => {
        if (creatingRoom) {
            return;
        }
    };

    return (
        <div className='new-chatroom'>
            <div className='card'>
                <h2>Choose a name for the new room</h2>
                <label>
                    Room name
                    <input disabled={creatingRoom} value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <button disabled={creatingRoom} onClick={() => create()}>
                    Create Room
                </button>
            </div>
        </div>
    );
};
