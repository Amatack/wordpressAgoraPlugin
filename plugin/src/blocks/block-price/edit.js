import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const Edit = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const query = `
            query TokenData($tokenId: String!, $include: TokenDataIncludeInput!) {
                tokenData(tokenId: $tokenId, include: $include) {
                    lastPrice {
                        minPriceInXec
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
                setData(result.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching GraphQL data:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>{__('Loading data...', 'agora-stats')}</p>;
    }

    if (!data || !data.tokenData) {
        return <p>{__('No data available.', 'agora-stats')}</p>;
    }

    const { lastPrice } = data.tokenData;

    return (
        <div>
            <p>{__('Price:', 'agora-stats')} {lastPrice.minPriceInXec}</p>
        </div>
    );
};

export default Edit;
