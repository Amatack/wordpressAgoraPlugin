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

function mi_plugin_render_page()
{
    ?>
    <div class="wrap">
        <div class="container">
            <label class="title" for="texto">
                <h2>Token ID:</h2>
            </label>
            <input class="input-text" type="text" id="texto" placeholder="Enter tokenId">
        </div>
    </div>
    <?php
}