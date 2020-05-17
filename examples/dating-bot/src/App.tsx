import React from 'react';
import { Route, Router, useBotContext } from '@urban-bot/core';
import { MainPage } from './Pages/MainPage/MainPage';
import { initializeMockedDB } from './Common/api/requests/moked/DB';
import { DatingPage } from './Pages/DatingPage/DatingPage';
import { UserProfilePage } from './Pages/UserProfilePage/UserProfilePage';
import { UrbanBotTelegram } from '@urban-bot/telegram';
import { useGetProfile } from './Common/api/requests/getProfile';

initializeMockedDB();

export function App() {
    const botContext = useBotContext<UrbanBotTelegram>();
    const profile = useGetProfile(botContext.chat.id);

    return (
        <Router>
            <Route path="/start" description={'Главное меню'}>
                <MainPage botContext={botContext} profile={profile.data} />
            </Route>
            <Route path="/dating" description={'Поиск пары'}>
                <DatingPage />
            </Route>
            <Route path="/profile" description={'Профиль'}>
                <UserProfilePage botContext={botContext} profile={profile.data} />
            </Route>
        </Router>
    );
}
