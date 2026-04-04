import '@testing-library/jest-dom';
import { beforeAll, afterAll } from 'vitest';
import React from 'react';

// Make React available globally for JSX without breaking TS global namespace
(globalThis as any).React = React;

// Store original console methods
const originalError = console.error;
const originalWarn = console.warn;

const getConsoleMessage = (args: unknown[]): string => {
  const [firstArg] = args;
  return typeof firstArg === 'string' ? firstArg : (firstArg as any)?.toString?.() || '';
};

const suppressedErrorPatterns = [
  /not wrapped in act\(/,
  /Not implemented: navigation/,
  /non-boolean attribute/,
  /\/auth\/me failed/,
  /Missing GitHub OAuth client/,
  /NEXT_PUBLIC_API environment variable is not defined/,
];

const suppressedWarnPatterns = [
  /not wrapped in act\(/,
  /Function components cannot be given refs/,
];

const shouldSuppressMessage = (message: string, patterns: RegExp[]) =>
  patterns.some((pattern) => pattern.test(message));

// Suppress specific React warnings that are expected in test environment
beforeAll(() => {
  console.error = (...args: Parameters<typeof console.error>) => {
    const errorMessage = getConsoleMessage(args);

    if (shouldSuppressMessage(errorMessage, suppressedErrorPatterns)) {
      return;
    }

    // Log all other errors
    originalError.call(console, ...args);
  };

  console.warn = (...args: Parameters<typeof console.warn>) => {
    const warnMessage = getConsoleMessage(args);

    if (shouldSuppressMessage(warnMessage, suppressedWarnPatterns)) {
      return;
    }

    // Log all other warnings
    originalWarn.call(console, ...args);
  };
});

// Restore console methods after all tests
afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
