import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';

import AgoraIcon from '../../assets/agoraIcon';

registerBlockType('my-plugin/block-one', {
    title: 'Block One',
    category: 'widgets',
    edit,
    icon: AgoraIcon,
    save: () => null, // Renderizado dinámico, no guardar salida en el cliente
});
