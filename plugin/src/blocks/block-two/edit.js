import { __ } from '@wordpress/i18n';

const Edit = () => {
    return (
        <div>
            <p>{__('This is Block Two (Editor View).', 'my-plugin')}</p>
            <p>{__('The data will be fetched and displayed dynamically on the front end.', 'my-plugin')}</p>
        </div>
    );
};

export default Edit;
