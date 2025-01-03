import { registerBlockType } from '@wordpress/blocks';
import edit from './edit';

registerBlockType('my-plugin/block-one', {
    title: 'Block One',
    category: 'widgets',
    edit,
    save: () => null, // Renderizado dinámico, no guardar salida en el cliente
});
