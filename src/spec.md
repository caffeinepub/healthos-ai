# Specification

## Summary
**Goal:** Fix build-breaking backend and frontend errors and resolve profile-related runtime/type issues so the app compiles, deploys, and runs reliably.

**Planned changes:**
- Fix Motoko backend compile/deploy failures by completing any truncated definitions and ensuring all frontend-referenced public methods exist with Candid-compatible types (e.g., Stripe checkout session API, sleep estimator persistence APIs).
- Fix frontend profile creation/editing errors so validation maps to the correct fields and submitted data matches the backend `ExtendedMentalHealthProfile` shape (including correct optional/numeric handling for `age`).
- Audit and correct frontend ↔ backend type mismatches and API wiring for recent profile/personalization fields (age, gender, profession, future goals) so profile-dependent screens load and save correctly after login.

**User-visible outcome:** Users can log in, create or edit their profile without crashes, see validation errors on the correct fields, and have profile data persist across refresh/re-login; the app builds successfully with no backend compiler errors or frontend TypeScript/build errors.
