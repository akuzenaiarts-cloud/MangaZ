

# Fix PayPal CURRENCY_NOT_SUPPORTED Error

## Root Cause

The PayPal error screenshot shows `CURRENCY_NOT_SUPPORTED` (HTTP 422) on `/v2/checkout/orders`. The PayPal account (MangaZ app) does not support INR as a currency. The current code:
1. Loads the SDK with `currency=INR`
2. Creates orders with `currency_code: "INR"` and converts USD prices to INR values

Both must switch to USD.

## Changes

### 1. Edge Function (`supabase/functions/paypal-purchase/index.ts`)

- Remove the `USD_TO_INR` mapping entirely
- In the `create-order` action, use `currency_code: "USD"` with the original USD price value (e.g. `"0.99"`) instead of converting to INR
- Keep everything else (auth, capture, coin crediting) unchanged

### 2. Frontend (`src/pages/CoinShop.tsx`)

- Change the PayPal SDK script URL from `currency=INR` to `currency=USD` (line 144)
- No other frontend changes needed — the `amount: selectedPrice` already sends USD values

### 3. Redeploy

- Redeploy the `paypal-purchase` edge function

## What stays the same

- Package selection UI, INR display labels, payment method cards, admin panel — all untouched
- Stripe and USDT flows untouched
- Capture logic, coin crediting, idempotency check — all unchanged
- The `createOrder`/`onApprove`/`onCancel`/`onError` callback structure stays as-is

