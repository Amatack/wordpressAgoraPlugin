import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';

import AgoraIcon from '../../assets/agoraIcon';

registerBlockType('agora-stats/block-market-cap', {
    title: 'Market Cap',
    category: 'widgets',
    edit,
    icon: AgoraIcon,
    save: () => null,
});
