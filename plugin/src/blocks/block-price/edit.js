import { useEffect, useState } from '@wordpress/element';
import { ToggleControl, PanelBody, FontSizePicker,RadioControl, RangeControl } from '@wordpress/components';
import { useBlockProps, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const Edit = ({ attributes, setAttributes }) => {
    const {borderRadius, textColor, backgroundColor, fontSize, hasBorder, isBold } = attributes;
    const [data, setData] = useState(null);
    const [tokenId, setTokenId] = useState(null);
    
    const handleChange = (value) => {
        let propertyName = "";
    
        if (value === minXecOrder) propertyName = "minXecOrder";
        if (value === minTokenOrder) propertyName = "minTokenOrder";
        if (value === minPriceInXec) propertyName = "minPriceInXec";
        if (value === minPriceInUsd) propertyName = "minPriceInUsd";
    
        setAttributes({ number: value , propertyName: propertyName});
    };

    useEffect(() => {
        // Obtener el token_id desde el backend
        fetch(window.location.origin+'/wordpress/wp-admin/admin-ajax.php?action=get_token_id_on_editor')
            .then(response => response.json())
            .then(result => {
                if (result.success && result.data.token_id) {
                    setTokenId(result.data.token_id);
                } else {
                    console.error("Error obteniendo token_id:", result);
                    setLoading(false);
                }
            })
            .catch(error => {
                console.error("Error en la petición AJAX:", error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {

        if (!tokenId) return;

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
            tokenId:  tokenId,
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
    }, [tokenId]);

    const blockProps = useBlockProps({ 
        style: { color: textColor, backgroundColor, fontSize: `${fontSize}px`, border: hasBorder ? '2px solid black' : 'none', fontWeight: isBold ? 'bold' : 'normal', padding: '10px',borderRadius: borderRadius + 'px', }
    });

    const { minXecOrder, minTokenOrder, minPriceInXec, minPriceInUsd } = data || {};

    return (
        <div>
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
                        onChange={handleChange}
                    />
                    <FontSizePicker value={fontSize} onChange={(newSize) => setAttributes({ fontSize: newSize })} min={10} max={50} />
                    <PanelColorSettings colorSettings={[
                        { value: textColor, onChange: (newColor) => setAttributes({ textColor: newColor }), label: __('Color de texto', 'text-domain') },
                        { value: backgroundColor, onChange: (newColor) => setAttributes({ backgroundColor: newColor }), label: __('Color de fondo', 'text-domain') }
                    ]}/>
                    
                    <ToggleControl label={__('Borde', 'text-domain')} checked={hasBorder} onChange={() => setAttributes({ hasBorder: !hasBorder })} />
                    <RangeControl
                        label="Radio del borde"
                        value={borderRadius}
                        onChange={(newRadius) => setAttributes({ borderRadius: newRadius })}
                        min={0}
                        max={50}
                    />
                    <ToggleControl label={__('Negrita', 'text-domain')} checked={isBold} onChange={() => setAttributes({ isBold: !isBold })} />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <p>{attributes.number || "[Select Option]"}</p>
            </div>
        </div>
    );
};

export default Edit;
