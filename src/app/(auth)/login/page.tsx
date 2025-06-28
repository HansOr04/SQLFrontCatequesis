'use client';
import React from 'react';
import { LoginForm } from '../../../components/auth/LoginForm';
import { AuthLayout } from '@/components/layout/Layout';

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}