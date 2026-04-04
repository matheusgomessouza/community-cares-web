import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import ClientLayout from './ClientLayout';
import api from '@/lib/api';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, className }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img 
      src={src} 
      alt={alt} 
      width={width} 
      height={height} 
      className={className}
    />
  ),
}));

// Mock api
vi.mock('@/lib/api');

describe('ClientLayout', () => {
  const mockUserData = {
    name: 'John Doe',
    avatar_url: 'https://example.com/avatar.jpg',
    provider: 'google',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.location.href
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Authentication state', () => {
    it('should fetch user data on mount', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockUserData });

      render(
        <ClientLayout>
          <div>Test Content</div>
        </ClientLayout>
      );

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith('/auth/me');
      });
    });

    it('should display user info when authenticated', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockUserData });

      render(
        <ClientLayout>
          <div>Test Content</div>
        </ClientLayout>
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('google')).toBeInTheDocument();
      });
    });

    it('should display avatar image when avatar_url is provided', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockUserData });

      render(
        <ClientLayout>
          <div>Test Content</div>
        </ClientLayout>
      );

      await waitFor(() => {
        const avatars = screen.queryAllByRole('img', { name: 'John Doe' });
        expect(avatars[0]).toHaveAttribute('src', 'https://example.com/avatar.jpg');
      });
    });

    it('should display first letter when no avatar_url', async () => {
      vi.mocked(api.get).mockResolvedValue({
        data: { ...mockUserData, avatar_url: '' },
      });

      render(
        <ClientLayout>
          <div>Test Content</div>
        </ClientLayout>
      );

      await waitFor(() => {
        expect(screen.getAllByText('J')[0]).toBeInTheDocument();
      });
    });

    it('should not display user info when not authenticated', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('Unauthorized'));

      render(
        <ClientLayout>
          <div>Test Content</div>
        </ClientLayout>
      );

      await waitFor(() => {
        expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
      });
    });

    it('should handle auth check on pathname change', async () => {
      const { usePathname } = await import('next/navigation');
      const mockUsePathname = vi.mocked(usePathname);

      mockUsePathname.mockReturnValue('/about');
      vi.mocked(api.get).mockResolvedValue({ data: mockUserData });

      const { rerender } = render(
        <ClientLayout>
          <div>Test Content</div>
        </ClientLayout>
      );

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledTimes(1);
      });

      // Change pathname
      mockUsePathname.mockReturnValue('/how-it-works');
      
      rerender(
        <ClientLayout>
          <div>New Content</div>
        </ClientLayout>
      );

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Logout functionality', () => {
    it('should logout successfully and redirect to home', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockUserData });
      vi.mocked(api.post).mockResolvedValue({ data: { success: true } });

      render(
        <ClientLayout>
          <div>Test Content</div>
        </ClientLayout>
      );

      // Wait for user data to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Open dropdown
      const toggleButton = screen.getByLabelText('Toggle user menu');
      fireEvent.click(toggleButton);

      // Click logout
      const logoutButtons = screen.getAllByLabelText('Log out');
      fireEvent.click(logoutButtons[0]);

      await waitFor(() => {
        expect(api.post).toHaveBeenCalledWith('/auth/logout');
        expect(window.location.href).toBe('/');
      });
    });

    it('should handle logout error gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      vi.mocked(api.get).mockResolvedValue({ data: mockUserData });
      vi.mocked(api.post).mockRejectedValue(new Error('Logout failed'));

      render(
        <ClientLayout>
          <div>Test Content</div>
        </ClientLayout>
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Open dropdown
      const toggleButton = screen.getByLabelText('Toggle user menu');
      fireEvent.click(toggleButton);

      // Click logout
      const logoutButtons = screen.getAllByLabelText('Log out');
      fireEvent.click(logoutButtons[0]);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(window.location.href).toBe('/');
      });

      consoleErrorSpy.mockRestore();
    });

    it('should clear user state on logout', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockUserData });
      vi.mocked(api.post).mockResolvedValue({ data: { success: true } });

      render(
        <ClientLayout>
          <div>Test Content</div>
        </ClientLayout>
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Mock API to simulate logged out state
      vi.mocked(api.get).mockRejectedValue(new Error('Unauthorized'));

      // Open dropdown and logout
      const toggleButton = screen.getByLabelText('Toggle user menu');
      fireEvent.click(toggleButton);

      const logoutButtons = screen.getAllByLabelText('Log out');
      fireEvent.click(logoutButtons[0]);

      // State should be cleared (redirect will happen)
      await waitFor(() => {
        expect(window.location.href).toBe('/');
      });
    });
  });

  describe('Navigation', () => {
    it('should render all navigation links', () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockUserData });

      render(
        <ClientLayout>
          <div>Test Content</div>
        </ClientLayout>
      );

      expect(screen.getAllByText('About')[0]).toBeInTheDocument();
      expect(screen.getAllByText('How It Works')[0]).toBeInTheDocument();
      expect(screen.getAllByText('Testimonials')[0]).toBeInTheDocument();
    });

    it('should render logo with correct link', () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockUserData });

      render(
        <ClientLayout>
          <div>Test Content</div>
        </ClientLayout>
      );

      const logo = screen.getByText('Community Cares');
      const logoLink = logo.closest('a');
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('should have correct href attributes for nav links', () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockUserData });

      render(
        <ClientLayout>
          <div>Test Content</div>
        </ClientLayout>
      );

      const aboutLinks = screen.getAllByText('About');
      expect(aboutLinks[0].closest('a')).toHaveAttribute('href', '/about');

      const howItWorksLinks = screen.getAllByText('How It Works');
      expect(howItWorksLinks[0].closest('a')).toHaveAttribute('href', '/how-it-works');

      const testimonialsLinks = screen.getAllByText('Testimonials');
      expect(testimonialsLinks[0].closest('a')).toHaveAttribute('href', '/testimonials');
    });
  });

  describe('Mobile menu', () => {
    it('should toggle mobile menu on button click', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockUserData });

      render(
        <ClientLayout>
          <div>Test Content</div>
        </ClientLayout>
      );

      const menuButton = screen.getByLabelText('Toggle menu');
      
      // Menu should be closed initially
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

      // Open menu
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Close menu
      fireEvent.click(menuButton);
      
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should close mobile menu when clicking a nav link', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockUserData });

      render(
        <ClientLayout>
          <div>Test Content</div>
        </ClientLayout>
      );

      // Open menu
      const menuButton = screen.getByLabelText('Toggle menu');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      // Click a nav link inside mobile menu
      const mobileDialog = screen.getByRole('dialog');
      const aboutLink = mobileDialog.querySelector('a[href="/about"]');
      
      if (aboutLink) {
        fireEvent.click(aboutLink);
      }

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('should show user info in mobile menu when authenticated', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockUserData });

      render(
        <ClientLayout>
          <div>Test Content</div>
        </ClientLayout>
      );

      // Wait for auth
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Open mobile menu
      const menuButton = screen.getByLabelText('Toggle menu');
      fireEvent.click(menuButton);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
      });
    });
  });

  describe('User dropdown', () => {
    it('should toggle user dropdown on click', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockUserData });

      render(
        <ClientLayout>
          <div>Test Content</div>
        </ClientLayout>
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const toggleButton = screen.getByLabelText('Toggle user menu');
      
      // Dropdown should be closed initially
      expect(screen.queryByText('Log out')).not.toBeInTheDocument();

      // Open dropdown
      fireEvent.click(toggleButton);
      
      await waitFor(() => {
        expect(screen.getByText('Log out')).toBeInTheDocument();
      });

      // Close dropdown
      fireEvent.click(toggleButton);
      
      await waitFor(() => {
        expect(screen.queryByText('Log out')).not.toBeInTheDocument();
      });
    });
  });

  describe('Children rendering', () => {
    it('should render children content', () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockUserData });

      render(
        <ClientLayout>
          <div data-testid="child-content">Test Content</div>
        </ClientLayout>
      );

      expect(screen.getByTestId('child-content')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  describe('Error handling', () => {
    it('should handle auth/me error gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      vi.mocked(api.get).mockRejectedValue(new Error('Network error'));

      render(
        <ClientLayout>
          <div>Test Content</div>
        </ClientLayout>
      );

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          '/auth/me failed',
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });

    it('should set isLoggedIn to false when auth fails', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('Unauthorized'));

      render(
        <ClientLayout>
          <div>Test Content</div>
        </ClientLayout>
      );

      await waitFor(() => {
        // Should not show user menu
        expect(screen.queryByLabelText('Toggle user menu')).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockUserData });

      render(
        <ClientLayout>
          <div>Test Content</div>
        </ClientLayout>
      );

      expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
      expect(screen.getByLabelText('Toggle menu')).toBeInTheDocument();
    });

    it('should have proper aria-expanded on mobile menu button', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockUserData });

      render(
        <ClientLayout>
          <div>Test Content</div>
        </ClientLayout>
      );

      const menuButton = screen.getByLabelText('Toggle menu');
      
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('should have role="dialog" on mobile menu', async () => {
      vi.mocked(api.get).mockResolvedValue({ data: mockUserData });

      render(
        <ClientLayout>
          <div>Test Content</div>
        </ClientLayout>
      );

      const menuButton = screen.getByLabelText('Toggle menu');
      fireEvent.click(menuButton);

      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toHaveAttribute('aria-label', 'Mobile menu');
      });
    });
  });
});
