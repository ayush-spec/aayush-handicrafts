'use client';

import { useState, useRef } from 'react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

function FloatingInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required,
  index,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  index: number;
}) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;

  return (
    <div className="group relative">
      <div className="flex items-end gap-4">
        <span className="text-[10px] font-sans tracking-widest text-gray-300 pb-3 select-none">
          {String(index).padStart(2, '0')}
        </span>
        <div className="flex-1 relative">
          <label
            htmlFor={name}
            className={`absolute left-0 transition-all duration-300 pointer-events-none font-sans ${
              isActive
                ? 'text-[10px] tracking-widest uppercase top-0 text-ivory/35'
                : 'text-base top-6 text-ivory/35'
            }`}
          >
            {label}
            {required && !isActive && <span className="text-gray-300 ml-0.5">*</span>}
          </label>
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full bg-transparent pt-4 pb-3 text-base text-ivory outline-none border-b border-ivory/10 focus:border-gray-900 transition-colors duration-300"
            autoComplete={type === 'email' ? 'email' : name}
          />
          {/* Animated focus line */}
          <div
            className={`absolute bottom-0 left-0 h-[2px] bg-gray-900 transition-all duration-500 ease-out ${
              focused ? 'w-full' : 'w-0'
            }`}
          />
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1.5 pl-10 font-sans">{error}</p>
      )}
    </div>
  );
}

function FloatingTextarea({
  label,
  name,
  value,
  onChange,
  error,
  required,
  index,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  required?: boolean;
  index: number;
}) {
  const [focused, setFocused] = useState(false);
  const isActive = focused || value.length > 0;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e);
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="group relative">
      <div className="flex items-start gap-4">
        <span className="text-[10px] font-sans tracking-widest text-gray-300 pt-6 select-none">
          {String(index).padStart(2, '0')}
        </span>
        <div className="flex-1 relative">
          <label
            htmlFor={name}
            className={`absolute left-0 transition-all duration-300 pointer-events-none font-sans ${
              isActive
                ? 'text-[10px] tracking-widest uppercase top-0 text-ivory/35'
                : 'text-base top-6 text-ivory/35'
            }`}
          >
            {label}
            {required && !isActive && <span className="text-gray-300 ml-0.5">*</span>}
          </label>
          <textarea
            ref={textareaRef}
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            rows={3}
            className="w-full bg-transparent pt-4 pb-3 text-base text-ivory outline-none border-b border-ivory/10 focus:border-gray-900 transition-colors duration-300 resize-none overflow-hidden"
          />
          {/* Animated focus line */}
          <div
            className={`absolute bottom-0 left-0 h-[2px] bg-gray-900 transition-all duration-500 ease-out ${
              focused ? 'w-full' : 'w-0'
            }`}
          />
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1.5 pl-10 font-sans">{error}</p>
      )}
    </div>
  );
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to send');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full border-2 border-gray-900 flex items-center justify-center mb-6">
          <svg className="w-5 h-5 text-ivory" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-xs uppercase tracking-widest text-ivory/35 font-sans mb-2">Message Sent</p>
        <p className="text-sm text-ivory/45 font-sans">We&apos;ll get back to you soon.</p>
        <button
          onClick={() => setSubmitStatus('idle')}
          className="mt-8 text-xs uppercase tracking-widest text-ivory font-sans font-medium border-b border-gray-900 pb-0.5 hover:text-ivory/55 hover:border-gray-600 transition-colors"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FloatingInput
        label="Your name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        error={errors.name}
        required
        index={1}
      />

      <FloatingInput
        label="Email address"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        error={errors.email}
        required
        index={2}
      />

      <FloatingInput
        label="Subject"
        name="subject"
        value={formData.subject}
        onChange={handleInputChange}
        error={errors.subject}
        required
        index={3}
      />

      <FloatingTextarea
        label="Your message"
        name="message"
        value={formData.message}
        onChange={handleTextareaChange}
        error={errors.message}
        required
        index={4}
      />

      {submitStatus === 'error' && (
        <p className="text-xs text-red-500 font-sans pl-10">
          Failed to send. Please try again.
        </p>
      )}

      {/* Submit button */}
      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="group inline-flex items-center gap-3 text-sm uppercase tracking-widest font-sans font-medium text-ivory hover:text-ivory/55 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending
            </>
          ) : (
            <>
              Send Message
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
