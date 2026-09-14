# University of Ilesa Wi-Fi Portal

## Goal
Build a complete responsive frontend prototype for the student and staff journey: register, verify, create a password, sign in, and securely view one assigned Wi-Fi credential.

## Experience
- Use the supplied white, blue, and neutral university palette with Inter typography and restrained motion.
- Create a split-screen sign-in experience on desktop and a focused single-column flow on mobile.
- Add shared university branding, accessible navigation, mobile menu, clear focus states, loading feedback, alerts, confirmations, and copy notifications.

## Screens and flows
- Sign in at `/`, with Student/Staff switching, validation, password visibility, remember-me, invalid-login feedback, and password-reset dialog.
- Registration at `/register`, reusing one form for Student and Staff with identity-specific fields and validation.
- Verification at `/verify`, including masked email, six-digit code, resend countdown, incorrect/expired-code states, and email-change navigation.
- Password creation at `/create-password`, with live requirements and strength feedback.
- Completion at `/registration-success`, without exposing the Wi-Fi password.
- Dashboard at `/dashboard`, with account summary, prominent credential card, connection steps, status cards, and a switchable pending-credential state.
- Dedicated `/credentials`, `/profile`, and `/help` pages with their requested content and actions.

## Shared behavior
- Keep mock identity and credential data in a typed frontend data module so a future secure service can replace it.
- Reuse shared authentication layout, fields, user-type tabs, portal navigation, credential card, status badge, alerts, dialogs, empty states, and toast feedback.
- Hide credentials by default, confirm password reveal, support copy actions, and include an inactivity warning with automatic sign-out behavior.
- Preserve the security model around “My Wi-Fi Credential”; no credential IDs, lists, or search surface will exist.

## Technical details
- Use TanStack Router route files and route-specific metadata for every screen.
- Use React state and session-scoped mock state only; no backend or persistent account storage in this phase.
- Use semantic design tokens in the global stylesheet and existing interface primitives.
- Verify key flows and layouts at desktop and mobile sizes, then check diagnostics.
