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
        const possibleURLs = [
          window.location.origin + '/wordpress/wp-admin/admin-ajax.php?action=get_token_id_on_editor',
          window.location.origin + '/wp-admin/admin-ajax.php?action=get_token_id_on_editor'
        ];
    
        const testUrl = (index = 0) => {
          if (index >= possibleURLs.length) {
            console.error("Failed to get token_id after trying several URLs.");
            setLoading(false);
            return;
          }
    
          const urlActual = possibleURLs[index];
    
          fetch(urlActual)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Error ${response.status} al intentar ${urlActual}`); // Mejora el manejo de errores
              }
              return response.json();
            })
            .then(result => {
              if (result.success && result.data.token_id) {
                setTokenId(result.data.token_id);
                setLoading(false);
              } else {
                console.error(`Error getting token_id from ${urlActual}:`, result);
                testUrl(index + 1); // Test next URL
              }
            })
            .catch(error => {
              console.error(`Error in AJAX request to ${urlActual}:`, error);
              testUrl(index + 1); // Test next URL
            });
        };
    
        testUrl(); 
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
        style: { color: textColor, backgroundColor, fontSize: `${fontSize}px`, border: hasBorder ? '2px solid black' : 'none', fontWeight: isBold ? 'bold' : 'normal', borderRadius: borderRadius + 'px', }
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
