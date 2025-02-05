import { useEffect, useState } from '@wordpress/element';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RadioControl } from '@wordpress/components';

const Edit = ({ attributes, setAttributes }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const query = `
            query TokenData($tokenId: String!, $include: TokenDataIncludeInput!) {
                tokenData(tokenId: $tokenId, include: $include) {
                    lastPrice {
                        minPriceInXec
                        minPriceInUsd
                        minTokenOrder
                        minXecOrder
                    }
                }
            }
        `;

        const variables = {
            tokenId: "faaecf2e79d897769ef6a0e8b5ee5dd5bb7daa5a632db677f254a94ae122c820",
            include: {
                lastPrice: true,
            },
        };

        fetch('https://wordpressagoraplugin-production.up.railway.app/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, variables }),
        })
            .then((response) => response.json())
            .then((result) => {
                if (result.data && result.data.tokenData && result.data.tokenData.lastPrice) {
                    setData(result.data.tokenData.lastPrice);
                } else {
                    console.error("Invalid response structure:", result);
                }
            })
            .catch((error) => {
                console.error('Error fetching GraphQL data:', error);
            });
    }, []);

    // Verifica que los datos existen antes de desestructurar
    const { minXecOrder, minTokenOrder, minPriceInXec, minPriceInUsd } = data || {};

    return (
        <div>
            <h2>{attributes.number || "[Select Option]"}</h2>

            <InspectorControls>
                <PanelBody title="Data from Agora">
                    <RadioControl
                        label="Select price property"
                        selected={attributes.number}
                        options={[
                            { label: 'Min. Xec Order', value: minXecOrder || "N/A" },
                            { label: 'Min. Token Order', value: minTokenOrder || "N/A" },
                            { label: 'Min. Price In XEC', value: minPriceInXec || "N/A" },
                            { label: 'Min. Price In USD', value: minPriceInUsd || "N/A" },
                        ]}
                        onChange={(value) => setAttributes({ number: value })}
                    />
                </PanelBody>
            </InspectorControls>
        </div>
    );
};

export default Edit;
