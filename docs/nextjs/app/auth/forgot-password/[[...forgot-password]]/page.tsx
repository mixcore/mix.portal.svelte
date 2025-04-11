import { Metadata } from 'next';
import ForgotPasswordView from '@/features/auth/components/forgot-password-view';

export const metadata: Metadata = {
  title: 'Authentication | Forgot Password',
  description: 'Forgot Password page for authentication.'
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
} 