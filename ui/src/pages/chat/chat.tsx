import './chat.scss';
import { Link, NavLink, Route, RouteProps, Routes } from 'react-router-dom';
import React, {useState} from 'react';
import { stringToColor } from '../../utils';
import { Chatroom, ChatroomCard, NewChatroom } from '../../components';
import { models } from '../../models';
import {APIService} from '../../services';

const API_URL: string = process.env.CHAT_API_ENDPOINT || 'http://localhost:5000';
export interface ChatProps { }

export const ChatPage: React.FunctionComponent<ChatProps> = () => {

    // need to load user
    const currentUser: models.User = {
        id: '1',
        name: 'Test User',
    };


    // need to load chatrooms
    const chatrooms: models.Chatroom[] = [{
        id: '1',
        name: 'Test Chatroom',
        mostRecentMessage: {
            id: '1',
            sentBy: currentUser,
            content: 'Lorem Ipsum',
            sentAt: new Date(Date.now()),
        }
    }];

    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);
    const [message, setMessage] = useState('');

    const logout = () => {
        APIService.do(`${API_URL}/logout`, {
                method: 'POST',
                 headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(r => {
                localStorage.removeItem('token')
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

    const sortChatrooms = (_1: object, _2: object) => {
        return 0;
    };

    return (
        <div id='container'>
            <div className='chatroom'>
                <aside className='chatroom__sidebar'>
                    <section className='sidebar__header'>
                        <div className='identifiers'>
                            <h1>the chat site</h1>
                            <h2>
                                chatting as <span className='name' style={{ color: stringToColor(currentUser?.name) }}>{currentUser?.name}</span>
                            </h2>
                        </div>
                        <div className='actions'>
                            <button onClick={() => logout()}>logout</button>
                        </div>
                    </section>
                    <ul className='sidebar__list'>
                        <div className='new-room-option'>
                            <Link to={'new'}>create new room</Link>
                        </div>
                        {chatrooms
                            ?.slice()
                            ?.sort((c1, c2) => sortChatrooms(c1, c2))
                            ?.map(c => (
                                <li key={c.id}>
                                    <NavLink
                                        className={isActive => isActive ? 'is-active' : ''}
                                        to={`${c.id}`}>
                                        <ChatroomCard mostRecentMessage={c.mostRecentMessage} name={c.name} />
                                    </NavLink>
                                </li>
                            ))}
                    </ul>
                </aside>
                <main className='chatroom__window'>
                    <Routes>
                        <Route path='' element={
                            <div className='no-chatroom'>
                                <h3>Join a chatroom...</h3>
                            </div>
                        }>
                        </Route>
                        <Route path='new' element={<NewChatroom/>}>
                        </Route>
                        <Route path=':id' element={<Chatroom/>} />
                    </Routes>
                </main>
            </div>
        </div >
    );
};
