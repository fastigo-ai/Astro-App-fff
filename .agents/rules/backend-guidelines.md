---
name: backend-guidelines
description: Strict guidelines for creating and modifying the Node.js backend.
---

# AstroBaby Backend Strict Guidelines

When working in the `/backend` directory, you MUST adhere to the following strict architectural patterns.

## 1. Flow of Request & Validation
`Request → Helmet → CORS → Rate Limiter → Logger → Zod Validation → Authentication → Controller → Service → Repository/DB → Response`
- Universal Error handler must intercept all errors (hide stack traces, return standard JSON).

## 2. Onboarding & Journey Rules (CRITICAL)
- **NEVER** store calculated values (like current gestational week or baby age).
- **ONLY** store raw inputs: `lmp_date`, `cycle_length`, and `baby_dob`.
- All EDD, Trimester, and Baby Age calculations MUST happen dynamically at read-time in the Service layer based on IST timezone.

## 3. Dynamic Media & Assets
- **NO HARDCODED IMAGES** in the app payload for dynamic content (Courses, Banners).
- Admin uploads go directly to Object Storage (S3/R2).
- The API serves absolute CDN URLs to the React Native frontend.

## 4. Auth & Security (DPDP Act)
- OTPs are stored in Redis (5 min TTL) with an aggressive rate limit (5 per hour per number).
- JWTs are short-lived (15m), and Refresh Tokens (30d) are stored hashed in the `sessions` DB table.
- Pregnancy health data is sensitive; enforce encryption at rest and strict role-based access control.

## 5. Webhooks & Subscriptions (Razorpay & Zoom)
- **Idempotency is mandatory**. Use `Idempotency-Key` or webhook `event_id` to prevent duplicate processing.
- Webhooks are the absolute source of truth for payment status. Always process in a single ACID transaction (update payment -> grant subscription -> invalidate Redis cache).

## 6. Daily Activities
- `activity_logs` table must have a `UNIQUE(user_id, activity_id, log_date)` constraint.
- Endpoints receiving logs from the mobile app must perform an `UPSERT` to handle offline sync retries gracefully.
