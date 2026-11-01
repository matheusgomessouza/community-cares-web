import { beforeEach, describe, expect, it, vi } from "vitest";
import api from "@/lib/api";
import { ApiStorageService } from "./StorageService";

vi.mock("@/lib/api");

describe("ApiStorageService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("posts the file to /uploads and returns the URL", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: { url: "https://bucket.s3.sa-east-1.amazonaws.com/locations/a.webp" },
    });
    const file = new File(["image"], "photo.webp", { type: "image/webp" });

    const url = await new ApiStorageService().uploadImage(file);

    expect(url).toBe(
      "https://bucket.s3.sa-east-1.amazonaws.com/locations/a.webp",
    );

    const [path, body] = vi.mocked(api.post).mock.calls[0];
    const formData = body as FormData;

    expect(path).toBe("/uploads");
    expect(formData.get("image")).toBe(file);
  });

  it.each([
    ["an empty object", { data: {} }],
    ["an empty URL", { data: { url: "" } }],
    ["a null URL", { data: { url: null } }],
    ["a null body", { data: null }],
  ])("throws when the endpoint returns %s", async (_label, response) => {
    vi.mocked(api.post).mockResolvedValue(response);
    const file = new File(["image"], "photo.jpg", { type: "image/jpeg" });

    await expect(new ApiStorageService().uploadImage(file)).rejects.toThrow(
      "The upload endpoint returned no URL",
    );
  });

  it("throws when the request fails", async () => {
    const failure = new Error("timeout exceeded");
    vi.mocked(api.post).mockRejectedValue(failure);
    const file = new File(["image"], "photo.jpg", { type: "image/jpeg" });

    await expect(new ApiStorageService().uploadImage(file)).rejects.toBe(
      failure,
    );
  });
});
