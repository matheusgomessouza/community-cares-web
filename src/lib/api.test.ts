import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

describe('API Client', () => {
  beforeEach(() => {
    // Clear module cache to reset axios instance
    vi.resetModules();
  });

  it('should create axios instance with correct baseURL from environment variable', async () => {
    // Set environment variable
    process.env.NEXT_PUBLIC_API = 'https://api.example.com';
    
    // Dynamically import to pick up env variable
    const { default: api } = await import('./api');
    
    expect(api.defaults.baseURL).toBe('https://api.example.com');
  });

  it('should enable withCredentials for cookie support', async () => {
    process.env.NEXT_PUBLIC_API = 'https://api.example.com';
    
    const { default: api } = await import('./api');
    
    expect(api.defaults.withCredentials).toBe(true);
  });

  it('should set timeout to 15000ms', async () => {
    process.env.NEXT_PUBLIC_API = 'https://api.example.com';
    
    const { default: api } = await import('./api');
    
    expect(api.defaults.timeout).toBe(15000);
  });

  it('should log error when NEXT_PUBLIC_API is not defined', async () => {
    // Store original console.error
    const originalError = console.error;
    const consoleErrorMock = vi.fn();
    console.error = consoleErrorMock;
    
    // Clear environment variable
    delete process.env.NEXT_PUBLIC_API;
    
    // Import api client (will trigger console.error)
    await import('./api');
    
    expect(consoleErrorMock).toHaveBeenCalledWith(
      'NEXT_PUBLIC_API environment variable is not defined. Axios client will use relative URLs against the current origin.'
    );
    
    // Restore console.error
    console.error = originalError;
  });

  it('should create axios instance when NEXT_PUBLIC_API is undefined', async () => {
    delete process.env.NEXT_PUBLIC_API;
    
    const { default: api } = await import('./api');
    
    expect(api.defaults.baseURL).toBeUndefined();
    expect(api.defaults.withCredentials).toBe(true);
    expect(api.defaults.timeout).toBe(15000);
  });

  it('should be an axios instance', async () => {
    process.env.NEXT_PUBLIC_API = 'https://api.example.com';
    
    const { default: api } = await import('./api');
    
    // Check if it has axios methods
    expect(typeof api.get).toBe('function');
    expect(typeof api.post).toBe('function');
    expect(typeof api.put).toBe('function');
    expect(typeof api.delete).toBe('function');
    expect(typeof api.patch).toBe('function');
  });

  it('should handle different baseURL formats correctly', async () => {
    const testCases = [
      'https://api.example.com',
      'http://localhost:8080',
      'https://api.example.com/',
      'http://192.168.1.1:3001',
    ];

    for (const baseURL of testCases) {
      vi.resetModules();
      process.env.NEXT_PUBLIC_API = baseURL;
      
      const { default: api } = await import('./api');
      
      expect(api.defaults.baseURL).toBe(baseURL);
    }
  });
});
