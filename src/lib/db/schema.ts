import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

// ─── Users ───────────────────────────────────────────────

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).unique(),
  phone: varchar('phone', { length: 20 }).unique(),
  name: varchar('name', { length: 255 }),
  googleId: varchar('google_id', { length: 255 }).unique(),
  avatarUrl: text('avatar_url'),
  isFirstPurchase: boolean('is_first_purchase').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ─── Addresses ───────────────────────────────────────────

export const addresses = pgTable(
  'addresses',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    label: varchar('label', { length: 50 }).default('Home'),
    name: varchar('name', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).notNull(),
    line1: text('line1').notNull(),
    line2: text('line2'),
    city: varchar('city', { length: 100 }).notNull(),
    state: varchar('state', { length: 100 }).notNull(),
    pincode: varchar('pincode', { length: 10 }).notNull(),
    isDefault: boolean('is_default').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('idx_addresses_user_id').on(table.userId)]
);

// ─── Orders ──────────────────────────────────────────────

export const orders = pgTable(
  'orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    razorpayOrderId: varchar('razorpay_order_id', { length: 255 }).unique().notNull(),
    razorpayPaymentId: varchar('razorpay_payment_id', { length: 255 }),
    orderNumber: varchar('order_number', { length: 20 }).unique().notNull(),
    status: varchar('status', { length: 50 }).default('confirmed').notNull(),
    subtotal: integer('subtotal').notNull(),
    /** Silver metal value total (paisa) — for GST invoices & accounting. */
    metalTotal: integer('metal_total').default(0).notNull(),
    /** Making-charge total (paisa) — coupons discount this, never metal. */
    makingTotal: integer('making_total').default(0).notNull(),
    tax: integer('tax').notNull(),
    shipping: integer('shipping').default(0).notNull(),
    discount: integer('discount').default(0).notNull(),
    total: integer('total').notNull(),
    couponCode: varchar('coupon_code', { length: 100 }),
    shippingAddress: jsonb('shipping_address'),
    billingAddress: jsonb('billing_address'),
    customerEmail: varchar('customer_email', { length: 255 }).notNull(),
    customerPhone: varchar('customer_phone', { length: 20 }),
    trackingNumber: varchar('tracking_number', { length: 255 }),
    trackingUrl: text('tracking_url'),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_orders_user_id').on(table.userId),
    index('idx_orders_razorpay_order').on(table.razorpayOrderId),
  ]
);

// ─── Order Items ─────────────────────────────────────────

export const orderItems = pgTable(
  'order_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('order_id')
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    productId: varchar('product_id', { length: 255 }).notNull(),
    productTitle: varchar('product_title', { length: 255 }).notNull(),
    variantSku: varchar('variant_sku', { length: 255 }),
    variantDesc: text('variant_desc'),
    quantity: integer('quantity').notNull(),
    unitPrice: integer('unit_price').notNull(),
    /** Per-unit silver metal value (paisa) at the locked rate. */
    metalValue: integer('metal_value').default(0).notNull(),
    /** Per-unit making charge (paisa, incl. variant modifiers). */
    makingCharge: integer('making_charge').default(0).notNull(),
    /** Per-unit GST amount (paisa). */
    taxAmount: integer('tax_amount').default(0).notNull(),
    /** Locked silver rate (paisa per gram, purity-adjusted) at checkout. */
    ratePerGram: integer('rate_per_gram').default(0).notNull(),
    imageUrl: text('image_url'),
  },
  (table) => [index('idx_order_items_order_id').on(table.orderId)]
);

// ─── Coupon Usage ────────────────────────────────────────

export const couponUsage = pgTable(
  'coupon_usage',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    couponCode: varchar('coupon_code', { length: 100 }).notNull(),
    orderId: uuid('order_id').references(() => orders.id, { onDelete: 'set null' }),
    usedAt: timestamp('used_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('idx_coupon_usage_unique').on(table.userId, table.couponCode),
    index('idx_coupon_usage_user_id').on(table.userId),
  ]
);

// ─── Sessions (refresh token tracking) ───────────────────

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    refreshToken: varchar('refresh_token', { length: 255 }).unique().notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    userAgent: text('user_agent'),
    ipAddress: varchar('ip_address', { length: 45 }),
  },
  (table) => [index('idx_sessions_user_id').on(table.userId)]
);

// ─── OTP Verifications ───────────────────────────────────

export const otpVerifications = pgTable(
  'otp_verifications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    phone: varchar('phone', { length: 20 }).notNull(),
    otpHash: varchar('otp_hash', { length: 255 }).notNull(),
    attempts: integer('attempts').default(0).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('idx_otp_phone').on(table.phone)]
);
