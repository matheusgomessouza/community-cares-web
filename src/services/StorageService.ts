export interface IStorageService {
  uploadImage(file: File): Promise<string>;
}

export class MockStorageService implements IStorageService {
  async uploadImage(file: File): Promise<string> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Mocking upload for file: ${file.name}`);
    return `https://mock-storage.url/${encodeURIComponent(file.name)}`;
  }
}

// Export a singleton instance. 
// When the real backend is ready, we can swap this out with AWS S3 implementation.
export const storageService = new MockStorageService();
