<?php
function fetch_data_from_graphql($query) {
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
function block_one_render_callback($attributes) {
    // Defining the GraphQL query
    $query = <<<GRAPHQL
    query TokenData {
        tokenData(tokenId: "faaecf2e79d897769ef6a0e8b5ee5dd5bb7daa5a632db677f254a94ae122c820", include: { lastPrice: true }) {
            lastPrice {
                price
            }
        }
    }
    GRAPHQL;

    // Use the fetch_data_from_graphql function to perform the query
    $data = fetch_data_from_graphql($query);

    // Validate the data obtained
    if (!$data || empty($data->data->tokenData)) {
        return '<p>No se encontraron datos para el token especificado.</p>';
    }

    // Extract the necessary data
    $lastPrice = $data->data->tokenData->lastPrice;

    // Generate the dynamic content of the block
    $output = '<div class="block-one">';
    if (!empty($lastPrice)) {
        $output .= '<p>Price: ' . esc_html($lastPrice->price) . '</p>';
    } else {
        $output .= '<p>No data available for price.</p>';
    }
    $output .= '</div>';

    return $output;
}


function block_two_render_callback($attributes) {
    $query = <<<GRAPHQL
    {
        locations {
            results {
                name
            }
        }
    }
    GRAPHQL;

    $data = fetch_data_from_graphql($query);

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
