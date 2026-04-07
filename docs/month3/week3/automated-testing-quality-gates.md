# 🧪 Automated Testing & Quality Gates - Complete Guide

## From Testing Pyramid to Production-Ready CI/CD

**Target Audience:** Developers implementing automated testing in CI/CD pipelines

**What You'll Learn:**

- Testing Pyramid and when to use each test type
- Code quality tools and how to integrate them
- Security scanning and vulnerability detection
- Code coverage and static analysis
- Complete CI/CD pipeline with quality gates
- Real-world examples and best practices

**Time Required:** 4-5 hours to read and implement

---

# Part 1: Testing Pyramid

## 1.1 What is the Testing Pyramid?

### The Pyramid Structure

```
         /\
        /  \       E2E Tests (5%)
       /────\      - Slow (minutes)
      /      \     - Expensive to maintain
     /────────\    - Test full user workflows
    /          \   
   /────────────\  Integration Tests (15%)
  /──────────────\ - Medium speed (seconds)
 /────────────────\- Test component interactions
/──────────────────\
────────────────────Unit Tests (80%)
                    - Fast (milliseconds)
                    - Test individual functions
                    - Easy to maintain
```

### Why This Shape?

```
More tests at bottom = Faster feedback, cheaper to maintain
Fewer tests at top = Slower feedback, expensive to maintain

Cost & Speed:
Unit Tests:        $     (cheap, fast)
Integration Tests: $$    (medium cost/speed)
E2E Tests:         $$$   (expensive, slow)
```

---

## 1.2 Unit Tests

### What Are Unit Tests?

```
Unit Test = Test ONE function/component in isolation

Characteristics:
✅ Fast (< 1ms each)
✅ No external dependencies (mocked)
✅ Tests single responsibility
✅ Easy to debug (pinpoint exact issue)
```

### Example: Testing a Function

```javascript
// sum.js
export function sum(a, b) {
	if (typeof a !== 'number' || typeof b !== 'number') {
		throw new Error('Arguments must be numbers');
	}
	return a + b;
}

// sum.test.js
import {sum} from './sum';

describe('sum function', () => {
	// Test case 1: Normal addition
	test('adds 1 + 2 to equal 3', () => {
		expect(sum(1, 2)).toBe(3);
	});

	// Test case 2: Negative numbers
	test('adds -1 + -2 to equal -3', () => {
		expect(sum(-1, -2)).toBe(-3);
	});

	// Test case 3: Zero
	test('adds 0 + 0 to equal 0', () => {
		expect(sum(0, 0)).toBe(0);
	});

	// Test case 4: Error handling
	test('throws error for non-numbers', () => {
		expect(() => sum('1', 2)).toThrow('Arguments must be numbers');
	});
});
```

---

### React Component Unit Test

```javascript
// Button.jsx
export function Button({onClick, children, disabled = false}) {
	return (
		<button onClick={onClick} disabled={disabled}>
			{children}
		</button>
	);
}

// Button.test.jsx
import {render, screen, fireEvent} from '@testing-library/react';
import {Button} from './Button';

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
```

---

### When to Write Unit Tests

```
✅ Write unit tests for:
- Pure functions (input → output, no side effects)
- Utility functions (formatters, validators, calculators)
- Business logic (pricing, calculations, rules)
- React components (rendering, props, state)
- Custom hooks (behavior, state management)

❌ Don't unit test:
- Third-party libraries (already tested)
- Trivial code (getters/setters with no logic)
- Framework code (React itself, Express routes)
```

---

## 1.3 Integration Tests

### What Are Integration Tests?

```
Integration Test = Test how multiple components work TOGETHER

Characteristics:
✅ Medium speed (1-10 seconds)
✅ Test real interactions
✅ May use real database/API
✅ Test component boundaries
```

### Example: API Integration Test

