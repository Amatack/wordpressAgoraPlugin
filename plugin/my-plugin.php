<?php
/**
 * Plugin Name: Plugin
 * Description: A custom plugin with Gutenberg blocks.
 * Version: 1.0
 * Author: Your Name
 */

function my_plugin_enqueue_block_editor_assets() {
    wp_enqueue_script(
        'my-plugin-blocks',
        plugins_url('build/index.js', __FILE__),
        [ 'wp-blocks', 'wp-element', 'wp-editor' ],
        filemtime(plugin_dir_path(__FILE__) . 'build/index.js')
    );

    wp_enqueue_style(
        'my-plugin-blocks-editor',
        plugins_url('build/index.css', __FILE__),
        [ 'wp-edit-blocks' ],
        filemtime(plugin_dir_path(__FILE__) . 'build/index.css')
    );
}
add_action('enqueue_block_editor_assets', 'my_plugin_enqueue_block_editor_assets');
