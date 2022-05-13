import './global.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ChatPage, LoginPage, SignUpPage } from './pages';
import { DemoAPIConnection } from './components/_api-connection/api-connection';

export const App: React.FunctionComponent = () => {
    return (
        <React.StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route path='/login' element={<LoginPage/>} />
                    <Route path='/sign-up' element={<SignUpPage/>} />
                    <Route path='/chat/*' element={<ChatPage/>} />
                    <Route
                        path='*'
                        element={<Navigate to='/login' />}
                    />
                </Routes>
            </BrowserRouter>
            <DemoAPIConnection />
        </React.StrictMode>);
}

ReactDOM.render(<App />, document.querySelector('#root')!);
