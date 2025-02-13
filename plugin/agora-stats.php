<?php
/**
 * Plugin Name: Agora Stats
 * Plugin URI: https://github.com/Amatack/wordpressAgoraPlugin
 * Description: Shows agora statistics about your token.
 * Version: 1.0.2
 * Author: Amatack
 * Author URI: https://github.com/Amatack/
 * License: GPL2
 * Text Domain: agora-stats
 */
    
 if ( ! defined( 'ABSPATH' ) ) {
    exit;
    }

add_shortcode('etoken_price_data', 'price_data_shortcode_handler');
add_shortcode('etoken_supply', 'supply_shortcode_handler');
add_shortcode('etoken_market_cap', 'market_cap_shortcode_handler');
add_shortcode('etoken_total_txs', 'total_txs_shortcode_handler');

 function my_dynamic_block_plugin_register_blocks() {
    
    add_action('wp_ajax_save_etoken_id', 'save_etoken_id');
    add_action('wp_ajax_nopriv_save_etoken_id', 'save_etoken_id');
    
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
        'agora-stats/block-supply',
        array(
            'render_callback' => 'block_supply_render_callback',
        )
    );

    // Register block 3
    register_block_type(
        'agora-stats/block-market-cap',
        array(
            'render_callback' => 'block_marketCap_render_callback',
        )
    );

    // Register block 4

    register_block_type(
        'agora-stats/block-total-txs',
        array(
            'render_callback' => 'block_total_txs_render_callback',
        )
    );
}

function agora_stats_add_admin_page() {
    add_menu_page(
        'Agora Stats',              // Page title.
        'Agora Stats',              // Menu title.
        'manage_options',           // Ability required.
        'agora-stats',              // Unique Slug.
        'mi_admin_page',  // Function to render the page.
        plugin_dir_url( __FILE__ ) . 'src/assets/agoraImage.png',  // Icono del menú.
        20                        // Menu position.
    );
}
function mi_plugin_enqueue_styles() {

    // Enqueue the main configuration script
    wp_enqueue_script(
        'plugin-configuration', 
        plugin_dir_url(__FILE__) . 'includes/agora-stats-page.js', 
        array(), 
        null, 
        true // Load to bottom of page
    );

    // Pass the admin-ajax.php URL to the script
    wp_localize_script('plugin-configuration', 'mi_plugin_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php') // Ajax URL
    ));

    // Enqueue the style file
    wp_enqueue_style(
        'dashboard-page-style', 
        plugin_dir_url(__FILE__) . 'includes/dashboardPage.css'
    );
}

require_once plugin_dir_path(__FILE__) . 'includes/render.php';


add_action('init', 'my_dynamic_block_plugin_register_blocks');
add_action('admin_menu', 'agora_stats_add_admin_page');
//register and queue for the administration area
add_action('admin_enqueue_scripts', 'mi_plugin_enqueue_styles');

// Register the function in AJAX (for logged in and non logged in users)
add_action('wp_ajax_get_token_id_on_editor', 'get_token_id_on_editor');
add_action('wp_ajax_nopriv_get_token_id_on_editor', 'get_token_id_on_editor');

