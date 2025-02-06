import { useState, useEffect } from '@wordpress/element';
import { ToggleControl, PanelBody, FontSizePicker, RangeControl } from '@wordpress/components';
import { useBlockProps, InspectorControls, PanelColorSettings, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const Edit = ({attributes, setAttributes}) => {
    const {borderRadius, textColor, backgroundColor, fontSize, hasBorder, isBold } = attributes;

    const [data, setData] = useState(null);
    const [tokenId, setTokenId] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // 1️⃣ Obtener el token_id desde el backend
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
                    totalTxs
                }
            }
        `;

        const variables = {
            tokenId:  tokenId,
            include: {
                totalTxs: true,
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
    }, [tokenId]);

    const blockProps = useBlockProps({ 
        style: { color: textColor, backgroundColor, fontSize: `${fontSize}px`, border: hasBorder ? '2px solid black' : 'none', fontWeight: isBold ? 'bold' : 'normal', padding: '10px',borderRadius: borderRadius + 'px', }
    });

    if (loading) {
        return <p>{__('Loading data...', 'agora-stats')}</p>;
    }

    if (!data || !data.tokenData) {
        return <p>{__('No data available.', 'agora-stats')}</p>;
    }
    const { totalTxs } = data.tokenData;

    return (
        <>
            <InspectorControls>
                    <PanelBody title={__('Ajustes de Estilo', 'text-domain')}>
                        <PanelColorSettings colorSettings={[
                            { value: textColor, onChange: (newColor) => setAttributes({ textColor: newColor }), label: __('Color de texto', 'text-domain') },
                            { value: backgroundColor, onChange: (newColor) => setAttributes({ backgroundColor: newColor }), label: __('Color de fondo', 'text-domain') }
                        ]}/>
                        <FontSizePicker value={fontSize} onChange={(newSize) => setAttributes({ fontSize: newSize })} min={10} max={50} />
                        <br />
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
                <p>{totalTxs}</p>
            </div>
        </>
    );
};

export default Edit;
