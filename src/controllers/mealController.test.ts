import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { Request, Response } from 'express';
import MealController from '../controllers/mealController';

function createMockResponse(): Response & {
  statusCode: number;
  body: unknown;
} {
  const res = {
    statusCode: 200,
    body: null as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };

  return res as Response & { statusCode: number; body: unknown };
}

function createMockRequest(overrides: Partial<Request> = {}): Request {
  return {
    body: {},
    file: undefined,
    ...overrides,
  } as Request;
}

describe('MealController.processMealPlan', () => {
  it('returns 400 when no file is uploaded', () => {
    const req = createMockRequest({ body: { currentSugar: '120' } });
    const res = createMockResponse();

    MealController.processMealPlan(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { error: 'No meal plan file uploaded.' });
  });

  it('returns 400 for invalid blood sugar', () => {
    const req = createMockRequest({
      body: { currentSugar: 'abc' },
      file: {
        buffer: Buffer.from('- Rice: 70, 30g'),
      } as Express.Multer.File,
    });
    const res = createMockResponse();

    MealController.processMealPlan(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { error: 'Invalid blood sugar value.' });
  });

  it('returns 400 when meal plan has no valid entries', () => {
    const req = createMockRequest({
      body: { currentSugar: '120' },
      file: {
        buffer: Buffer.from('# empty meal plan'),
      } as Express.Multer.File,
    });
    const res = createMockResponse();

    MealController.processMealPlan(req, res);

    assert.equal(res.statusCode, 400);
    assert.deepEqual(res.body, { error: 'No valid food entries found in meal plan.' });
  });

  it('returns 200 with summary for valid input', () => {
    const req = createMockRequest({
      body: { currentSugar: '190' },
      file: {
        buffer: Buffer.from('- Whole Grain Bread: 51, 12g'),
      } as Express.Multer.File,
    });
    const res = createMockResponse();

    MealController.processMealPlan(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal((res.body as { success: boolean }).success, true);
    assert.equal((res.body as { summary: { totalCarbs: number } }).summary.totalCarbs, 12);
    assert.equal(
      (res.body as { disclaimer: string }).disclaimer,
      'This is a rough estimation and NOT medical advice.'
    );
  });
});
