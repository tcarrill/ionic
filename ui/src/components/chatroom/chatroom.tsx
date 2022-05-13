import './chatroom.scss';
import React, { useEffect, useState } from 'react';
import { ChatBubble } from '../chat-bubble/chat-bubble';
import { models } from '../../models';
import { useParams } from 'react-router-dom';
import {APIService} from '../../services';

const API_URL: string = process.env.CHAT_API_ENDPOINT || 'http://localhost:5000';

export interface ChatroomProps { }

type RouteParams = {
    id: string;
}

export const Chatroom: React.FunctionComponent<ChatroomProps> = () => {
    const [message, setMessage] = useState('');
    const messages: models.Message[] = [];
    const sendingMessage = true;
    const loadingMessages = false;
    const { id } = useParams<RouteParams>();
    const currentUser: models.User | undefined = { id: '1', name: 'Test User' };

    const sendMessage = () => {
        if (sendingMessage) {
                        APIService.do(`${API_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    room_id: id,
                    content: message,
                })
            }).then(r => {
                setMessage(r.message)
            }).catch(e => {
                setMessage(e.message)
            })
            return;
        }
    };

    useEffect(() => {
        // load or reload recent messages with chatroom id
    }, []);

    return (
        <section className='chat'>
            <main className='chat__view'>
                {(messages || [])?.map((m, i) => {
                    const isContinued = (i + 1 < messages!.length) && messages![i + 1].sentBy.id === m.sentBy.id;
                    const isCurrentUser = m.sentBy.id === currentUser?.id;
                    return <ChatBubble key={m.id} name={m.sentBy.name} sentByUser={isCurrentUser} appearContinued={isContinued} content={m.content} />
                })}
            </main>
            <footer className='chat__input'>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
                <button onClick={() => sendMessage()}> Send </button>
            </footer>
        </section>
    )
};
