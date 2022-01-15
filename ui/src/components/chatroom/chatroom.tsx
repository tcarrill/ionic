import './chatroom.scss';
import React, { useEffect, useState } from 'react';
import { ChatBubble } from '../chat-bubble/chat-bubble';
import { models } from '../../models';
import { useParams } from 'react-router-dom';

export interface ChatroomProps { }

type RouteParams = {
    id: string;
}

export const Chatroom: React.FunctionComponent<ChatroomProps> = () => {
    const [message, setMessage] = useState('');
    const messages: models.Message[] = [];
    const sendingMessage = false;
    const loadingMessages = false;
    const { id } = useParams<RouteParams>();
    const currentUser: models.User | undefined = { id: '1', name: 'Test User' };

    const sendMessage = () => {
        if (sendingMessage) {
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
                <textarea disabled={sendingMessage} value={message} onChange={(e) => setMessage(e.target.value)} />
                <button disabled={sendingMessage} onClick={() => sendMessage()}> Send </button>
            </footer>
        </section>
    )
};