```javascript
// userService.js
import axios from 'axios';

export class UserService {
	async getUser(id) {
		const response = await axios.get(`/api/users/${id}`);
		return response.data;
	}

	async createUser(userData) {
		const response = await axios.post('/api/users', userData);
		return response.data;
	}
}

// userService.test.js
import {UserService} from './userService';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('UserService integration', () => {
	let service;

	beforeEach(() => {
		service = new UserService();
	});

	test('getUser fetches user from API', async () => {
		// Arrange
		const mockUser = {id: 1, name: 'John'};
		axios.get.mockResolvedValue({data: mockUser});

		// Act
		const user = await service.getUser(1);

		// Assert
		expect(axios.get).toHaveBeenCalledWith('/api/users/1');
		expect(user).toEqual(mockUser);
	});

	test('createUser posts to API and returns user', async () => {
		const newUser = {name: 'Jane', email: 'jane@example.com'};
		const createdUser = {id: 2, ...newUser};
		axios.post.mockResolvedValue({data: createdUser});

		const result = await service.createUser(newUser);

		expect(axios.post).toHaveBeenCalledWith('/api/users', newUser);
		expect(result).toEqual(createdUser);
	});
});
```

---

### Database Integration Test

```javascript
// userRepository.js
import {db} from './database';

export class UserRepository {
	async findById(id) {
		return await db.query('SELECT * FROM users WHERE id = ?', [id]);
	}

	async create(user) {
		const result = await db.query(
			'INSERT INTO users (name, email) VALUES (?, ?)',
			[user.name, user.email]
		);
		return {id: result.insertId, ...user};
	}
}

// userRepository.test.js
import {UserRepository} from './userRepository';
import {db} from './database';

describe('UserRepository integration', () => {
	let repository;

	beforeAll(async () => {
		// Setup test database
		await db.connect();
		await db.query('CREATE TABLE IF NOT EXISTS users (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(255), email VARCHAR(255))');
	});

	afterAll(async () => {
		// Cleanup
		await db.query('DROP TABLE users');
		await db.disconnect();
	});

	beforeEach(async () => {
		// Clear data before each test
		await db.query('DELETE FROM users');
		repository = new UserRepository();
	});

	test('creates and retrieves user from database', async () => {
		// Create user
		const newUser = {name: 'John', email: 'john@example.com'};
		const created = await repository.create(newUser);

		expect(created.id).toBeDefined();
		expect(created.name).toBe(newUser.name);

		// Retrieve user
		const found = await repository.findById(created.id);
		expect(found.name).toBe(newUser.name);
		expect(found.email).toBe(newUser.email);
	});
});
```

---

### When to Write Integration Tests

```
✅ Write integration tests for:
- API endpoints (request → response)
- Database operations (CRUD)
- Service layer interactions
- External API integrations
- Authentication/Authorization flows
- File system operations

❌ Don't integration test:
- Pure logic (use unit tests)
- Full UI workflows (use E2E)
```

---

## 1.4 End-to-End (E2E) Tests

### What Are E2E Tests?

```
E2E Test = Test COMPLETE user workflow from start to finish

Characteristics:
✅ Slow (10-60 seconds each)
✅ Test real browser
✅ Test entire stack (frontend + backend + database)
✅ Simulate real user behavior
```

### Example: E2E Test with Playwright

```javascript
// login.spec.js
import {test, expect} from '@playwright/test';

test.describe('User Login Flow', () => {
	test('user can login with valid credentials', async ({page}) => {
		// 1. Navigate to login page
		await page.goto('http://localhost:3000/login');

		// 2. Fill in login form
		await page.fill('input[name="email"]', 'user@example.com');
		await page.fill('input[name="password"]', 'password123');

		// 3. Click login button
		await page.click('button[type="submit"]');

		// 4. Wait for navigation
		await page.waitForURL('http://localhost:3000/dashboard');

		// 5. Verify user is logged in
		await expect(page.locator('text=Welcome, User')).toBeVisible();
		await expect(page.locator('[data-testid="logout-button"]')).toBeVisible();
	});

	test('shows error with invalid credentials', async ({page}) => {
		await page.goto('http://localhost:3000/login');

		await page.fill('input[name="email"]', 'wrong@example.com');
		await page.fill('input[name="password"]', 'wrongpassword');
		await page.click('button[type="submit"]');

		// Should show error message
		await expect(page.locator('text=Invalid credentials')).toBeVisible();

		// Should stay on login page
		expect(page.url()).toBe('http://localhost:3000/login');
	});
});
```

---

### Example: E2E Shopping Flow

