# Glycemic Index & Load Calculator (Prototype)

This is a Node.js console application designed to help Type 2 diabetics estimate the impact of their meals on their blood sugar levels using the **Glycemic Load (GL)** method.

## ⚠️ CRITICAL MEDICAL DISCLAIMER
**THIS TOOL IS FOR EDUCATIONAL AND PROTOTYPING PURPOSES ONLY.**
- It is **NOT** a medical device.
- The calculations (1 GL = 3 mg/dL rise) are generalized estimates and vary significantly between individuals.
- **NEVER** use this app to calculate insulin doses or make medical decisions.
- Always consult a healthcare professional for diabetes management.

## Features
- **Markdown Meal Import:** Load meal plans from `.md` files (Format: `- Food: GI, Carbs`).
- **Glycemic Load (GL) Calculation:** More accurate than GI alone as it accounts for portion size.
- **Blood Sugar Prediction:** Input current blood sugar to see an estimated post-meal result.
- **T2 Status Indicator:** Labels results as LOW, NORMAL, or HIGH based on standard targets (70-180 mg/dL).

## How to Run
1. Ensure Node.js is installed.
2. Run `node index.js`.
3. Use the menu to set your current sugar and upload a meal plan (e.g., `test_meal_plan.md` or `meal_plan_2.md`).

## Development Conventions
- **Entry Point:** `index.js`
- **Logic:** `GL = (GI * Carbs) / 100`.
- **Estimation:** `Predicted = Current + (Total GL * 3)`.
