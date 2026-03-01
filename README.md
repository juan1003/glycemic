# Glycemic

This is a prototype for a glycemic load calculator based on meal plans.

Diabetics will thank me and doctors will hate me.

## 🚀 How to Use

### 1. Prepare Your Meal Plan
Create a `.md` file (e.g., `my_meal.md`) listing your food items with their Glycemic Index (GI) and Carbohydrates (g) in the following format:

```markdown
- Scrambled Eggs: 0, 1g
- Whole Grain Bread: 51, 12g
- Avocado: 15, 2g
```

### 2. Start the Application
Run the local server using Node.js:
```bash
node index.js
```
Open your browser and navigate to `http://localhost:3000`.

### 3. Calculate Your Impact
1.  **Enter your current blood sugar** level (mg/dL).
2.  **Upload your meal plan** `.md` file.
3.  Click **"Calculate Impact"** to see your predicted post-meal blood sugar.

### 4. Review Your Results
- **Cyan Table:** Displays each food's GI, Carbs, and calculated Glycemic Load (GL).
- **Magenta Prediction:** Shows your estimated blood sugar rise and status (Low, Normal, or High).

---

## ⚠️ Medical Disclaimer
**This tool is for educational purposes only.** The calculations are estimates and should not be used for medical decisions or insulin dosing. Always consult with a healthcare professional.
