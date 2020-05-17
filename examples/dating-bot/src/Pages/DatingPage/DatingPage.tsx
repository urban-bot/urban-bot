import React, { useState } from 'react';
import { useGetProfile } from '../../Common/api/requests/getProfile';
import { UserProfile } from '../../Components/UserProfile/UserProfile';
import { Button, ButtonGroup } from '@urban-bot/core';

export function DatingPage() {
    const [userId, setUserId] = useState(0);
    const { data, error, loading } = useGetProfile(String(userId));

    if (loading || error || !data) {
        return null;
    }

    const handleClickPrevious = () => setUserId(userId > 0 ? userId - 1 : 0);
    const handleClickNext = () => setUserId(userId + 1);

    return (
        <UserProfile
            profile={data}
            buttons={
                <ButtonGroup>
                    <Button onClick={handleClickPrevious}>{'<'}</Button>
                    <Button onClick={handleClickPrevious}>{'❤'}</Button>
                    <Button onClick={handleClickPrevious}>{'👎'}</Button>
                    <Button onClick={handleClickNext}>{'>'}</Button>
                </ButtonGroup>
            }
        />
    );
}
