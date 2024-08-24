document.getElementById('data-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const fromDate = document.getElementById('from-date').value;
    const toDate = document.getElementById('to-date').value;
    const agentName = document.getElementById('agent-name').value;
    const department = document.getElementById('department').value;
    const region = document.getElementById('region').value;

    // Construct the query parameters
    const queryParams = new URLSearchParams({
        fromDate,
        toDate,
        agentName,
        department,
        region
    });

    try {
        const response = await fetch(`https://YOUR_SERVERLESS_FUNCTION_URL?${queryParams.toString()}`);
        const data = await response.json();
        
        // Here, you'd handle converting the data to Excel or displaying it
        console.log(data);

    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

