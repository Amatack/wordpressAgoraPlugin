import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';

import AgoraIcon from '../../assets/agoraIcon';

registerBlockType('agora-stats/block-supply', {
    title: 'Supply',
    category: 'widgets',
    attributes: {
        textColor: { type: 'string', default: '#000000' },
        backgroundColor: { type: 'string', default: '#ffffff' },
        fontSize: { type: 'number', default: 16 },
        hasBorder: { type: 'boolean', default: false },
        isBold: { type: 'boolean', default: false },
        borderRadius: { type: 'number', default: 0}
    },
    edit,
    icon: AgoraIcon,
    save: () => null,
});
