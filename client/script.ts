import type { CalculateResponse, MealSummary } from '../shared/meal';

const mealForm = document.getElementById('mealForm') as HTMLFormElement;
const mealPlanInput = document.getElementById('mealPlan') as HTMLInputElement;
const currentSugarInput = document.getElementById('currentSugar') as HTMLInputElement;
const resultsSection = document.getElementById('results') as HTMLElement;
const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;

function isValidBloodSugar(value: string): boolean {
  const sugar = Number(value);
  return Number.isFinite(sugar) && sugar >= 1 && sugar <= 600;
}

mealForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const mealFile = mealPlanInput.files?.[0];
  if (!mealFile) {
    alert('Please upload a meal plan file.');
    return;
  }

  if (!isValidBloodSugar(currentSugarInput.value)) {
    alert('Enter a blood sugar value between 1 and 600 mg/dL.');
    return;
  }

  const formData = new FormData();
  formData.append('mealPlan', mealFile);
  formData.append('currentSugar', currentSugarInput.value);

  try {
    const response = await fetch('/api/calculate', {
      method: 'POST',
      body: formData,
    });

    const data: CalculateResponse = await response.json();

    if (!response.ok) {
      alert('error' in data ? data.error : 'Request failed.');
      return;
    }

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

function displayResults(summary: MealSummary, disclaimerText: string): void {
  const tableDiv = document.getElementById('summaryTable') as HTMLElement;
  const predictionDiv = document.getElementById('prediction') as HTMLElement;
  const disclaimerPara = document.querySelector('.disclaimer') as HTMLParagraphElement;

  const tableHtml = `
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
                ${summary.mealData
                  .map(
                    (item) => `
                    <tr>
                        <td>${item.food}</td>
                        <td>${item.gi}</td>
                        <td>${item.carbs}</td>
                        <td>${item.gl}</td>
                    </tr>
                `
                  )
                  .join('')}
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

  if (summary.prediction) {
    const p = summary.prediction;
    const statusClass = p.status.includes('HIGH')
      ? 'high'
      : p.status.includes('LOW')
        ? 'low'
        : 'normal';

    predictionDiv.innerHTML = `
            <div class="prediction-card ${statusClass}">
                <h3>Predicted Result</h3>
                <p>Initial Blood Sugar: <strong>${p.initialSugar} mg/dL</strong></p>
                <p>Estimated Rise: <strong>+${p.estimatedRise} mg/dL</strong></p>
                <p>Predicted Post-Meal: <strong>${p.predictedSugar} mg/dL</strong></p>
                <p>Status: <strong>${p.status}</strong></p>
            </div>
        `;
  } else {
    predictionDiv.innerHTML = '';
  }

  disclaimerPara.textContent = disclaimerText;
  resultsSection.classList.remove('hidden');
}

resetBtn.addEventListener('click', () => {
  mealForm.reset();
  resultsSection.classList.add('hidden');
});
