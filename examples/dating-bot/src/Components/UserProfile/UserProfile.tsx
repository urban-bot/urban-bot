import React from 'react';
import { Image } from '@urban-bot/core';
import { lang } from '../../Common/lang';
import { ButtonGroupProps } from '@urban-bot/core/dist/components/ButtonGroup';
import { Profile } from '../../Common/api/requests/types';

type Props = {
    profile: Profile;
    buttons?: React.FunctionComponentElement<ButtonGroupProps>;
    isNewMessageEveryRender?: boolean;
};

export function UserProfile({ profile, buttons }: Props) {
    return (
        <Image
            file={profile.avatar}
            title={
                <>
                    <b>{profile.name}</b>
                    <br />
                    Возраст: <i>{lang.AGE(profile.birthday)}</i> <br />
                    <i>{profile.description}</i> <br />
                </>
            }
            buttons={buttons}
        />
    );
}
