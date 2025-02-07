<?php

function fetch_data_from_graphql() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'agora_stats';

    // Get token_id from database
    $token_id = $wpdb->get_var("SELECT token_id FROM $table_name LIMIT 1");

    // If not found, display message
    if (!$token_id) {
        return '<p>No token_id found.</p>';
    }

    $query = sprintf(<<<GRAPHQL
    query TokenData {
        tokenData(tokenId: "%s", include: { lastPrice: true, supply: true, marketCap: true, totalTxs: true }) {
            lastPrice {
                minXecOrder
                minTokenOrder
                minPriceInXec
                minPriceInUsd
            }
            supply
            marketCap
            totalTxs
        }
    }
    GRAPHQL, $token_id);
    
    $response = wp_remote_post('https://wordpressagoraplugin-production.up.railway.app/graphql', array(
        'headers' => array(
            'Content-Type' => 'application/json',
        ),
        'body' => json_encode(array('query' => $query)),
        'timeout' => 10, // Agregamos un tiempo de espera para evitar bloqueos
    ));

    if (is_wp_error($response)) {
        error_log('GraphQL request failed: ' . $response->get_error_message());
        return null;
    }
    
    $data = wp_remote_retrieve_body($response);
    $decoded_data = json_decode($data, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        error_log('JSON decode error: ' . json_last_error_msg());
        return null;
    }

    return $decoded_data;
}

function get_shared_data() {
    $cached_data = get_transient('graphql_token_data');

    global $wpdb;
    $table_name = $wpdb->prefix . 'agora_stats';
    $current_token_id = $wpdb->get_var("SELECT token_id FROM $table_name LIMIT 1");

    if ($cached_data === false || !isset($cached_data['token_id']) || $cached_data['token_id'] !== $current_token_id) {
        $data = fetch_data_from_graphql();
        if ($data !== null) {
            $cached_data = [
                'token_id' => $current_token_id,
                'data' => $data
            ];
            set_transient('graphql_token_data', $cached_data, 300);
        }
    }

    return $cached_data ? $cached_data['data'] : null;
}



// Render Callback for the blocks
function block_price_render_callback($attributes) {
    $data = get_shared_data();

    if (!is_array($data) || empty($data['data']['tokenData'])) {
        return '<p>No data found for the specified token.</p>';
    }
    $lastPrice = $data['data']['tokenData']['lastPrice'];

    $output = '';
    $priceKey = isset($attributes['propertyName']) ? $attributes['propertyName'] : ''; // Valor por defecto

    if (is_array($lastPrice) && isset($lastPrice[$priceKey])) {
        $priceValue = $lastPrice[$priceKey]; // Acceso dinámico en array
    } else {
        $priceValue = 'N/A'; // Valor por defecto si no existe
    }

    $output = '<p>' . esc_html($priceValue) . '</p>';

    $textColor = isset($attributes['textColor']) ? esc_attr($attributes['textColor']) : '#000000';
    $backgroundColor = isset($attributes['backgroundColor']) ? esc_attr($attributes['backgroundColor']) : '#ffffff';
    $fontSize = isset($attributes['fontSize']) ? intval($attributes['fontSize']) : 16;
    $hasBorder = isset($attributes['hasBorder']) && $attributes['hasBorder'] ? '2px solid black' : 'none';
    $isBold = isset($attributes['isBold']) && $attributes['isBold'] ? 'bold' : 'normal';
    $borderRadius = isset($attributes['borderRadius']) ? intval($attributes['borderRadius']) : 0; 
    return sprintf(
        '<div cclass="block-lastPrice" style="color: %s; background-color: %s; font-size: %dpx; border: %s; font-weight: %s; border-radius: %dpx;">
            %s
        </div>',
        $textColor,
        $backgroundColor,
        $fontSize,
        $hasBorder,
        $isBold,
        $borderRadius,
        $output
    );
}


function block_supply_render_callback($attributes) {
    $data = get_shared_data();
    error_log(print_r($data, true));

    if (!is_array($data) || empty($data['data']['tokenData'])) {
        return '<p>No data found for the specified token.</p>';
    }
    
    $supply = $data['data']['tokenData']['supply'];
    $output = '';

    if (!empty($supply)) {
        $output .= '<p>' . esc_html($supply) . '</p>';
    } else {
        $output .= '<p>No data available for supply.</p>';
    }

    $textColor = isset($attributes['textColor']) ? esc_attr($attributes['textColor']) : '#000000';
    $backgroundColor = isset($attributes['backgroundColor']) ? esc_attr($attributes['backgroundColor']) : '#ffffff';
    $fontSize = isset($attributes['fontSize']) ? intval($attributes['fontSize']) : 16;
    $hasBorder = isset($attributes['hasBorder']) && $attributes['hasBorder'] ? '2px solid black' : 'none';
    $isBold = isset($attributes['isBold']) && $attributes['isBold'] ? 'bold' : 'normal';
    $borderRadius = isset($attributes['borderRadius']) ? intval($attributes['borderRadius']) : 0; 
    return sprintf(
        '<div class="block-one" style="color: %s; background-color: %s; font-size: %dpx; border: %s; font-weight: %s; border-radius: %dpx;">
            %s
        </div>',
        $textColor,
        $backgroundColor,
        $fontSize,
        $hasBorder,
        $isBold,
        $borderRadius,
        $output
    );
}


