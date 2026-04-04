import { describe, it, expect } from 'vitest';
import { githubInstance } from './github';

describe('GitHub API Client', () => {
  it('should create axios instance with GitHub baseURL', () => {
    expect(githubInstance.defaults.baseURL).toBe('https://github.com');
  });

  it('should be an axios instance with standard methods', () => {
    expect(typeof githubInstance.get).toBe('function');
    expect(typeof githubInstance.post).toBe('function');
    expect(typeof githubInstance.put).toBe('function');
    expect(typeof githubInstance.delete).toBe('function');
    expect(typeof githubInstance.patch).toBe('function');
  });

  it('should not have withCredentials enabled by default', () => {
    // GitHub OAuth flow doesn't require credentials by default
    expect(githubInstance.defaults.withCredentials).toBeUndefined();
  });

  it('should not have a timeout set by default', () => {
    // No custom timeout, uses axios default
    expect(githubInstance.defaults.timeout).toBe(0);
  });

  it('should be separate from main API instance', async () => {
    // Ensure it's a separate instance
    const { default: api } = await import('./api');
    
    expect(githubInstance).not.toBe(api);
    expect(githubInstance.defaults.baseURL).not.toBe(api.defaults.baseURL);
  });
});
