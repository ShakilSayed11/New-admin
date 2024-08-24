import { GoogleSpreadsheet } from 'google-spreadsheet';
import ExcelJS from 'exceljs';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const { fromDate, toDate, agentName, department, region } = await req.json();

    const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
    await doc.useApiKey(process.env.GOOGLE_API_KEY);
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const filteredRows = rows.filter(row => {
        const taskDate = new Date(row['Task Date']);
        return (
            taskDate >= new Date(fromDate) &&
            taskDate <= new Date(toDate) &&
            (!agentName || row['Agent Name'] === agentName) &&
            (!department || row['Working Department'] === department) &&
            (!region || row['Working Region'] === region)
        );
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');
    worksheet.columns = [
        { header: 'Agent Name', key: 'Agent Name' },
        { header: 'Working Department', key: 'Working Department' },
        { header: 'Working Region', key: 'Working Region' },
        { header: 'Ticket Number', key: 'Ticket Number' },
        { header: 'Task Date', key: 'Task Date' },
        { header: 'Email Time', key: 'Email Time' },
        { header: 'Task Name', key: 'Task Name' },
        { header: 'Task Time', key: 'Task Time' },
        { header: 'Submission Time', key: 'Submission Time' },
    ];

    worksheet.addRows(filteredRows);

    const buffer = await workbook.xlsx.writeBuffer();

    return NextResponse.json(buffer, {
        headers: {
            'Content-Disposition': 'attachment; filename=data.xlsx',
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
    });
}
