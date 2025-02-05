import { useState, useEffect } from '@wordpress/element';
import { ToggleControl, PanelBody, FontSizePicker, RangeControl } from '@wordpress/components';
import { useBlockProps, InspectorControls, PanelColorSettings, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const Edit = ({attributes, setAttributes}) => {
    const {borderRadius, textColor, backgroundColor, fontSize, hasBorder, isBold } = attributes;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        const query = `
            query TokenData($tokenId: String!, $include: TokenDataIncludeInput!) {
                tokenData(tokenId: $tokenId, include: $include) {
                    supply
                }
            }
        `;

        const variables = {
            tokenId: "faaecf2e79d897769ef6a0e8b5ee5dd5bb7daa5a632db677f254a94ae122c820",
            include: {
                supply: true,
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

    const blockProps = useBlockProps({ 
        style: { color: textColor, backgroundColor, fontSize: `${fontSize}px`, border: hasBorder ? '2px solid black' : 'none', fontWeight: isBold ? 'bold' : 'normal', padding: '10px',borderRadius: borderRadius + 'px', }
    });

    if (loading) {
        return <p>{__('Loading data...', 'agora-stats')}</p>;
    }

    if (!data || !data.tokenData) {
        return <p>{__('No data available.', 'agora-stats')}</p>;
    }

    const { supply } = data.tokenData;

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
                <p>{supply}</p>
            </div>
        </>
    );
};

export default Edit;
