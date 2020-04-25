import { render } from './render';
import { Router, Route } from './components/Router';
import { Text } from './components/Text';
import { Image } from './components/Image';
import { ButtonGroup, Button } from './components/ButtonGroup';
import { Root } from './components/Root';
import { getBotContext, RouterContext } from './context';
import {
    useBotContext,
    useText,
    useCommand,
    useRouter,
    useSticker,
    useAnimation,
    useAny,
    useAudio,
    useContact,
    useFile,
    useInvoice,
    useLocation,
    useImage,
    usePoll,
    useVideo,
    useVoice,
    useDice,
    useAction,
} from './hooks/hooks';

export {
    render,
    Router,
    Route,
    Button,
    useText,
    useCommand,
    Text,
    Image,
    ButtonGroup,
    useBotContext,
    useRouter,
    Root,
    useSticker,
    useAnimation,
    useAny,
    useAudio,
    useContact,
    useFile,
    useInvoice,
    useLocation,
    useImage,
    usePoll,
    useVideo,
    useVoice,
    useDice,
    getBotContext,
    RouterContext,
    useAction,
};
