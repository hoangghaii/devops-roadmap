import {describe, expect, it} from 'vitest';
import {add, subtract} from './math';

describe('Math Functions', () => {
	it('should add two numbers', () => {
		expect(add(2, 3)).toBe(5);
	});

	// Test case 1: Normal addition
	it('adds 1 + 2 to equal 3', () => {
		expect(add(1, 2)).toBe(3);
	});

	// Test case 2: Negative numbers
	it('adds -1 + -2 to equal -3', () => {
		expect(add(-1, -2)).toBe(-3);
	});

	// Test case 3: Zero
	it('adds 0 + 0 to equal 0', () => {
		expect(add(0, 0)).toBe(0);
	});

	// Test case 4: Error handling
	it('throws error for non-numbers', () => {
		expect(() => add('1', 2)).toThrow('Arguments must be numbers');
	});

	it('should subtract two numbers', () => {
		expect(subtract(5, 3)).toBe(2);
	});
});
