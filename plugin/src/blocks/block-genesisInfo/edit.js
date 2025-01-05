import { __ } from '@wordpress/i18n';

const Edit = () => {
    return (
        <div>
            <p>{__('This is Block Two (Editor View).', 'agora-stats')}</p>
            <p>{__('The data will be fetched and displayed dynamically on the front end.', 'agora-stats')}</p>
        </div>
    );
};

export default Edit;
