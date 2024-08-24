console.log('Script is running');

document.getElementById('downloadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Form submitted');

    try {
        const response = await fetch('/api/test');
        console.log('Response status:', response.status);
        
        const responseText = await response.text();
        console.log('Response text:', responseText);

        try {
            const data = JSON.parse(responseText);
            console.log('Received data:', data);

            if (data.error) {
                console.error('Error from server:', data.error);
                alert(`Error: ${data.error}`);
                return;
            }

            alert('API test successful: ' + data.message);
        } catch (jsonError) {
            console.error('Error parsing JSON:', jsonError);
            alert('The server returned an invalid response. Please check the console for details.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching the data.');
    }
});
