# AstroBaby Architecture Guidelines

## 1. High-Level Architecture
A modular monolith designed to comfortably handle 10,000+ users (approx 100-300 RPS at peak).

```
Mobile App / Admin Web
        │
   API Gateway / Load Balancer (HTTPS, rate limiting)
        │
   Backend API (Node.js / Express - 2-3 stateless instances)
   Modules: Auth · Profile · Journey · Content · Subscription · Payments · Live Classes · Activity Tracking · Admin
        │
 ┌──────┼───────────────┬─────────────────┐
MongoDB      Redis        Job Queue+Workers    Object Storage + CDN
(main DB)    (OTP, cache, (SMS, push, Zoom     (videos, images)
             rate limits)  sync, expiry cron)
        │
External: SMS/OTP provider (DLT registered) · Razorpay · Zoom API · FCM push
```

## 2. Dynamic Image & Media Delivery
All images currently hardcoded in the frontend MUST be migrated to dynamic URLs. 
- The **Admin Panel** will have a dedicated media manager to upload images (for courses, activities, banners).
- Images are uploaded to Object Storage (AWS S3 / Cloudflare R2) and served via CDN.
- The frontend fetches these CDN URLs from the backend API, allowing remote UI updates without app store releases.

## 3. Auth (Phone + OTP)
- **POST /auth/otp/send**: Generates 6-digit OTP, stores hash in Redis (5-min TTL), sends via SMS provider.
- **POST /auth/otp/verify**: Max 5 attempts. Returns short-lived JWT (15m) and rotating refresh token (30d, stored hashed in `sessions` collection).
- **Rate Limits**: 30-second cooldown, 5 OTPs per hour per number, plus per-IP limits.

## 4. Onboarding & Journey Calculations
- Store an `onboarding_step` (PHONE_VERIFIED → PROFILE_DONE → STAGE_DONE → COMPLETED).
- **Pregnancy Stage Rule**: We ONLY store the raw inputs (LMP date, Baby DOB). All calculations are done at read-time:
  - **EDD** = LMP + 280 days + (cycle_length - 28)
  - **Gestational Weeks** = (Today - LMP) / 7
  - **Baby Age** = Today - DOB
- If the current date is past the EDD, trigger a prompt: "Has your baby arrived?"

## 5. Core Data Model (MongoDB)
- **`users`** collection: `{ _id, phone, name, dob, location: { state_id, city_id }, onboarding_step, role }`
- **`user_journeys`** collection: `{ user_id, stage (ENUM), lmp_date, cycle_length, edd, baby_dob, marriage_date }`
- **`sessions`** collection: `{ _id, user_id, refresh_token_hash, device_id, expires_at }`
- **Subscriptions & Billing**: `plans`, `subscriptions`, `payments`, `webhook_events` (Idempotency)
- **Content**: `programs`, `activities`, `recorded_classes`, `live_classes`
- **Tracking**: `activity_logs` (with compound unique index on user_id, activity_id, log_date), `daily_summary`

## 6. Access Control & Subscriptions (Razorpay)
- **Middleware Entitlement Check**:
  - `TRIAL`: `now < trials.ends_at`
  - `ACTIVE`: Valid subscription.
  - `EXPIRED/NONE`: Only `is_free_preview` content is visible.
- Webhooks are the source of truth (`payment.captured`, `payment.failed`, `order.paid`).
- Must verify webhook signature and dedupe by event ID in a single DB transaction.

## 7. Live Zoom Classes
- Admin schedules class → Backend calls Zoom API (Server-to-Server OAuth) → Stores join URL.
- App receives join URL only if user is entitled. Button activates 10 mins before start.
- Handle Zoom webhooks (`meeting.started`, `participant_joined`) for attendance.

## 8. Daily Activity Tracking
- `POST /activities/{id}/log` handles daily streaks.
- Use `UNIQUE(user_id, activity_id, log_date)` for idempotent upserts.
- Nightly cron job updates the `daily_summary` collection.

## 9. Security & Non-Functional
- **DPDP Act 2023**: Pregnancy data is highly sensitive. Require explicit consent, encrypt at rest, support account deletion.
- **Fail Open**: If Redis fails, rate limiting should fail open to prevent total outages.
- **Idempotency**: Require `Idempotency-Key` headers on payments and logs.
