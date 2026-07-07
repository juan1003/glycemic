import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import MealModel from './mealModel';

describe('MealModel.parseMarkdown', () => {
  it('parses valid meal plan lines', () => {
    const content = `- Scrambled Eggs: 0, 1g
- Whole Grain Bread: 51, 12g
- Avocado: 15, 2g`;

    const result = MealModel.parseMarkdown(content);

    assert.equal(result.length, 3);
    assert.equal(result[0].food, 'Scrambled Eggs');
    assert.equal(result[1].food, 'Whole Grain Bread');
    assert.equal(result[1].gi, 51);
    assert.equal(result[1].carbs, 12);
    assert.equal(result[1].gl, 6.1);
  });

  it('returns empty array for empty content', () => {
    assert.deepEqual(MealModel.parseMarkdown(''), []);
    assert.deepEqual(MealModel.parseMarkdown(undefined as unknown as string), []);
  });

  it('returns empty array when no lines match', () => {
    const content = '# just a header\nno food here';
    assert.deepEqual(MealModel.parseMarkdown(content), []);
  });
});

describe('MealModel.getSummary', () => {
  const mealData = MealModel.parseMarkdown('- Whole Grain Bread: 51, 12g');

  it('calculates totals correctly', () => {
    const summary = MealModel.getSummary(mealData, 120);

    assert.equal(summary.totalGL, '6.1');
    assert.equal(summary.totalCarbs, 12);
    assert.equal(summary.prediction?.initialSugar, 120);
    assert.equal(summary.prediction?.estimatedRise, 18);
    assert.equal(summary.prediction?.predictedSugar, 138);
    assert.equal(summary.prediction?.status, 'TARGET / NORMAL');
  });

  it('returns HIGH status when predicted sugar exceeds 180', () => {
    const highMeal = MealModel.parseMarkdown('- Rice: 70, 30g');
    const summary = MealModel.getSummary(highMeal, 171);

    assert.equal(summary.prediction?.status, 'HIGH (Hyperglycemia)');
  });

  it('returns LOW status when predicted sugar is below 70', () => {
    const lowMeal = MealModel.parseMarkdown('- Avocado: 15, 2g');
    const summary = MealModel.getSummary(lowMeal, 50);

    assert.equal(summary.prediction?.status, 'LOW (Hypoglycemia)');
  });
});
