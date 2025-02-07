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
        style: { color: textColor, backgroundColor, fontSize: `${fontSize}px`, border: hasBorder ? '2px solid black' : 'none', fontWeight: isBold ? 'bold' : 'normal', borderRadius: borderRadius + 'px', }
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
                        { value: textColor, onChange: (newColor) => setAttributes({ textColor: newColor }), label: __('Text color', 'text-domain') },
                        { value: backgroundColor, onChange: (newColor) => setAttributes({ backgroundColor: newColor }), label: __('Background color', 'text-domain') }
                    ]}/>
                    
                    <ToggleControl label={__('Border', 'text-domain')} checked={hasBorder} onChange={() => setAttributes({ hasBorder: !hasBorder })} />
                    <RangeControl
                        label="Border radius"
                        value={borderRadius}
                        onChange={(newRadius) => setAttributes({ borderRadius: newRadius })}
                        min={0}
                        max={50}
                    />
                    <ToggleControl label={__('Bold', 'text-domain')} checked={isBold} onChange={() => setAttributes({ isBold: !isBold })} />
                </PanelBody>
            </InspectorControls>
            <div {...blockProps}>
                <p>{attributes.number || "[Select Option]"}</p>
            </div>
        </div>
    );
};

export default Edit;
