import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { otpVerifications } from '@/lib/db/schema';
import { eq, gt, and } from 'drizzle-orm';

/**
 * Generate a 6-digit OTP.
 */
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Check rate limit: max 3 OTPs per phone in 10 minutes.
 */
async function checkRateLimit(phone: string): Promise<boolean> {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  const recentOtps = await db
    .select()
    .from(otpVerifications)
    .where(
      and(
        eq(otpVerifications.phone, phone),
        gt(otpVerifications.createdAt, tenMinutesAgo)
      )
    );

  return recentOtps.length < 3;
}

/**
 * Send OTP via MSG91 WhatsApp (with SMS fallback).
 */
async function sendViaMSG91(phone: string, otp: string): Promise<void> {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;

  if (!authKey || !templateId) {
    // Dev fallback: log OTP to console
    console.log(`[DEV] OTP for ${phone}: ${otp}`);
    return;
  }

  const res = await fetch('https://control.msg91.com/api/v5/otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authkey: authKey,
    },
    body: JSON.stringify({
      template_id: templateId,
      mobile: phone.replace('+', ''),
      otp,
      otp_length: 6,
      otp_expiry: 5, // minutes
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error('MSG91 OTP send failed:', error);
    throw new Error('Failed to send OTP');
  }
}

/**
 * Create and send OTP for a phone number.
 */
export async function sendOtp(
  phone: string
): Promise<{ success: boolean; error?: string }> {
  // Validate Indian phone format
  const cleaned = phone.startsWith('+91') ? phone : `+91${phone}`;
  if (!/^\+91\d{10}$/.test(cleaned)) {
    return { success: false, error: 'Invalid phone number' };
  }

  // Rate limit
  const withinLimit = await checkRateLimit(cleaned);
  if (!withinLimit) {
    return { success: false, error: 'Too many OTP requests. Try again in 10 minutes.' };
  }

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Store hashed OTP
  await db.insert(otpVerifications).values({
    phone: cleaned,
    otpHash,
    expiresAt,
  });

  // Send via MSG91
  await sendViaMSG91(cleaned, otp);

  return { success: true };
}

/**
 * Verify an OTP for a phone number.
 */
export async function verifyOtp(
  phone: string,
  otp: string
): Promise<{ valid: boolean; error?: string }> {
  const cleaned = phone.startsWith('+91') ? phone : `+91${phone}`;

  // Find latest non-expired OTP for this phone
  const records = await db
    .select()
    .from(otpVerifications)
    .where(
      and(
        eq(otpVerifications.phone, cleaned),
        gt(otpVerifications.expiresAt, new Date())
      )
    )
    .orderBy(otpVerifications.createdAt)
    .limit(1);

  if (records.length === 0) {
    return { valid: false, error: 'OTP expired or not found' };
  }

  const record = records[0];

  // Check max attempts
  if (record.attempts >= 3) {
    return { valid: false, error: 'Too many attempts. Request a new OTP.' };
  }

  // Increment attempts
  await db
    .update(otpVerifications)
    .set({ attempts: record.attempts + 1 })
    .where(eq(otpVerifications.id, record.id));

  // Compare hash
  const isMatch = await bcrypt.compare(otp, record.otpHash);
  if (!isMatch) {
    return { valid: false, error: 'Invalid OTP' };
  }

  // Delete used OTP
  await db.delete(otpVerifications).where(eq(otpVerifications.id, record.id));

  return { valid: true };
}
