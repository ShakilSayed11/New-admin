console.log('Script is running');

document.getElementById('downloadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Form submitted');

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const agentName = document.getElementById('agentName').value;
    const workingDepartment = document.getElementById('workingDepartment').value;
    const workingRegion = document.getElementById('workingRegion').value;

    console.log('Form data:', { startDate, endDate, agentName, workingDepartment, workingRegion });

    try {
        const response = await fetch(`/api/getData?startDate=${startDate}&endDate=${endDate}&agentName=${agentName}&workingDepartment=${workingDepartment}&workingRegion=${workingRegion}`);
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Received data:', data);

        if (data.error) {
            console.error('Error from server:', data.error);
            alert(`Error: ${data.error}`);
            return;
        }

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'google_sheets_data.xlsx');
        console.log('File created successfully');
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching the data.');
    }
});
