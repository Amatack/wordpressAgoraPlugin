import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';

import AgoraIcon from '../../assets/agoraIcon';

registerBlockType('agora-stats/block-price', {
    title: 'Price',
    category: 'widgets',
    attributes: {
        textColor: { type: 'string', default: '#000000' },
        backgroundColor: { type: 'string', default: '#ffffff' },
        fontSize: { type: 'number', default: 16 },
        propertyName: { type: 'string', default: '' },
        number: { type: 'string', default: '[Select Option]' },
        hasBorder: { type: 'boolean', default: false },
        isBold: { type: 'boolean', default: false },
        borderRadius: { type: 'number', default: 0}
    },
    edit,
    icon: AgoraIcon,
    save: () => null, // Renderizado dinámico, no guardar salida en el cliente
});
