async function downloadData() {
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    const sheetId = process.env.REACT_APP_GOOGLE_SHEET_ID;
    const agentName = document.getElementById('agent-name').value;
    const department = document.getElementById('department').value;
    const region = document.getElementById('region').value;
    const dateFrom = document.getElementById('date-from').value;
    const dateTo = document.getElementById('date-to').value;

    const range = 'Sheet1!A:I'; // Adjust range as necessary
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    // Filter data based on user input
    const filteredData = data.values.filter(row => {
        return (!agentName || row[0] === agentName) &&
               (!department || row[1] === department) &&
               (!region || row[2] === region) &&
               (!dateFrom || new Date(row[4]) >= new Date(dateFrom)) &&
               (!dateTo || new Date(row[4]) <= new Date(dateTo));
    });

    // Convert filtered data to CSV and download as Excel
    const csvData = filteredData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const urlBlob = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', urlBlob);
    a.setAttribute('download', 'data.xlsx');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

