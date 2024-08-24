async function fetchData() {
    const response = await fetch('/api/get-data', {
        method: 'POST', // Ensure method matches the one expected by the API
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fromDate: '2024-08-01',
            toDate: '2024-08-31',
            agentName: 'John Doe',
            department: 'Sales',
            region: 'North'
        }),
    });

    if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
    } else {
        console.error('Error fetching data:', response.statusText);
    }
}
