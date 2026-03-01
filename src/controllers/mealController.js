const MealModel = require('../models/mealModel');

/**
 * Controller for handling incoming requests and returning responses.
 */
class MealController {
  /**
   * Processes the uploaded meal plan and current sugar level.
   */
  static processMealPlan(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No meal plan file uploaded.' });
      }

      const currentSugar = parseInt(req.body.currentSugar, 10);
      const content = req.file.buffer.toString('utf8');
      
      const mealData = MealModel.parseMarkdown(content);
      const summary = MealModel.getSummary(mealData, currentSugar);

      res.json({
        success: true,
        summary: summary,
        disclaimer: 'This is a rough estimation and NOT medical advice.'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to process meal plan.' });
    }
  }
}

module.exports = MealController;