```javascript
// shopping.spec.js
import {test, expect} from '@playwright/test';

test.describe('Shopping Cart Flow', () => {
	test('user can add items to cart and checkout', async ({page}) => {
		// 1. Browse products
		await page.goto('http://localhost:3000/products');

		// 2. Search for product
		await page.fill('input[placeholder="Search products"]', 'laptop');
		await page.press('input[placeholder="Search products"]', 'Enter');

		// 3. Click on first product
		await page.click('text=MacBook Pro');

		// 4. Add to cart
		await page.click('button:has-text("Add to Cart")');

		// 5. Verify cart badge updates
		await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');

		// 6. Go to cart
		await page.click('[data-testid="cart-icon"]');

		// 7. Verify product in cart
		await expect(page.locator('text=MacBook Pro')).toBeVisible();

		// 8. Proceed to checkout
		await page.click('button:has-text("Checkout")');

		// 9. Fill shipping information
		await page.fill('input[name="fullName"]', 'John Doe');
		await page.fill('input[name="address"]', '123 Main St');
		await page.fill('input[name="city"]', 'New York');
		await page.fill('input[name="zipCode"]', '10001');

		// 10. Select payment method
		await page.click('input[value="credit-card"]');
		await page.fill('input[name="cardNumber"]', '4111111111111111');
		await page.fill('input[name="expiry"]', '12/25');
		await page.fill('input[name="cvv"]', '123');

		// 11. Place order
		await page.click('button:has-text("Place Order")');

		// 12. Verify success
		await expect(page.locator('text=Order Confirmed')).toBeVisible();
		await expect(page.locator('[data-testid="order-number"]')).toBeVisible();
	});
});
```

---

### When to Write E2E Tests

```
✅ Write E2E tests for:
- Critical user journeys (login, checkout, signup)
- Happy paths (most common user flows)
- High-value features (payment, booking)
- Cross-browser compatibility
- Regression prevention (features that broke before)

❌ Don't E2E test:
- Every possible scenario (too slow/expensive)
- Edge cases (use unit tests)
- Validation logic (use unit tests)
- All permutations (combinatorial explosion)
```

---

## 1.5 When to Run Each Test Type

### Test Execution Strategy

```
╔════════════════════════════════════════════════════════════╗
║                    EXECUTION TIMELINE                      ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  Developer's Machine:                                      ║
║  ├─ Unit Tests (on save)           ⚡ < 1 second            ║
║  └─ Integration Tests (on commit)  ⚡ < 10 seconds          ║
║                                                            ║
║  CI Pipeline (on push):                                    ║
║  ├─ Unit Tests                     ⚡ 10-30 seconds         ║
║  ├─ Integration Tests              ⚡ 1-3 minutes           ║
║  ├─ Linting & Formatting           ⚡ 10-30 seconds         ║
║  └─ Security Scan                  ⚡ 30-60 seconds         ║
║                                                            ║
║  CI Pipeline (on PR to main):                              ║
║  ├─ All above tests                ⚡ 2-4 minutes           ║
║  ├─ E2E Tests (critical paths)     🐢 5-10 minutes         ║
║  └─ Code Coverage Report           ⚡ 1-2 minutes           ║
║                                                            ║
║  Nightly Build:                                            ║
║  ├─ All tests                      ⚡ 5-15 minutes          ║
║  ├─ Full E2E Suite                 🐢 30-60 minutes        ║
║  ├─ Performance Tests              🐢 15-30 minutes        ║
║  └─ Security Audit (deep)          🐢 10-20 minutes        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

### Decision Matrix

```
┌──────────────────────┬─────────┬─────────────┬─────────┐
│ Test Type            │ When    │ How Often   │ Failure │
├──────────────────────┼─────────┼─────────────┼─────────┤
│ Unit Tests           │ Always  │ Every commit│ Block   │
│ Integration Tests    │ Always  │ Every commit│ Block   │
│ Linting              │ Always  │ Every commit│ Block   │
│ E2E (critical)       │ PR only │ Before merge│ Block   │
│ E2E (full)           │ Nightly │ Daily       │ Warn    │
│ Performance          │ Nightly │ Daily       │ Warn    │
│ Security (fast)      │ Always  │ Every commit│ Warn    │
│ Security (deep)      │ Nightly │ Daily       │ Block   │
└──────────────────────┴─────────┴─────────────┴─────────┘
```

---

# Part 2: Code Quality Tools

## 2.1 Linters: ESLint & Prettier

### What is Linting?

```
Linter = Tool that analyzes code for potential errors and style issues

