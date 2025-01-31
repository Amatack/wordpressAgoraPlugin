document.addEventListener('DOMContentLoaded', function () {
    const saveButton = document.getElementById('save-button');
    const tokenInput = document.getElementById('texto');

    saveButton.addEventListener('click', async function () {
        const tokenId = tokenInput.value;

        console.log(mi_plugin_ajax);
        console.log("tokenId:", tokenId);

        try {
            // Create the POST request with fetch()
            const response = await fetch(mi_plugin_ajax.ajax_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    action: 'save_etoken_id',
                    token_id: tokenId
                })
            });

            const data = await response.json();

            if (data.success) {
                alert(data.data);
            } else {
                alert('Error: ' + data.data);
            }
        } catch (error) {
            console.error('Error in request:', error);
            alert('Error in request.');
        }
    });
});
