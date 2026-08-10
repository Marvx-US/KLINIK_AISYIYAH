'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { loginAction } from '../actions/auth';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [successRedirect, setSuccessRedirect] = useState(false);

  useEffect(() => {
    if (state?.success) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuccessRedirect(true);
      router.push('/admin');
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-snow px-6 py-12">
      <div className="max-w-md w-full">
        {/* Logo and header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group mb-6">
            <div className="h-11 w-11 rounded-full overflow-hidden shrink-0 border border-primary/20 shadow-sm transition-transform group-hover:scale-105 duration-300">
              <Image
                src="/logo.png"
                alt={`Logo ${KLINIK_INFO.name}`}
                width={44}
                height={44}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <div className="text-left">
              <span className="font-heading font-extrabold text-xl tracking-tight text-text-dark">
                Klinik <span className="text-primary">Aisyiyah</span>
              </span>
              <p className="text-[10px] text-text-muted font-sans tracking-widest uppercase -mt-1">
                Portal Admin
              </p>
            </div>
          </Link>
          <h2 className="font-heading font-extrabold text-2xl text-text-dark tracking-tight">
            Masuk ke Portal Admin
          </h2>
          <p className="text-text-muted text-sm mt-2">
            Silakan masukkan kredensial Anda untuk mengelola konten.
          </p>
        </div>

        {/* Login form Card */}
        <div className="bg-white rounded-3xl border-fine p-8 shadow-sm">
          <form action={formAction} className="space-y-6">
            {/* Error Message */}
            {state?.error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex gap-3 items-start">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{state.error}</span>
              </div>
            )}

            {/* Success message redirection */}
            {successRedirect && (
              <div className="p-4 rounded-xl bg-primary-light border border-primary/20 text-primary text-sm flex gap-3 items-center">
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                <span>Berhasil masuk! Mengarahkan ke dashboard...</span>
              </div>
            )}

            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Masukkan username admin"
                  className="w-full bg-white border border-border-fine rounded-full py-3 pl-11 pr-4 text-sm font-sans focus:outline-none focus:border-primary text-text-dark transition-all"
                  disabled={isPending || successRedirect}
                />
                <User className="absolute left-4 top-3.5 h-4.5 w-4.5 text-text-muted" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-bold text-text-dark uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Masukkan password"
                  className="w-full bg-white border border-border-fine rounded-full py-3 pl-11 pr-4 text-sm font-sans focus:outline-none focus:border-primary text-text-dark transition-all"
                  disabled={isPending || successRedirect}
                />
                <Lock className="absolute left-4 top-3.5 h-4.5 w-4.5 text-text-muted" />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending || successRedirect}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-primary text-white font-sans text-sm font-semibold transition-all duration-300 hover:bg-primary-dark active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                'Masuk Sekarang'
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs text-text-muted hover:text-primary transition-colors font-semibold"
          >
            &larr; Kembali ke Beranda Publik
          </Link>
        </div>
      </div>
    </div>
  );
}