Benefits:
✅ Catch bugs before runtime
✅ Enforce code style consistency
✅ Improve code readability
✅ Prevent common mistakes
```

---

### ESLint Setup

**Install ESLint:**

```bash
# Install ESLint
yarn add -D eslint @eslint/js

# Install TypeScript support
yarn add -D @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Install React plugin
yarn add -D eslint-plugin-react eslint-plugin-react-hooks

# Install import plugin
yarn add -D eslint-plugin-import
```

**Configure `.eslintrc.js`:**

```javascript
module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
		},
	},
	plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import'],
	rules: {
		// Possible Errors
		'no-console': 'warn',
		'no-debugger': 'error',
		'no-unused-vars': 'off', // Use @typescript-eslint/no-unused-vars
		'@typescript-eslint/no-unused-vars': ['error', {argsIgnorePattern: '^_'}],

		// Best Practices
		'eqeqeq': ['error', 'always'],
		'no-var': 'error',
		'prefer-const': 'error',
		'prefer-arrow-callback': 'error',

		// React
		'react/react-in-jsx-scope': 'off', // Not needed in React 17+
		'react/prop-types': 'off', // Using TypeScript
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',

		// Import
		'import/order': ['error', {
			groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
			'newlines-between': 'always',
			alphabetize: {order: 'asc'},
		}],
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
};
```

---

### Prettier Setup

**Install Prettier:**

```bash
# Install Prettier
yarn add -D prettier

# Install ESLint integration
yarn add -D eslint-config-prettier eslint-plugin-prettier
```

**Configure `.prettierrc.json`:**

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**`.prettierignore`:**

```
# Build output
dist
build
.next
out

# Dependencies
node_modules

# Cache
.cache
.parcel-cache

# Misc
coverage
.DS_Store
*.log
```

---

### Package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit",
    "validate": "yarn lint && yarn format:check && yarn type-check"
  }
}
```

---

## 2.2 Security Scanners

### npm audit

**Built-in security scanner:**

```bash
# Check for vulnerabilities
npm audit

# Show detailed report
npm audit --json

# Fix vulnerabilities automatically
npm audit fix

# Fix including breaking changes
npm audit fix --force
```

**Example output:**

```
found 3 vulnerabilities (1 low, 2 high)
  run `npm audit fix` to fix them, or `npm audit` for details

# Detailed report
┌───────────────┬──────────────────────────────────────────────┐
│ High          │ Prototype Pollution                          │
├───────────────┼──────────────────────────────────────────────┤
│ Package       │ lodash                                       │
├───────────────┼──────────────────────────────────────────────┤
│ Patched in    │ >=4.17.21                                    │
├───────────────┼──────────────────────────────────────────────┤
│ Dependency of │ react-scripts                                │
├───────────────┼──────────────────────────────────────────────┤
│ Path          │ react-scripts > webpack > lodash             │
└───────────────┴──────────────────────────────────────────────┘
```

---

### Snyk

**More powerful security scanner:**

```bash
# Install Snyk CLI
npm install -g snyk

# Authenticate
snyk auth

# Test for vulnerabilities
snyk test

# Test and output JSON
snyk test --json

# Monitor project (continuous monitoring)
snyk monitor

# Fix vulnerabilities
snyk fix
```

**Snyk GitHub Action:**

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday

jobs:
  security:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      - name: Upload results to GitHub Code Scanning
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: snyk.sarif
```

---

### OWASP Dependency-Check

**Check for known vulnerabilities:**

```yaml
# .github/workflows/dependency-check.yml
name: OWASP Dependency Check

on:
  schedule:
    - cron: '0 2 * * 0'  # Weekly on Sunday at 2 AM

jobs:
  dependency-check:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Dependency Check
        uses: dependency-check/Dependency-Check_Action@main
        with:
          project: 'my-project'
          path: '.'
          format: 'HTML'
          out: 'reports'

      - name: Upload Report
        uses: actions/upload-artifact@v4
        with:
          name: dependency-check-report
          path: reports/
