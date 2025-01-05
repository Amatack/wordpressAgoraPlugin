import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './edit';

import AgoraIcon from '../../assets/agoraIcon';

registerBlockType('agora-stats/block-genesis-info', {
    title: __('Block Two', 'agora-stats'),
    description: __('A block that displays locations from the Rick and Morty API.', 'agora-stats'),
    category: 'widgets',
    icon: AgoraIcon, // Puedes usar cualquier icono disponible en Dashicons
    supports: {
        html: false, // Deshabilitar la edición HTML
    },
    edit: Edit,
    save: () => null, // Renderizado dinámico en PHP
});
