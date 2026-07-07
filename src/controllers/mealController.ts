import type { Request, Response } from 'express';
import type { CalculateSuccessResponse } from '../../shared/meal';
import MealModel from '../models/mealModel';

/**
 * Controller for handling incoming requests and returning responses.
 */
class MealController {
  /**
   * Processes the uploaded meal plan and current sugar level.
   */
  static processMealPlan(req: Request, res: Response): void {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No meal plan file uploaded.' });
        return;
      }

      const currentSugar = Number(req.body.currentSugar);
      if (!Number.isFinite(currentSugar) || currentSugar < 1 || currentSugar > 600) {
        res.status(400).json({ error: 'Invalid blood sugar value.' });
        return;
      }

      const content = req.file.buffer.toString('utf8');
      const mealData = MealModel.parseMarkdown(content);

      if (mealData.length === 0) {
        res.status(400).json({ error: 'No valid food entries found in meal plan.' });
        return;
      }

      const summary = MealModel.getSummary(mealData, currentSugar);

      const response: CalculateSuccessResponse = {
        success: true,
        summary,
        disclaimer: 'This is a rough estimation and NOT medical advice.',
      };
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to process meal plan.' });
    }
  }
}

export default MealController;
