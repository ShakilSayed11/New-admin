const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { startDate, endDate, agentName, workingDepartment, workingRegion } = req.query;
    const apiKey = process.env.GOOGLE_SHEETS_API_KEY;
    const sheetId = process.env.GOOGLE_SHEET_ID;

    console.log('API Key:', apiKey ? 'Set' : 'Not set');
    console.log('Sheet ID:', sheetId ? 'Set' : 'Not set');

    try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A:K?key=${apiKey}`;
        console.log('Fetching URL:', url);

        const response = await fetch(url);
        console.log('Google Sheets API response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Google Sheets API error:', errorText);
            return res.status(response.status).json({ error: 'Failed to fetch data from Google Sheets' });
        }

        const data = await response.json();
        console.log('Data received:', data ? 'Yes' : 'No');

        if (!data.values || data.values.length === 0) {
            return res.status(404).json({ error: 'No data found.' });
        }

        const headers = data.values[0];
        const filteredData = data.values.slice(1).filter(row => {
            const rowDate = new Date(row[headers.indexOf('Task Date')]);
            return (
                (!startDate || rowDate >= new Date(startDate)) &&
                (!endDate || rowDate <= new Date(endDate)) &&
                (!agentName || row[headers.indexOf('Agent Name')] === agentName) &&
                (!workingDepartment || row[headers.indexOf('Working Department')] === workingDepartment) &&
                (!workingRegion || row[headers.indexOf('Working Region')] === workingRegion)
            );
        });

        const result = filteredData.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index];
            });
            return obj;
        });

        res.status(200).json(result);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching the data.' });
    }
};
