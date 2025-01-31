<?php

function fetch_data_from_graphql() {
    $query = <<<GRAPHQL
    query TokenData {
        tokenData(tokenId: "faaecf2e79d897769ef6a0e8b5ee5dd5bb7daa5a632db677f254a94ae122c820", include: { lastPrice: true, supply: true, marketCap: true, totalTxs: true }) {
            lastPrice {
                minPrice
            }
            supply
            marketCap
            totalTxs
        }
    }
    GRAPHQL;
    
    $response = wp_remote_post('https://wordpressagoraplugin-production.up.railway.app/graphql', array(
        'headers' => array(
            'Content-Type' => 'application/json',
        ),
        'body' => json_encode(array('query' => $query)),
    ));

    if (is_wp_error($response)) {
        return null;
    }

    $data = wp_remote_retrieve_body($response);
    return json_decode($data);
}

// Variable global para almacenar los datos obtenidos
$global_data = null;

// Función para obtener los datos compartidos
function get_shared_data() {
    global $global_data;
    if ($global_data === null) {
        $global_data = fetch_data_from_graphql();
    }
    return $global_data;
}

// Render Callback para los bloques
function block_price_render_callback($attributes) {
    $data = get_shared_data();

    if (!$data || empty($data->data->tokenData)) {
        return '<p>No se encontraron datos para el token especificado.</p>';
    }

    $lastPrice = $data->data->tokenData->lastPrice;
    $output = '<div class="block-one">';
    if (!empty($lastPrice)) {
        $output .= '<p>Price: ' . esc_html($lastPrice->minPrice) . '</p>';
    } else {
        $output .= '<p>No data available for price.</p>';
    }
    $output .= '</div>';

    return $output;
}

function block_genesisInfo_render_callback($attributes) {
    $data = get_shared_data();

    $output = '<div class="block-two">';
    if (!empty($data->data->locations->results)) {
        foreach ($data->data->locations->results as $location) {
            $output .= '<p>' . esc_html($location->name) . '</p>';
        }
    } else {
        $output .= '<p>Failed to load data.</p>';
    }
    $output .= '</div>';

    return $output;
}

function block_supply_render_callback($attributes) {
    $data = get_shared_data();

    if (!$data || empty($data->data->tokenData)) {
        return '<p>No se encontraron datos para el token especificado.</p>';
    }

    $supply = $data->data->tokenData->supply;
    $output = '<div class="block-one">';
    if (!empty($supply)) {
        $output .= '<p>Supply: ' . esc_html($supply) . '</p>';
    } else {
        $output .= '<p>No data available for supply.</p>';
    }
    $output .= '</div>';

    return $output;
}

function block_marketCap_render_callback($attributes) {
    $data = get_shared_data();

    if (!$data || empty($data->data->tokenData)) {
        return '<p>No se encontraron datos para el token especificado.</p>';
    }

    $marketCap = $data->data->tokenData->marketCap;
    $output = '<div class="block-one">';
    if (!empty($marketCap)) {
        $output .= '<p>Market Cap: ' . esc_html($marketCap) . '</p>';
    } else {
        $output .= '<p>No data available for market cap.</p>';
    }
    $output .= '</div>';

    return $output;
}

function block_blockTotalTxs_render_callback($attributes){
    $data = get_shared_data();

    if (!$data || empty($data->data->tokenData)) {
        return '<p>No se encontraron datos para el token especificado.</p>';
    }

    $totalTxs = $data->data->tokenData->totalTxs;
    $output = '<div class="block-totalTxs">';
    if (!empty($totalTxs)) {
        $output .= '<p>Total Txs: ' . esc_html($totalTxs) . '</p>';
    } else {
        $output .= '<p>No data available for market cap.</p>';
    }
    $output .= '</div>';

    return $output;
}


function mi_admin_page()
{
    global $wpdb;

    // Nombre de la tabla (usa el prefijo definido en WordPress)
    $table_name = $wpdb->prefix . "agora_stats";

    // Verificar si la tabla existe
    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
        // Crear la tabla si no existe
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

    // Validar que el token tenga exactamente 64 caracteres
     if (strlen($token_id) !== 64) {
        wp_send_json_error('El token es inválido. Debe tener exactamente 64 caracteres.');
    }

    // Verificar si ya existe un registro en la tabla
    $existing_entry = $wpdb->get_var("SELECT id FROM $table_name LIMIT 1");

    if ($existing_entry) {
        // Si existe, actualizamos el registro
        $updated = $wpdb->update(
            $table_name,
            ['token_id' => $token_id],
            ['id' => $existing_entry],
            ['%s'],
            ['%d']
        );

        if ($updated !== false) {
            wp_send_json_success('Token actualizado correctamente.');
        } else {
            wp_send_json_error('Error al actualizar el token.');
        }
    } else {
        // Si no existe, insertamos un nuevo registro
        $inserted = $wpdb->insert(
            $table_name,
            ['token_id' => $token_id],
            ['%s']
        );

        if ($inserted) {
            wp_send_json_success('Token guardado correctamente.');
        } else {
            wp_send_json_error('Error al guardar el token.');
        }
    }
}