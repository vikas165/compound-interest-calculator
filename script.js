function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById("principal").value);
    const rate = parseFloat(document.getElementById("rate").value) / 100; // Convert to decimal
    const time = parseFloat(document.getElementById("time").value);
    const unit = document.getElementById("unit").value;

    // Default values
    let n = 1;  // Compounding periods per year (n = 1 means annually)
    let ratePerPeriod = rate; // Interest rate per compounding period

    // Determine number of compounding periods (n) based on the selected unit
    switch (unit) {
        case 'months':
            n = 12; // 12 months per year
            ratePerPeriod = rate / n; // Divide the annual rate by 12 for monthly compounding
            break;
        case 'quarters':
            n = 4; // 4 quarters per year
            ratePerPeriod = rate / n; // Divide the annual rate by 4 for quarterly compounding
            break;
        case 'semi-annual':
            n = 2; // 2 times per year (semi-annual)
            ratePerPeriod = rate / n; // Divide the annual rate by 2 for semi-annual compounding
            break;
        case 'years':
            n = 1; // Compounds once a year
            ratePerPeriod = rate; // Use the full rate for annual compounding
            break;
        default:
            alert('Invalid time unit selected!');
            return;
    }

    // Calculate compound interest for the given period and frequency
    let totalAmount = principal * Math.pow((1 + ratePerPeriod), n * time); // Compound Interest formula
    let compoundInterest = totalAmount - principal;

    // Format the results with comma separation
    totalAmount = totalAmount.toLocaleString(); // Format total amount with commas
    compoundInterest = compoundInterest.toLocaleString(); // Format interest with commas

    // Output the result
    document.getElementById("result").innerHTML = `
        <h3>Result:</h3>
        <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
        <p><strong>Compound Interest:</strong> ₹${compoundInterest}</p>
    `;

    // Call function to show year-by-year breakdown
    showBreakdown(principal, rate, time, n, ratePerPeriod);
}

function showBreakdown(principal, rate, time, n, ratePerPeriod) {
    let breakdown = [];
    let totalAmount = principal;

    // Generate year-by-year breakdown based on compounding frequency
    for (let i = 1; i <= time; i++) {
        totalAmount = principal * Math.pow((1 + ratePerPeriod), n * i); // Compound Interest formula
        breakdown.push({
            year: i,
            compoundInterest: (totalAmount - principal).toLocaleString(),
            totalAmount: totalAmount.toLocaleString()
        });
    }

    // Display breakdown in a table
    const breakdownHtml = `
        <h3>Year-by-Year Breakdown:</h3>
        <table>
            <thead>
                <tr>
                    <th>Year</th>
                    <th>Compound Interest (₹)</th>
                    <th>Total Amount (₹)</th>
                </tr>
            </thead>
            <tbody>
                ${breakdown.map(data => `
                    <tr>
                        <td>${data.year}</td>
                        <td>${data.compoundInterest}</td>
                        <td>${data.totalAmount}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    document.getElementById("breakdown").innerHTML = breakdownHtml;
}

function exportToExcel() {
    const breakdownData = document.querySelectorAll("#breakdown table tbody tr");
    const exportData = Array.from(breakdownData).map(row => {
        const cells = row.querySelectorAll("td");
        return {
            Year: cells[0].innerText,
            CompoundInterest: cells[1].innerText,
            TotalAmount: cells[2].innerText
        };
    });

    // Export to Excel
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Compound Interest");
    XLSX.writeFile(wb, "Compound_Interest_Calculation.xlsx");
}