```

---

## 2.3 Code Coverage

### Jest Coverage Configuration

**Configure Jest for coverage:**

```javascript
// jest.config.js
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',

	// Coverage configuration
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageReporters: ['text', 'lcov', 'html', 'json-summary'],

	// Files to collect coverage from
	collectCoverageFrom: [
		'src/**/*.{js,jsx,ts,tsx}',
		'!src/**/*.d.ts',
		'!src/**/*.stories.{js,jsx,ts,tsx}',
		'!src/**/__tests__/**',
		'!src/main.tsx',
		'!src/vite-env.d.ts',
	],

	// Coverage thresholds (fail if below)
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80,
		},
	},

	// Test match patterns
	testMatch: [
		'**/__tests__/**/*.[jt]s?(x)',
		'**/?(*.)+(spec|test).[jt]s?(x)',
	],
};
```

---

### Running Coverage

```bash
# Run tests with coverage
npm test -- --coverage

# Run with coverage and watch mode
npm test -- --coverage --watchAll

# Generate HTML report
npm test -- --coverage --coverageReporters=html

# Open HTML report
open coverage/index.html
```

---

### Coverage Report Example

```
----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------------------|---------|----------|---------|---------|-------------------
All files             |   87.5  |    85    |    90   |   88.2  |                   
 components           |   90.2  |    88    |   92.5  |   90.5  |                   
  Button.tsx          |   100   |   100    |   100   |   100   |                   
  Card.tsx            |   85.7  |    80    |   87.5  |   86.1  | 23-25,45          
  Modal.tsx           |   88.9  |    85    |   90    |   89.3  | 67-70             
 utils                |   82.3  |    80    |   85    |   83.1  |                   
  format.ts           |   90    |    87.5  |   92.3  |   90.5  | 12-15             
  validate.ts         |   75    |    71.4  |   77.8  |   76.2  | 34-40,56          
----------------------|---------|----------|---------|---------|-------------------
```

---

### Codecov Integration

```yaml
# .github/workflows/coverage.yml
name: Code Coverage

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  coverage:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm test -- --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
          fail_ci_if_error: true
```

---

## 2.4 Static Analysis: SonarQube

### What is SonarQube?

```
SonarQube = Platform for continuous inspection of code quality

What it analyzes:
✅ Code smells (maintainability issues)
✅ Bugs (reliability issues)
✅ Security vulnerabilities
✅ Code coverage
✅ Code duplication
✅ Complexity metrics
```

---

### SonarQube Setup with GitHub Actions

```yaml
# .github/workflows/sonarqube.yml
name: SonarQube Analysis

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    types: [ opened, synchronize, reopened ]

jobs:
  sonarqube:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Shallow clones should be disabled for better analysis

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm test -- --coverage

      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}

      - name: SonarQube Quality Gate check
        uses: sonarsource/sonarqube-quality-gate-action@master
        timeout-minutes: 5
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

---

### sonar-project.properties

```properties
# Project identification
sonar.projectKey=my-project
sonar.projectName=My Project
sonar.projectVersion=1.0

# Source code
sonar.sources=src
sonar.tests=src
sonar.test.inclusions=**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx

# Exclusions
sonar.exclusions=**/node_modules/**,**/dist/**,**/coverage/**,**/*.test.ts,**/*.test.tsx

# Coverage
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.typescript.lcov.reportPaths=coverage/lcov.info

# Language
sonar.sourceEncoding=UTF-8
```

---

# Part 3: Complete CI/CD Pipeline with Quality Gates

## 3.1 Production-Ready Pipeline

