'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { Loader2, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  const { user, isLoading, logout } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-secondary rounded-sm w-48" />
        <div className="h-4 bg-secondary rounded-sm w-64" />
        <div className="h-4 bg-secondary rounded-sm w-40" />
      </div>
    );
  }

  if (!user) return null;

  const handleSaveName = async () => {
    if (!name.trim()) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (res.ok) {
        showToast('Name updated', 'success');
        setIsEditing(false);
        window.location.reload();
      } else {
        showToast('Failed to update', 'error');
      }
    } catch {
      showToast('Something went wrong', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const memberSince = new Date(user.createdAt).toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div>
      {/* First purchase banner */}
      {user.isFirstPurchase && (
        <div className="bg-primary/10 border border-primary/20 rounded-sm p-4 mb-6">
          <p className="text-sm text-ivory/75">
            Welcome! Use code <strong className="text-primary">WELCOME10</strong> at
            checkout for 10% off your first order.
          </p>
        </div>
      )}

      <h1 className="type-h4 text-ivory mb-6">Profile</h1>

      <div className="space-y-5">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
              {(user.name || user.email || user.phone || '?')[0].toUpperCase()}
            </div>
          )}
          <div>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="h-9 border border-ivory/15 rounded-sm px-3 text-sm focus:outline-none focus:border-primary"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  disabled={isSaving}
                  className="text-xs text-primary hover:text-primary/80"
                >
                  {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Save'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-ivory/35 hover:text-ivory/55"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-base font-medium text-ivory">
                  {user.name || 'Add your name'}
                </p>
                <button
                  onClick={() => {
                    setName(user.name || '');
                    setIsEditing(true);
                  }}
                  className="text-xs text-ivory/35 hover:text-primary transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
            <p className="text-xs text-ivory/35 mt-0.5">
              Member since {memberSince}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="border-t border-ivory/5 pt-5 space-y-3">
          {user.email && (
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-ivory/35">Email</span>
              <span className="text-sm text-ivory/75">{user.email}</span>
            </div>
          )}
          {user.phone && (
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-ivory/35">Phone</span>
              <span className="text-sm text-ivory/75">{user.phone}</span>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="border-t border-ivory/5 pt-5 space-y-2">
          <Link
            href="/account/orders"
            className="block text-sm text-ivory/55 hover:text-primary transition-colors"
          >
            View Order History &rarr;
          </Link>
          <Link
            href="/account/addresses"
            className="block text-sm text-ivory/55 hover:text-primary transition-colors"
          >
            Manage Addresses &rarr;
          </Link>
        </div>

        {/* Logout */}
        <div className="border-t border-ivory/5 pt-5">
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-ivory/35 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
