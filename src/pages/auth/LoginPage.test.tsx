import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from './LoginPage';
import { api } from '../../services/api';

// Mock react-router-dom
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

// Mock API service
vi.mock('../../services/api', () => ({
  api: {
    login: vi.fn(),
    register: vi.fn(),
    sendOtp: vi.fn(),
    resetPasswordWithOtp: vi.fn(),
  },
}));

describe('Frontend UI: LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the login page elements correctly', () => {
    render(<LoginPage />);

    expect(screen.getAllByText(/SocietySaaS/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /Welcome Back/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/admin@greenvalleyresidency.in/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/admin123 or resident123/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In to Portal/i })).toBeInTheDocument();
  });

  it('allows user to switch between Sign In and Register tabs', () => {
    render(<LoginPage />);

    const registerTab = screen.getByRole('button', { name: /Register Society Admin/i });
    fireEvent.click(registerTab);

    expect(screen.getByRole('heading', { name: /Register Society Admin/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Rajesh Kulkarni/i)).toBeInTheDocument();

    const signInTab = screen.getByRole('button', { name: /Sign In/i });
    fireEvent.click(signInTab);

    expect(screen.getByRole('heading', { name: /Welcome Back/i })).toBeInTheDocument();
  });

  it('handles successful sign-in flow and redirects', async () => {
    (api.login as any).mockResolvedValueOnce({
      token: 'fake-jwt-token-xyz',
      id: 1,
      name: 'Rajesh Sharma',
      email: 'admin@greenvalleyresidency.in',
      role: 'ROLE_ADMIN',
      societyName: 'Green Valley Residency',
      message: 'Login successful',
    });

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(/admin@greenvalleyresidency.in/i);
    const passwordInput = screen.getByPlaceholderText(/admin123 or resident123/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In to Portal/i });

    fireEvent.change(emailInput, { target: { value: 'admin@greenvalleyresidency.in' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith('admin@greenvalleyresidency.in', 'admin123');
      expect(mockSetRole).toHaveBeenCalledWith('admin');
      expect(mockShowToast).toHaveBeenCalledWith(
        'success',
        expect.stringContaining('Rajesh Sharma'),
        expect.stringContaining('Green Valley Residency')
      );
      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  it('handles sign-in error and displays error toast', async () => {
    (api.login as any).mockRejectedValueOnce(new Error('Invalid email or password'));

    render(<LoginPage />);

    const emailInput = screen.getByPlaceholderText(/admin@greenvalleyresidency.in/i);
    const passwordInput = screen.getByPlaceholderText(/admin123 or resident123/i);
    const submitBtn = screen.getByRole('button', { name: /Sign In to Portal/i });

    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'badpass' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith('wrong@example.com', 'badpass');
      expect(mockShowToast).toHaveBeenCalledWith(
        'error',
        'Login Failed',
        'Invalid email or password'
      );
    });
  });

  it('opens and closes forgot password OTP modal', () => {
    render(<LoginPage />);

    const forgotBtn = screen.getByText(/Forgot password with OTP\?/i);
    fireEvent.click(forgotBtn);

    expect(screen.getByRole('heading', { name: /Reset Password via Mobile OTP/i })).toBeInTheDocument();

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);

    expect(screen.queryByRole('heading', { name: /Reset Password via Mobile OTP/i })).not.toBeInTheDocument();
  });
});
