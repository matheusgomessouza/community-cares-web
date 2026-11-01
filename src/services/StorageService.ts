import api from "@/lib/api";

export interface IStorageService {
  uploadImage(file: File): Promise<string>;
}

export class ApiStorageService implements IStorageService {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("image", file);

    // The browser sends the httpOnly session cookie. The API rejects the
    // request when the cookie is missing or expired.
    const { data } = await api.post<{ url?: string }>("/uploads", formData);

    if (!data?.url) {
      throw new Error("The upload endpoint returned no URL");
    }

    return data.url;
  }
}

export const storageService = new ApiStorageService();
