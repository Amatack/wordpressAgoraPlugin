import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './edit';

registerBlockType('my-plugin/block-two', {
    title: __('Block Two', 'my-plugin'),
    description: __('A block that displays locations from the Rick and Morty API.', 'my-plugin'),
    category: 'widgets',
    icon: 'location-alt', // Puedes usar cualquier icono disponible en Dashicons
    supports: {
        html: false, // Deshabilitar la edición HTML
    },
    edit: Edit,
    save: () => null, // Renderizado dinámico en PHP
});
