import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

registerBlockType('my-plugin/example-block', {
    title: __('Smile Block', 'my-plugin'),
    icon: 'smiley',
    category: 'common',
    attributes: {
        content: {
            type: 'string',
            source: 'html',
            selector: 'p',
        },
    },
    edit: ({ attributes, setAttributes }) => {
        const { content } = attributes;

        return (
            <RichText
                tagName="p"
                value={content}
                onChange={(value) => setAttributes({ content: value })}
                placeholder={__('Write something...', 'my-plugin')}
            />
        );
    },
    save: ({ attributes }) => {
        const { content } = attributes;
        return <RichText.Content tagName="p" value={content} />;
    },
});