import React, { useEffect, useRef } from "react";
import { StoryFormData } from "./types";

interface ShareStoryModalComponentProps {
  isOpen: boolean;
  formData: StoryFormData;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export default function ShareStoryModalComponent({
  isOpen,
  formData,
  onClose,
  onSubmit,
  onChange,
}: ShareStoryModalComponentProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    firstInputRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || !dialogRef.current) {
      return;
    }

    const focusableSelectors =
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])';
    const elements = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(focusableSelectors),
    ).filter((item) => !item.hasAttribute("disabled"));

    if (elements.length === 0) {
      return;
    }

    const first = elements[0];
    const last = elements[elements.length - 1];
    const active = document.activeElement;

    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-modal-title"
        aria-describedby="story-modal-description"
        className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <header className="flex justify-between items-center mb-5">
          <h2
            id="story-modal-title"
            className="font-heading text-3xl text-darkOrange"
          >
            Share Your Story
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-black/70 hover:text-black transition-colors"
            aria-label="Close story form"
          >
            ✕
          </button>
        </header>

        <p
          id="story-modal-description"
          className="font-paragraph text-black/80 mb-5"
        >
          Tell us how Community Cares helped your community.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block font-paragraph font-medium text-sm text-black mb-1"
            >
              Your Name
            </label>
            <input
              ref={firstInputRef}
              id="name"
              name="name"
              value={formData.name}
              onChange={onChange}
              required
              autoComplete="name"
              className="w-full rounded-lg border border-gray/60 px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkOrange"
              placeholder="e.g. Jane Doe"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block font-paragraph font-medium text-sm text-black mb-1"
            >
              Your Role
            </label>
            <input
              id="role"
              name="role"
              value={formData.role}
              onChange={onChange}
              required
              className="w-full rounded-lg border border-gray/60 px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkOrange"
              placeholder="e.g. Volunteer"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block font-paragraph font-medium text-sm text-black mb-1"
            >
              Testimonial
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={onChange}
              required
              rows={4}
              className="w-full rounded-lg border border-gray/60 px-4 py-2 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-darkOrange"
              placeholder="Share your experience..."
            />
          </div>

          <div className="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="font-paragraph px-4 py-2 rounded-full border border-black/20 text-black hover:bg-black/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="font-paragraph font-semibold px-6 py-2 rounded-full bg-orange text-black hover:bg-darkOrange hover:text-white transition-colors"
            >
              Publish Story
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
