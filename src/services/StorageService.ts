export interface IStorageService {
  uploadImage(file: File): Promise<string>;
}

export class MockStorageService implements IStorageService {
  async uploadImage(file: File): Promise<string> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Generate a random ID to prevent leaking local filenames and avoid collisions
    const randomId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    return `https://mock-storage.url/${randomId}`;
  }
}

// Export a singleton instance. 
// When the real backend is ready, we can swap this out with AWS S3 implementation.
export const storageService = new MockStorageService();
