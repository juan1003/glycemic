const path = require('path');

/**
 * Model for handling Glycemic Load calculations and predictions.
 */
class MealModel {
  /**
   * Parses markdown content into a structured array of objects.
   * Format: "- Food: GI, Carbs(g)"
   */
  static parseMarkdown(content) {
    if (!content) return [];
    const lines = content.split(/\r?\n/);
    const results = [];

    lines.forEach(line => {
      // Matches "- Food: GI, Carbs" or "Food: GI, Carbs"
      const match = line.match(/(?:-\s*)?([^:|]+)[:|]\s*(\d+)\s*(?:GI)?\s*,\s*(\d+)\s*g?/i);
      if (match) {
        const food = match[1].trim();
        const gi = parseInt(match[2].trim(), 10);
        const carbs = parseInt(match[3].trim(), 10);
        const gl = (gi * carbs) / 100;

        results.push({ food, gi, carbs, gl: parseFloat(gl.toFixed(1)) });
      }
    });

    return results;
  }

  /**
   * Calculates total GL, total carbs, and predicted sugar.
   */
  static getSummary(mealData, currentSugar) {
    const totalGL = mealData.reduce((sum, item) => sum + item.gl, 0);
    const totalCarbs = mealData.reduce((sum, item) => sum + item.carbs, 0);
    
    let prediction = null;
    if (currentSugar !== null && !isNaN(currentSugar)) {
      const estimatedRise = totalGL * 3;
      const predictedSugar = currentSugar + estimatedRise;
      let status = 'TARGET / NORMAL';
      if (predictedSugar > 180) status = 'HIGH (Hyperglycemia)';
      if (predictedSugar < 70) status = 'LOW (Hypoglycemia)';

      prediction = {
        initialSugar: currentSugar,
        estimatedRise: Math.round(estimatedRise),
        predictedSugar: Math.round(predictedSugar),
        status: status
      };
    }

    return {
      mealData,
      totalGL: totalGL.toFixed(1),
      totalCarbs,
      prediction
    };
  }
}

module.exports = MealModel;