function block_marketCap_render_callback($attributes) {
    $data = get_shared_data();

    if (!is_array($data) || empty($data['data']['tokenData'])) {
        return '<p>No data found for the specified token.</p>';
    }

    $marketCap = $data['data']['tokenData']['marketCap'];
    
    $output = '';
    if (!empty($marketCap)) {
        $output .= '<p>' . esc_html($marketCap) . '</p>';
    } else {
        $output .= '<p>No data available for market cap.</p>';
    }
    
    $textColor = isset($attributes['textColor']) ? esc_attr($attributes['textColor']) : '#000000';
    $backgroundColor = isset($attributes['backgroundColor']) ? esc_attr($attributes['backgroundColor']) : '#ffffff';
    $fontSize = isset($attributes['fontSize']) ? intval($attributes['fontSize']) : 16;
    $hasBorder = isset($attributes['hasBorder']) && $attributes['hasBorder'] ? '2px solid black' : 'none';
    $isBold = isset($attributes['isBold']) && $attributes['isBold'] ? 'bold' : 'normal';
    $borderRadius = isset($attributes['borderRadius']) ? intval($attributes['borderRadius']) : 0; 
    return sprintf(
        '<div class="block-market-cap" style="color: %s; background-color: %s; font-size: %dpx; border: %s; font-weight: %s; border-radius: %dpx;">
            %s
        </div>',
        $textColor,
        $backgroundColor,
        $fontSize,
        $hasBorder,
        $isBold,
        $borderRadius,
        $output
    );
}

function block_blockTotalTxs_render_callback($attributes){
    $data = get_shared_data();
    error_log(print_r($data, true));
    if (!is_array($data) || empty($data['data']['tokenData'])) {
        return '<p>No data found for the specified token.</p>';
    }
    $totalTxs = $data['data']['tokenData']['totalTxs'];
    $output = '';
    if (!empty($totalTxs)) {
        $output .= '<p>' . esc_html($totalTxs) . '</p>';
    } else {
        $output .= '<p>No data available for totalTxs.</p>';
    }

    $textColor = isset($attributes['textColor']) ? esc_attr($attributes['textColor']) : '#000000';
    $backgroundColor = isset($attributes['backgroundColor']) ? esc_attr($attributes['backgroundColor']) : '#ffffff';
    $fontSize = isset($attributes['fontSize']) ? intval($attributes['fontSize']) : 16;
    $hasBorder = isset($attributes['hasBorder']) && $attributes['hasBorder'] ? '2px solid black' : 'none';
    $isBold = isset($attributes['isBold']) && $attributes['isBold'] ? 'bold' : 'normal';
    $borderRadius = isset($attributes['borderRadius']) ? intval($attributes['borderRadius']) : 0; 
    return sprintf(
        '<div class="block-totalTxs" style="color: %s; background-color: %s; font-size: %dpx; border: %s; font-weight: %s; border-radius: %dpx;">
            %s
        </div>',
        $textColor,
        $backgroundColor,
        $fontSize,
        $hasBorder,
        $isBold,
        $borderRadius,
        $output
    );
}


//On Editor
function mi_admin_page()
{
    global $wpdb;

    // Table name (use the prefix defined in WordPress)
    $table_name = $wpdb->prefix . "agora_stats";

    // Check if table exists
    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
        // Create table if it does not exist
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            id BIGINT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            token_id VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    
    ?>
        <div class="wrap">
            <div class="container">
                <label class="title" for="texto">
                    <h2>Token ID: </h2>
                </label>
                <input class="input-text" type="text" id="texto" placeholder="Enter tokenId">
            </div>
            <div class="button-container">
                <button class="center-button" id="save-button">SAVE</button>
            </div>
    

    
        </div>
    <?php
}

function save_etoken_id() {
    global $wpdb;

    $table_name = $wpdb->prefix . "agora_stats";

    if (!isset($_POST['token_id'])) {
        wp_send_json_error('No se recibió ningún token.');
    }

    $token_id = sanitize_text_field($_POST['token_id']);

    // Validate that the token has exactly 64 characters
     if (strlen($token_id) !== 64) {
        wp_send_json_error('The token id is invalid. It must be exactly 64 characters long.');
    }

    // Check if a record already exists in the table
    $existing_entry = $wpdb->get_var("SELECT id FROM $table_name LIMIT 1");

    if ($existing_entry) {
        // If it exists, we update the record
        $updated = $wpdb->update(
            $table_name,
            ['token_id' => $token_id],
            ['id' => $existing_entry],
            ['%s'],
            ['%d']
        );

        if ($updated !== false) {
            wp_send_json_success('Token updated successfully.');
        } else {
            wp_send_json_error('Error updating token.');
        }
    } else {
        // If it does not exist, we insert a new record
        $inserted = $wpdb->insert(
            $table_name,
            ['token_id' => $token_id],
            ['%s']
        );

        if ($inserted) {
            wp_send_json_success('Token saved successfully.');
        } else {
            wp_send_json_error('Error saving token.');
        }
    }
}

function get_token_id_on_editor() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'agora_stats';
    $result = $wpdb->get_var("SELECT token_id FROM $table_name LIMIT 1");

    if ($result) {
        wp_send_json_success(['token_id' => $result]);
    } else {
        wp_send_json_error(['message' => 'No token found']);
    }
    wp_die();
}