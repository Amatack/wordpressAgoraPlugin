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
            supply {
                minimalist
                complete
            }
            marketCap {
                minimalist
                complete
            }
            totalTxs {
                minimalist
                complete
            }
        }
    }
    GRAPHQL, $token_id);
    
    $response = wp_remote_post('https://wordpressagoraplugin-production.up.railway.app/graphql', array(
        'headers' => array(
            'Content-Type' => 'application/json',
        ),
        'body' => json_encode(array('query' => $query)),
        'timeout' => 10, // we add a waiting time to avoid blockages
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
function block_price_render_callback($attributes, $shortcodeAtributes, $propertyName) {
    $data = get_shared_data();

    if (!is_array($data) || empty($data['data']['tokenData'])) {
        return '<p>No data found for the specified token.</p>';
    }
    $lastPrice = $data['data']['tokenData']['lastPrice'];

    $output = '';
    $priceValue = '';
    $priceKey = isset($attributes['propertyName']) 
    ? $attributes['propertyName'] 
    : $propertyName; // default value

    if (is_array($lastPrice) && isset($lastPrice[$priceKey])) {
        $priceValue = $lastPrice[$priceKey]; // Dynamic array access
    } else {
        $priceValue = 'N/A'; // Default value if not exists
    }

    $output = '<p>' . esc_html($priceValue) . '</p>';
    
    $alignment = isset($attributes['alignment']) 
    ? esc_attr($attributes['alignment']) 
    : (isset($shortcodeAtributes['alignment']) ? esc_attr($shortcodeAtributes['alignment']) : 'left');

    $textColor = isset($attributes['textColor']) 
    ? esc_attr($attributes['textColor']) 
    : (isset($shortcodeAtributes['textcolor']) ? esc_attr($shortcodeAtributes['textcolor']) : '#000000');

    $backgroundColor = isset($attributes['backgroundColor']) 
    ? esc_attr($attributes['backgroundColor']) 
    : (isset($shortcodeAtributes['backgroundcolor']) ? esc_attr($shortcodeAtributes['backgroundcolor']) : '#ffffff');
    
    $fontSize = isset($attributes['fontSize']) 
    ? esc_attr($attributes['fontSize']) 
    : (isset($shortcodeAtributes['fontsize']) ? esc_attr($shortcodeAtributes['fontsize']) : '16');

    $hasBorder = isset($attributes['hasBorder']) 
    ? esc_attr($attributes['hasBorder']) 
    : (isset($shortcodeAtributes['hasborder']) ? esc_attr($shortcodeAtributes['hasborder']) : 'none');

    $isBold = isset($attributes['isBold']) 
    ? esc_attr($attributes['isBold']) 
    : (isset($shortcodeAtributes['isbold']) ? esc_attr($shortcodeAtributes['isbold']) : 'normal');

    $borderRadius = isset($attributes['borderRadius']) 
    ? esc_attr($attributes['borderRadius']) 
    : (isset($shortcodeAtributes['borderradius']) ? esc_attr($shortcodeAtributes['borderradius']) : '0');

    $block_content = sprintf(
        '<div class="block-lastPrice" style="text-align: %s;color: %s; background-color: %s; font-size: %dpx; border: %s; font-weight: %s; border-radius: %dpx;">
            %s
        </div>',
        $alignment,
        $textColor,
        $backgroundColor,
        $fontSize,
        $hasBorder,
        $isBold,
        $borderRadius,
        $output
    );
    return $block_content ;
}

function price_data_shortcode_handler($atts) {
    $atts = shortcode_atts(
        array(
            'alignment' => 'left',
            'textcolor' => '', 
            'backgroundcolor' => '',
            'fontsize' => "16",
            'hasborder' => false,
            'isbold' => false,
            'borderradius' => "0",
            'priceproperty' => "minXecOrder",
        ),
        array_change_key_case($atts, CASE_LOWER) // Convert atributtes to lower case
    );

    $propertyName = $atts['priceproperty'];
    return block_price_render_callback($atts, $atts, $propertyName);
}

function block_supply_render_callback($attributes, $shortcodeAtributes, $propertyName) {
    $data = get_shared_data();
    error_log('propertyName: ');
    if (isset($attributes['propertyName'])) {
        if (is_array($attributes['propertyName'])) {
            error_log("propertyName es un array: " . print_r($attributes['propertyName'], true));
        } else {
            error_log("propertyName NO es un array: " . var_export($attributes['propertyName'], true));
        }
    } else {
        error_log("La clave 'propertyName' no está definida en \$attributes.");
    }
    if (!is_array($data) || empty($data['data']['tokenData'])) {
        return '<p>No data found for the specified token.</p>';
    }
    
    $supply = $data['data']['tokenData']['supply'];
    $output = '';
    $supplyValue = '';
    
    $supplyKey = isset($attributes['propertyName'])
    ? $attributes['propertyName'] 
    : $propertyName; // default value

    if ( is_scalar($supplyKey) && isset($supply[(string) $supplyKey])) {
        $supplyValue = $supply[(string) $supplyKey]; // Convert to string for security
    } else {
        error_log('Executed here');
        $supplyValue = 'N/A';
    }

    $output = '<p>' . esc_html($supplyValue) . '</p>';
    $alignment = isset($attributes['alignment']) 
    ? esc_attr($attributes['alignment']) 
    : (isset($shortcodeAtributes['alignment']) ? esc_attr($shortcodeAtributes['alignment']) : 'left');

    $textColor = isset($attributes['textColor']) 
    ? esc_attr($attributes['textColor']) 
    : (isset($shortcodeAtributes['textcolor']) ? esc_attr($shortcodeAtributes['textcolor']) : '#000000');

    $backgroundColor = isset($attributes['backgroundColor']) 
    ? esc_attr($attributes['backgroundColor']) 
    : (isset($shortcodeAtributes['backgroundcolor']) ? esc_attr($shortcodeAtributes['backgroundcolor']) : '#ffffff');
    
    $fontSize = isset($attributes['fontSize']) 
    ? esc_attr($attributes['fontSize']) 
    : (isset($shortcodeAtributes['fontsize']) ? esc_attr($shortcodeAtributes['fontsize']) : '16');

    $hasBorder = isset($attributes['hasBorder']) 
    ? esc_attr($attributes['hasBorder']) 
    : (isset($shortcodeAtributes['hasborder']) ? esc_attr($shortcodeAtributes['hasborder']) : 'none');

    $isBold = isset($attributes['isBold']) 
    ? esc_attr($attributes['isBold']) 
    : (isset($shortcodeAtributes['isbold']) ? esc_attr($shortcodeAtributes['isbold']) : 'normal');

    $borderRadius = isset($attributes['borderRadius']) 
    ? esc_attr($attributes['borderRadius']) 
    : (isset($shortcodeAtributes['borderradius']) ? esc_attr($shortcodeAtributes['borderradius']) : '0');

    $block_content = sprintf(
        '<div class="block-one" style="text-align: %s; color: %s; background-color: %s; font-size: %dpx; border: %s; font-weight: %s; border-radius: %dpx;">
            %s
        </div>',
        $alignment,
        $textColor,
        $backgroundColor,
        $fontSize,
        $hasBorder,
        $isBold,
        $borderRadius,
        $output
    );
    return $block_content ;
}

function supply_shortcode_handler($atts) {
    $atts = shortcode_atts(
        array(
            'alignment' => 'left',
            'textcolor' => '', 
            'backgroundcolor' => '',
            'fontsize' => "16",
            'hasborder' => false,
            'isbold' => false,
            'borderradius' => "0",
            'displaymode' => "complete"
        ),
        array_change_key_case($atts, CASE_LOWER) // Convert atributtes to lower case
    );

    $propertyName = $atts['displaymode'];
    return block_supply_render_callback($atts, $atts, $propertyName);
}

function block_market_cap_render_callback($attributes, $shortcodeAtributes, $propertyName) {
    $data = get_shared_data();

    if (!is_array($data) || empty($data['data']['tokenData'])) {
        return '<p>No data found for the specified token.</p>';
    }

    $marketCap = $data['data']['tokenData']['marketCap'];
    $output = '';
    $marketCapValue = '';

    $marketCapKey = isset($attributes['propertyName'])
    ? $attributes['propertyName'] 
    : $propertyName; 

    if ( is_scalar($marketCapKey) && isset($marketCap[(string) $marketCapKey])) {
        $marketCapValue = $marketCap[(string) $marketCapKey]; 
    } else {
        error_log('Executed here');
        $marketCapValue = 'N/A';
    }
    $output = '<p>' . esc_html($marketCapValue) . '</p>';
    $alignment = isset($attributes['alignment']) 
    ? esc_attr($attributes['alignment']) 
    : (isset($shortcodeAtributes['alignment']) ? esc_attr($shortcodeAtributes['alignment']) : 'left');

    $textColor = isset($attributes['textColor']) 
    ? esc_attr($attributes['textColor']) 
    : (isset($shortcodeAtributes['textcolor']) ? esc_attr($shortcodeAtributes['textcolor']) : '#000000');

    $backgroundColor = isset($attributes['backgroundColor']) 
    ? esc_attr($attributes['backgroundColor']) 
    : (isset($shortcodeAtributes['backgroundcolor']) ? esc_attr($shortcodeAtributes['backgroundcolor']) : '#ffffff');
    
    $fontSize = isset($attributes['fontSize']) 
    ? esc_attr($attributes['fontSize']) 
    : (isset($shortcodeAtributes['fontsize']) ? esc_attr($shortcodeAtributes['fontsize']) : '16');

    $hasBorder = isset($attributes['hasBorder']) 
    ? esc_attr($attributes['hasBorder']) 
    : (isset($shortcodeAtributes['hasborder']) ? esc_attr($shortcodeAtributes['hasborder']) : 'none');

    $isBold = isset($attributes['isBold']) 
    ? esc_attr($attributes['isBold']) 
    : (isset($shortcodeAtributes['isbold']) ? esc_attr($shortcodeAtributes['isbold']) : 'normal');

    $borderRadius = isset($attributes['borderRadius']) 
    ? esc_attr($attributes['borderRadius']) 
    : (isset($shortcodeAtributes['borderradius']) ? esc_attr($shortcodeAtributes['borderradius']) : '0');

    $block_content = sprintf(
        '<div class="block-one" style="text-align: %s; color: %s; background-color: %s; font-size: %dpx; border: %s; font-weight: %s; border-radius: %dpx;">
            %s
        </div>',
        $alignment,
        $textColor,
        $backgroundColor,
        $fontSize,
        $hasBorder,
        $isBold,
        $borderRadius,
        $output
    );
    return $block_content ;
}

function market_cap_shortcode_handler($atts) {
    $atts = shortcode_atts(
        array(
            'alignment' => 'left',
            'textcolor' => '', 
            'backgroundcolor' => '',
            'fontsize' => "16",
            'hasborder' => false,
            'isbold' => false,
            'borderradius' => "0",
            'displaymode' => "complete"
        ),
        array_change_key_case($atts, CASE_LOWER) // Convert atributtes to lower case
    );

    $propertyName = $atts['displaymode'];
    return block_market_cap_render_callback($atts, $atts, $propertyName);
}

function block_total_txs_render_callback($attributes, $shortcodeAtributes, $propertyName){
    $data = get_shared_data();
    error_log(print_r($data, true));
    if (!is_array($data) || empty($data['data']['tokenData'])) {
        return '<p>No data found for the specified token.</p>';
    }
    $totalTxs = $data['data']['tokenData']['totalTxs'];
    $output = '';
    $totalTxsValue = '';

    $totalTxsKey = isset($attributes['propertyName'])
    ? $attributes['propertyName'] 
    : $propertyName; 
    
    if ( is_scalar($totalTxsKey) && isset($totalTxs[(string) $totalTxsKey])) {
        $totalTxsValue = $totalTxs[(string) $totalTxsKey]; 
    } else {
        error_log('Executed here');
        $totalTxsValue = 'N/A';
    }
    $output = '<p>' . esc_html($totalTxsValue) . '</p>';
    $alignment = isset($attributes['alignment']) 
    ? esc_attr($attributes['alignment']) 
    : (isset($shortcodeAtributes['alignment']) ? esc_attr($shortcodeAtributes['alignment']) : 'left');

    $textColor = isset($attributes['textColor']) 
    ? esc_attr($attributes['textColor']) 
    : (isset($shortcodeAtributes['textcolor']) ? esc_attr($shortcodeAtributes['textcolor']) : '#000000');

    $backgroundColor = isset($attributes['backgroundColor']) 
    ? esc_attr($attributes['backgroundColor']) 
    : (isset($shortcodeAtributes['backgroundcolor']) ? esc_attr($shortcodeAtributes['backgroundcolor']) : '#ffffff');
    
    $fontSize = isset($attributes['fontSize']) 
    ? esc_attr($attributes['fontSize']) 
    : (isset($shortcodeAtributes['fontsize']) ? esc_attr($shortcodeAtributes['fontsize']) : '16');

    $hasBorder = isset($attributes['hasBorder']) 
    ? esc_attr($attributes['hasBorder']) 
    : (isset($shortcodeAtributes['hasborder']) ? esc_attr($shortcodeAtributes['hasborder']) : 'none');

    $isBold = isset($attributes['isBold']) 
    ? esc_attr($attributes['isBold']) 
    : (isset($shortcodeAtributes['isbold']) ? esc_attr($shortcodeAtributes['isbold']) : 'normal');

    $borderRadius = isset($attributes['borderRadius']) 
    ? esc_attr($attributes['borderRadius']) 
    : (isset($shortcodeAtributes['borderradius']) ? esc_attr($shortcodeAtributes['borderradius']) : '0');

    $block_content = sprintf(
        '<div class="block-total-txs" style="text-align: %s;color: %s; background-color: %s; font-size: %dpx; border: %s; font-weight: %s; border-radius: %dpx;">
            %s
        </div>',
        $alignment,
        $textColor,
        $backgroundColor,
        $fontSize,
        $hasBorder,
        $isBold,
        $borderRadius,
        $output
    );
    return $block_content ;
}



function total_txs_shortcode_handler($atts) {
    $atts = shortcode_atts(
        array(
            'alignment' => '',
            'textcolor' => '', 
            'backgroundcolor' => '',
            'fontsize' => "16",
            'hasborder' => false,
            'isbold' => false,
            'borderradius' => "0",
            'displaymode' => "complete"
        ),
        array_change_key_case($atts, CASE_LOWER) // Convert atributtes to lower case
    );


    $propertyName = $atts['displaymode'];
    return block_total_txs_render_callback($atts, $atts, $propertyName);
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