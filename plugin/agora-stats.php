<?php
/**
 * Plugin Name: Agora Stats
 * Description: Shows agora statistics about your token.
 * Version: 0.1.0
 * Author: Amatack
 */

 if ( ! defined( 'ABSPATH' ) ) {
    exit;
    }

 function my_dynamic_block_plugin_register_blocks() {
    
    add_action('admin_menu', 'agora_stats_add_admin_page');
    
    wp_enqueue_script(
        'my-multiple-blocks-plugin',
        plugins_url( 'build/index.js', __FILE__ ),
        array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components' ),
        filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' )
    );

    // Register block 1
    register_block_type(
        'agora-stats/block-price',
        
        array(
            'render_callback' => 'block_price_render_callback',
        )
    );

    // Register block 2
    register_block_type(
        'agora-stats/block-genesis-info',
        array(
            'render_callback' => 'block_genesisInfo_render_callback',
        )
    );

    // Register block 3
    register_block_type(
        'agora-stats/block-supply',
        array(
            'render_callback' => 'block_supply_render_callback',
        )
    );

    // Register block 4
    register_block_type(
        'agora-stats/block-market-cap',
        array(
            'render_callback' => 'block_marketCap_render_callback',
        )
    );

    // Register block 5

    register_block_type(
        'agora-stats/block-total-txs',
        array(
            'render_callback' => 'block_blockTotalTxs_render_callback',
        )
    );
}

function agora_stats_add_admin_page() {
    add_menu_page(
        'Agora Stats',              // Título de la página.
        'Agora Stats',              // Título del menú.
        'manage_options',         // Capacidad requerida.
        'agora-stats',              // Slug único.
        'mi_plugin_render_page',  // Función para renderizar la página.
        plugin_dir_url( __FILE__ ) . 'src/assets/agoraImage.png',  // Icono del menú.
        20                        // Posición del menú.
    );
}

require_once plugin_dir_path(__FILE__) . 'includes/render.php';
add_action('init', 'my_dynamic_block_plugin_register_blocks');