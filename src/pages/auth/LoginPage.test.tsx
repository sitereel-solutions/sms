import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import LoginPage from './LoginPage';
import { api } from '../../services/api';

// Mock navigation
const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock SocietyContext
const mockSetRole = vi.fn();
const mockShowToast = vi.fn();

vi.mock('../../context/SocietyContext', () => ({
  useSociety: () => ({
    setRole: mockSetRole,
    showToast: mockShowToast,
  }),
}));

// Mock API
vi.mock('../../services/api', () => ({
  api: {
    login: vi.fn(),
    register: vi.fn(),
    sendOtp: vi.fn(),
    resetPasswordWithOtp: vi.fn(),
  },
}));

describe('LoginPage', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });


  // --------------------------------------------------
  // 1. RENDER TEST
  // --------------------------------------------------

  it('renders the login page correctly', () => {

    render(<LoginPage />);

    expect(
      screen.getAllByText(/SocietySaaS/i).length
    ).toBeGreaterThan(0);

    expect(
      screen.getByRole('heading', {
        name: /Welcome Back/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        /admin@greenvalleyresidency.in/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        /admin123 or resident123/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', {
        name: /Sign In to Portal/i,
      })
    ).toBeInTheDocument();
  });


  // --------------------------------------------------
  // 2. TAB SWITCH TEST
  // --------------------------------------------------

  it('allows switching between Sign In and Register', async () => {

    const user = userEvent.setup();

    render(<LoginPage />);

    const registerTab = screen.getByRole(
      'button',
      {
        name: /Register Society Admin/i,
      }
    );

    await user.click(registerTab);

    expect(
      screen.getByRole('heading', {
        name: /Register Society Admin/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/Rajesh Kulkarni/i)
    ).toBeInTheDocument();


    const signInTab = screen.getByRole(
      'button',
      {
        name: /Sign In/i,
      }
    );

    await user.click(signInTab);

    expect(
      screen.getByRole('heading', {
        name: /Welcome Back/i,
      })
    ).toBeInTheDocument();
  });


  // --------------------------------------------------
  // 3. SUCCESSFUL LOGIN
  // --------------------------------------------------

  it('handles successful sign-in and redirects admin', async () => {

    const user = userEvent.setup();

    vi.mocked(api.login).mockResolvedValueOnce({
      token: 'fake-jwt-token-xyz',
      id: 1,
      name: 'Rajesh Sharma',
      email: 'admin@greenvalleyresidency.in',
      role: 'ROLE_ADMIN',
      societyName: 'Green Valley Residency',
      message: 'Login successful',
    });

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(
      /admin@greenvalleyresidency.in/i
    );

    const passwordInput = screen.getByPlaceholderText(
      /admin123 or resident123/i
    );

    const submitBtn = screen.getByRole(
      'button',
      {
        name: /Sign In to Portal/i,
      }
    );

    await user.type(
      emailInput,
      'admin@greenvalleyresidency.in'
    );

    await user.type(
      passwordInput,
      'admin123'
    );

    await user.click(submitBtn);


    await waitFor(() => {

      expect(api.login).toHaveBeenCalledWith(
        'admin@greenvalleyresidency.in',
        'admin123'
      );

      expect(mockSetRole).toHaveBeenCalledWith(
        'admin'
      );

      expect(mockShowToast).toHaveBeenCalledWith(
        'success',
        expect.stringContaining('Rajesh Sharma'),
        expect.stringContaining(
          'Green Valley Residency'
        )
      );

      expect(mockNavigate).toHaveBeenCalledWith(
        '/admin'
      );
    });
  });


  // --------------------------------------------------
  // 4. LOGIN FAILURE
  // --------------------------------------------------

  it('handles invalid login credentials', async () => {

    const user = userEvent.setup();

    vi.mocked(api.login).mockRejectedValueOnce(
      new Error('Invalid email or password')
    );

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(
      /admin@greenvalleyresidency.in/i
    );

    const passwordInput = screen.getByPlaceholderText(
      /admin123 or resident123/i
    );

    const submitBtn = screen.getByRole(
      'button',
      {
        name: /Sign In to Portal/i,
      }
    );

    await user.type(
      emailInput,
      'wrong@example.com'
    );

    await user.type(
      passwordInput,
      'badpass'
    );

    await user.click(submitBtn);


    await waitFor(() => {

      expect(api.login).toHaveBeenCalledWith(
        'wrong@example.com',
        'badpass'
      );

      expect(mockShowToast).toHaveBeenCalledWith(
        'error',
        'Login Failed',
        'Invalid email or password'
      );
    });
  });


  // --------------------------------------------------
  // 5. FORGOT PASSWORD MODAL
  // --------------------------------------------------

  it('opens and closes forgot password modal', async () => {

    const user = userEvent.setup();

    render(<LoginPage />);

    const forgotBtn = screen.getByText(
      /Forgot password with OTP\?/i
    );

    await user.click(forgotBtn);

    expect(
      screen.getByRole('heading', {
        name: /Reset Password via Mobile OTP/i,
      })
    ).toBeInTheDocument();


    const cancelBtn = screen.getByRole(
      'button',
      {
        name: /Cancel/i,
      }
    );

    await user.click(cancelBtn);

    expect(
      screen.queryByRole('heading', {
        name: /Reset Password via Mobile OTP/i,
      })
    ).not.toBeInTheDocument();
  });

});