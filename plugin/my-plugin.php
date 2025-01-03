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

    wp_enqueue_script(
        'my-multiple-blocks-plugin',
        plugins_url( 'build/index.js', __FILE__ ),
        array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components' ),
        filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' )
    );

    // Register block 1
    register_block_type(
        'my-plugin/block-one',
        
        array(
            'render_callback' => 'block_one_render_callback',
        )
    );

    // Register block 2
    register_block_type(
        'my-plugin/block-two',
        array(
            'render_callback' => 'block_two_render_callback',
        )
    );
}
require_once plugin_dir_path(__FILE__) . 'includes/render.php';
add_action('init', 'my_dynamic_block_plugin_register_blocks');