```yaml
# .github/workflows/ci-cd-complete.yml
name: Complete CI/CD Pipeline with Quality Gates

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '20'

jobs:
  # ============================================================================
  # Stage 1: Code Quality & Security
  # ============================================================================
  quality:
    name: Code Quality & Security
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      # Linting
      - name: Run ESLint
        run: npm run lint

      # Format checking
      - name: Check code formatting
        run: npm run format:check

      # Type checking
      - name: TypeScript type check
        run: npm run type-check

      # Security scanning
      - name: Run npm audit
        run: npm audit --audit-level=high
        continue-on-error: true

      - name: Snyk Security Scan
        uses: snyk/actions/node@master
        continue-on-error: true
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  # ============================================================================
  # Stage 2: Unit & Integration Tests
  # ============================================================================
  test:
    name: Unit & Integration Tests
    runs-on: ubuntu-latest
    needs: quality

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test -- --coverage

      - name: Check coverage thresholds
        run: |
          if [ -f coverage/coverage-summary.json ]; then
            node -e "
            const coverage = require('./coverage/coverage-summary.json');
            const total = coverage.total;
            if (total.lines.pct < 80 || total.branches.pct < 80) {
              console.error('Coverage below threshold!');
              process.exit(1);
            }
            console.log('Coverage meets threshold ✓');
            "
          fi

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/lcov.info
          fail_ci_if_error: true

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: test-results
          path: |
            coverage/
            test-results/

  # ============================================================================
  # Stage 3: E2E Tests (only on PR to main)
  # ============================================================================
  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'pull_request' && github.base_ref == 'main'

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Build application
        run: npm run build

      - name: Start application
        run: |
          npm run preview &
          npx wait-on http://localhost:4173

      - name: Run E2E tests
        run: npx playwright test

      - name: Upload E2E test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/

  # ============================================================================
  # Stage 4: Build
  # ============================================================================
  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: test

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  # ============================================================================
  # Stage 5: SonarQube Analysis
  # ============================================================================
  sonarqube:
    name: SonarQube Analysis
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'push'

    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm test -- --coverage

      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}

      - name: Quality Gate Check
        uses: sonarsource/sonarqube-quality-gate-action@master
        timeout-minutes: 5
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

---

## 3.2 Quality Gates Configuration

### What are Quality Gates?

```
Quality Gate = Set of conditions that code must meet before proceeding

Example conditions:
✅ Code coverage > 80%
✅ No critical bugs
✅ No security vulnerabilities (high severity)
✅ Technical debt < 5%
✅ Code duplication < 3%
```

---

### GitHub Branch Protection Rules

```
Settings → Branches → Branch protection rules → Add rule

Branch name pattern: main

Required checks:
☑ Require status checks to pass before merging
  ☑ quality (Code Quality & Security)
  ☑ test (Unit & Integration Tests)
  ☑ e2e (E2E Tests) [for PR only]
  ☑ build (Build Application)
  ☑ sonarqube/quality-gate (SonarQube Quality Gate)

☑ Require branches to be up to date before merging

Additional settings:
☑ Require linear history
☑ Include administrators
```

---

## 3.3 Badge Examples

Add to your `README.md`:

```markdown
# My Project

![Build Status](https://github.com/username/repo/workflows/CI/badge.svg)
![Coverage](https://codecov.io/gh/username/repo/branch/main/graph/badge.svg)
![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=username_repo&metric=alert_status)
![Security](https://snyk.io/test/github/username/repo/badge.svg)
![License](https://img.shields.io/github/license/username/repo)
```

---

# Summary

## Testing Pyramid Recap

```
E2E Tests (5%):
- Full user workflows
- Run before merge to main
- Slow but comprehensive

Integration Tests (15%):
- Component interactions
- Run on every commit
- Medium speed

Unit Tests (80%):
- Individual functions
- Run on every commit
- Fast feedback
```

---

## Code Quality Tools Recap

```
Linters:
✅ ESLint - catch bugs and enforce style
✅ Prettier - consistent code formatting

Security:
✅ npm audit - built-in vulnerability scanner
✅ Snyk - advanced security scanning
✅ OWASP Dependency-Check - known vulnerabilities

Coverage:
✅ Jest - test framework with coverage
✅ Codecov - coverage tracking and visualization

Static Analysis:
✅ SonarQube - comprehensive code quality platform
```

---

## Quality Gates Checklist

```
Before merge to main:
☐ All tests pass (unit, integration, E2E)
☐ Code coverage > 80%
☐ No linting errors
☐ Code formatted correctly
☐ Type checking passes
☐ No high-severity security vulnerabilities
☐ SonarQube quality gate passed
☐ Code reviewed and approved
```

---

**Congratulations!** You now have a complete understanding of automated testing and quality gates in CI/CD! 🎉

**Next Steps:** Implement these practices in your project! 🚀
