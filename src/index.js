async function fetchData() {
    const fromDate = document.getElementById('fromDate').value;
    const toDate = document.getElementById('toDate').value;
    const agentName = document.getElementById('agentName').value;
    const department = document.getElementById('department').value;
    const region = document.getElementById('region').value;

    const response = await fetch('/api/get-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fromDate,
            toDate,
            agentName,
            department,
            region
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
        alert('Failed to download data');
    }
}
