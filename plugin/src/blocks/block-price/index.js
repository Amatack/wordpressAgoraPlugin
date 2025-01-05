import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';

import AgoraIcon from '../../assets/agoraIcon';

registerBlockType('agora-stats/block-price', {
    title: 'Price',
    category: 'widgets',
    edit,
    icon: AgoraIcon,
    save: () => null, // Renderizado dinámico, no guardar salida en el cliente
});
