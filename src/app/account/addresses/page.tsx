'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePincodeAutofill } from '@/hooks/usePincodeAutofill';
import { Button, FloatingInput } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { Check, Loader2, Trash2, Plus } from 'lucide-react';

interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const EMPTY_FORM = {
  label: 'Home',
  name: '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
};

export default function AddressesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const pincodeStatus = usePincodeAutofill(form.pincode, ({ city, state }) =>
    setForm((prev) => ({ ...prev, city, state }))
  );

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await fetch('/api/account/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user) fetchAddresses();
  }, [authLoading, user, fetchAddresses]);

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.line1 || !form.city || !form.state || !form.pincode) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      showToast('Enter a valid 6-digit pincode', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const url = editingId
        ? `/api/account/addresses/${editingId}`
        : '/api/account/addresses';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        showToast(editingId ? 'Address updated' : 'Address added', 'success');
        setShowForm(false);
        setEditingId(null);
        setForm(EMPTY_FORM);
        fetchAddresses();
      } else {
        const data = await res.json();
        showToast(data.message || 'Failed to save', 'error');
      }
    } catch {
      showToast('Something went wrong', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/account/addresses/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        showToast('Address deleted', 'success');
        fetchAddresses();
      }
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await fetch(`/api/account/addresses/${id}/default`, {
        method: 'PUT',
      });
      if (res.ok) fetchAddresses();
    } catch {
      // ignore
    }
  };

  const startEdit = (addr: Address) => {
    setForm({
      label: addr.label,
      name: addr.name,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 || '',
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
    setEditingId(addr.id);
    setShowForm(true);
  };

  if (authLoading || isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-secondary rounded-sm w-48" />
        <div className="h-24 bg-secondary rounded-sm" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="type-h4 text-ivory">Addresses</h1>
        {!showForm && (
          <button
            onClick={() => {
              setForm(EMPTY_FORM);
              setEditingId(null);
              setShowForm(true);
            }}
            className="flex items-center gap-1 text-xs uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-sm md:border md:border-ivory/10 md:p-6 mb-6">
          {/* Label chip selector — pills look better than a select dropdown for 3 options */}
          <div className="mb-7">
            <p className="text-[10px] tracking-widest uppercase text-ivory/35 mb-2">
              Label
            </p>
            <div className="flex gap-2">
              {(['Home', 'Work', 'Other'] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setForm({ ...form, label: opt })}
                  className={`text-xs uppercase tracking-widest px-3 py-1.5 rounded-sm border transition-colors ${
                    form.label === opt
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-ivory/10 text-ivory/45 hover:border-gray-400'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
            <FloatingInput
              label="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              autoComplete="name"
              required
            />
            <FloatingInput
              label="Phone"
              type="tel"
              inputMode="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              autoComplete="tel"
              required
            />

            <div className="md:col-span-2">
              <FloatingInput
                label="Pincode"
                type="tel"
                inputMode="numeric"
                maxLength={6}
                value={form.pincode}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pincode: e.target.value.replace(/\D/g, ''),
                  })
                }
                autoComplete="postal-code"
                hasError={pincodeStatus === 'invalid'}
                rightSlot={
                  pincodeStatus === 'looking-up' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-ivory/35" />
                  ) : pincodeStatus === 'verified' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : null
                }
                required
              />
              {pincodeStatus === 'verified' && (
                <p className="text-[11px] text-green-600 mt-1.5">
                  City &amp; state filled in from pincode
                </p>
              )}
              {pincodeStatus === 'invalid' && (
                <p className="text-[11px] text-red-500 mt-1.5">
                  Pincode not recognised &mdash; please check it.
                </p>
              )}
              {pincodeStatus === 'unavailable' && (
                <p className="text-[11px] text-ivory/35 mt-1.5">
                  Couldn&apos;t verify pincode automatically &mdash; please
                  confirm city and state.
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <FloatingInput
                label="Address Line 1"
                value={form.line1}
                onChange={(e) => setForm({ ...form, line1: e.target.value })}
                autoComplete="address-line1"
                required
              />
            </div>

            <div className="md:col-span-2">
              <FloatingInput
                label="Address Line 2 (optional)"
                value={form.line2}
                onChange={(e) => setForm({ ...form, line2: e.target.value })}
                autoComplete="address-line2"
              />
            </div>

            <FloatingInput
              label="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              autoComplete="address-level2"
              required
            />
            <FloatingInput
              label="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              autoComplete="address-level1"
              required
            />
          </div>

          <div className="flex gap-3 pt-8">
            <Button onClick={handleSubmit} disabled={isSaving} size="sm">
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Saving...
                </span>
              ) : editingId ? (
                'Update'
              ) : (
                'Save Address'
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 && !showForm ? (
        <p className="text-ivory/35 text-sm text-center py-8">
          No saved addresses.
        </p>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`border rounded-sm p-4 ${
                addr.isDefault ? 'border-primary/30 bg-primary/5' : 'border-ivory/10'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-widest font-medium text-ivory/45 bg-secondary px-2 py-0.5 rounded-sm">
                      {addr.label}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[10px] uppercase tracking-widest font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-sm">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-ivory">{addr.name}</p>
                  <p className="text-xs text-ivory/45 mt-1">
                    {addr.line1}
                    {addr.line2 && `, ${addr.line2}`}
                    <br />
                    {addr.city}, {addr.state} {addr.pincode}
                  </p>
                  <p className="text-xs text-ivory/35 mt-1">{addr.phone}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(addr)}
                    className="text-xs text-ivory/35 hover:text-primary transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {!addr.isDefault && (
                <button
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-[10px] text-ivory/35 hover:text-primary transition-colors mt-2"
                >
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
