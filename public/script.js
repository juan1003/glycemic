document.getElementById('mealForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('mealPlan', document.getElementById('mealPlan').files[0]);
    formData.append('currentSugar', document.getElementById('currentSugar').value);

    try {
        const response = await fetch('/api/calculate', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            displayResults(data.summary, data.disclaimer);
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to connect to the server.');
    }
});

function displayResults(summary, disclaimerText) {
    const resultsSection = document.getElementById('results');
    const tableDiv = document.getElementById('summaryTable');
    const predictionDiv = document.getElementById('prediction');
    const disclaimerPara = document.querySelector('.disclaimer');

    // Display Meal Data
    let tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>Food</th>
                    <th>GI</th>
                    <th>Carbs (g)</th>
                    <th>GL</th>
                </tr>
            </thead>
            <tbody>
                ${summary.mealData.map(item => `
                    <tr>
                        <td>${item.food}</td>
                        <td>${item.gi}</td>
                        <td>${item.carbs}</td>
                        <td>${item.gl}</td>
                    </tr>
                `).join('')}
            </tbody>
            <tfoot>
                <tr>
                    <th colspan="2">TOTALS</th>
                    <th>${summary.totalCarbs}g</th>
                    <th>${summary.totalGL}</th>
                </tr>
            </tfoot>
        </table>
    `;

    tableDiv.innerHTML = tableHtml;

    // Display Prediction
    if (summary.prediction) {
        const p = summary.prediction;
        const statusClass = p.status.includes('HIGH') ? 'high' : (p.status.includes('LOW') ? 'low' : 'normal');
        
        predictionDiv.innerHTML = `
            <div class="prediction-card ${statusClass}">
                <h3>Predicted Result</h3>
                <p>Initial Blood Sugar: <strong>${p.initialSugar} mg/dL</strong></p>
                <p>Estimated Rise: <strong>+${p.estimatedRise} mg/dL</strong></p>
                <p>Predicted Post-Meal: <strong>${p.predictedSugar} mg/dL</strong></p>
                <p>Status: <strong>${p.status}</strong></p>
            </div>
        `;
    }

    disclaimerPara.textContent = disclaimerText;
    resultsSection.classList.remove('hidden');
}

document.getElementById('resetBtn').addEventListener('click', () => {
    document.getElementById('mealForm').reset();
    document.getElementById('results').classList.add('hidden');
});
