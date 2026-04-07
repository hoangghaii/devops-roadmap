import {fireEvent, render, screen} from '@testing-library/react';
import '@testing-library/jest-dom'
import Button from './Button';

describe('Button component', () => {
	test('renders with text', () => {
		render(<Button>Click me</Button>);
		expect(screen.getByText('Click me')).toBeInTheDocument();
	});

	test('calls onClick when clicked', () => {
		const handleClick = jest.fn();
		render(<Button onClick={handleClick}>Click</Button>);

		fireEvent.click(screen.getByText('Click'));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	test('is disabled when disabled prop is true', () => {
		render(<Button disabled>Click</Button>);
		expect(screen.getByText('Click')).toBeDisabled();
	});
});