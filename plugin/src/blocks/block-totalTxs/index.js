import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';

import AgoraIcon from '../../assets/agoraIcon';

registerBlockType('agora-stats/block-total-txs', {
    title: 'Total Txs',
    category: 'widgets',
    edit,
    icon: AgoraIcon,
    save: () => null,
});
