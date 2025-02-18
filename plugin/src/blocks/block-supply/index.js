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
        propertyName: { type: 'string', default: '' },
        hasBorder: { type: 'boolean', default: false },
        isBold: { type: 'boolean', default: false },
        borderRadius: { type: 'number', default: 0},
        alignment: { type: 'string', default: 'left'}
    },
    edit,
    icon: AgoraIcon,
    save: () => null,
});
