import { Metadata } from 'next';
import ResetPasswordView from '@/features/auth/components/reset-password-view';

export const metadata: Metadata = {
  title: 'Authentication | Reset Password',
  description: 'Reset Password page for authentication.'
};

export default function ResetPasswordPage() {
  return <ResetPasswordView />;
} 