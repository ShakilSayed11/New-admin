document.getElementById('downloadForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const agentName = document.getElementById('agentName').value;
    const workingDepartment = document.getElementById('workingDepartment').value;
    const workingRegion = document.getElementById('workingRegion').value;

    try {
        const response = await fetch(`/api/getData?startDate=${startDate}&endDate=${endDate}&agentName=${agentName}&workingDepartment=${workingDepartment}&workingRegion=${workingRegion}`);
        const data = await response.json();

        if (data.error) {
            alert(`Error: ${data.error}`);
            return;
        }

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'google_sheets_data.xlsx');
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching the data.');
    }
});
