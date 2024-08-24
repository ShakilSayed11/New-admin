const { GoogleSpreadsheet } = require('google-spreadsheet');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
    await doc.useApiKey(process.env.GOOGLE_SHEETS_API_KEY);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const { startDate, endDate, agentName, workingDepartment, workingRegion } = req.query;

    const filteredData = rows.filter(row => {
      const rowDate = new Date(row['Task Date']);
      return (
        (!startDate || rowDate >= new Date(startDate)) &&
        (!endDate || rowDate <= new Date(endDate)) &&
        (!agentName || row['Agent Name'] === agentName) &&
        (!workingDepartment || row['Working Department'] === workingDepartment) &&
        (!workingRegion || row['Working Region'] === workingRegion)
      );
    }).map(row => row._rawData);

    res.status(200).json(filteredData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching the data.' });
  }
};
