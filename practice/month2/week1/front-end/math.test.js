import { describe, it, expect } from 'vitest';
import { add, subtract } from './math';

describe('Math Functions', () => {
  it('should add two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should subtract two numbers', () => {
    expect(subtract(5, 3)).toBe(2);
  });
});
