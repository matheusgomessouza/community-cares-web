import '@testing-library/jest-dom';
import { beforeAll, afterAll } from 'vitest';
import React from 'react';

// Make React available globally for JSX
global.React = React;

// Store original console methods
const originalError = console.error;
const originalWarn = console.warn;

// Suppress specific React warnings that are expected in test environment
beforeAll(() => {
  console.error = (...args: Parameters<typeof console.error>) => {
    const errorMessage = typeof args[0] === 'string' ? args[0] : args[0]?.toString?.() || '';
    
    // Suppress React act() warnings - these are handled by @testing-library/react's waitFor
    if (errorMessage.includes('not wrapped in act(')) {
      return;
    }
    
    // Suppress jsdom navigation warnings - jsdom doesn't fully implement navigation
    if (errorMessage.includes('Not implemented: navigation')) {
      return;
    }
    
    // Suppress styled-jsx attribute warnings - this is a known Next.js issue
    if (errorMessage.includes('non-boolean attribute')) {
      return;
    }

    // Suppress expected API errors in tests (they're intentional)
    if (errorMessage.includes('/auth/me failed')) {
      return;
    }

    // Suppress expected config errors in tests
    if (errorMessage.includes('Missing GitHub OAuth client')) {
      return;
    }

    // Suppress expected environment variable warnings in tests
    if (errorMessage.includes('NEXT_PUBLIC_API environment variable is not defined')) {
      return;
    }
    
    // Log all other errors
    originalError.call(console, ...args);
  };

  console.warn = (...args: Parameters<typeof console.warn>) => {
    const warnMessage = typeof args[0] === 'string' ? args[0] : args[0]?.toString?.() || '';
    
    // Suppress React warnings about updates not wrapped in act()
    if (warnMessage.includes('not wrapped in act(')) {
      return;
    }

    // Suppress forwardRef warnings
    if (warnMessage.includes('Function components cannot be given refs')) {
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
