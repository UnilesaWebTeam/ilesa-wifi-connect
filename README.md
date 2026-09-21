# Ilesa Wi-Fi Connect

Build a University Wi-Fi Credential Management Portal

Create a polished, modern, responsive web application for a university called University of Ilesa. The application is a Wi-Fi Credential Management Portal for university students and staff.

The purpose of the portal is simple:

Students and staff who are eligible to use the university Wi-Fi should be able to register, verify their university identity, log in securely, and view the Wi-Fi username and password assigned to them.

The interface should feel like a real university technology product that could eventually be deployed, not like a generic SaaS landing page or a basic CRUD application.

The initial implementation should focus on the frontend experience, navigation, screens, states, validation and realistic mock data, but structure the application so that a real backend/database can be connected later.

1. Overall Design Direction

Use a clean, modern university technology aesthetic.

The design should be:

Professional

Minimal

Trustworthy

Modern

Friendly

Easy for students to understand

Suitable for both students and university staff

Spacious without wasting too much screen space

Avoid making it look like:

A banking application

A corporate enterprise dashboard

A flashy startup landing page

A gaming interface

An overly colorful student portal

The feeling should be:

"This is an official university system that is simple and trustworthy."

Use a predominantly white background with subtle blue accents.

Suggested palette:

Primary: #155EEF or a similar professional university blue

Dark text: #101828

Secondary text: #667085

Background: #F8FAFC

Card background: #FFFFFF

Border: #E4E7EC

Success: #12B76A

Warning: #F79009

Error: #F04438

Do not overuse color. Blue should mainly be used for primary actions, links, active states and branding.

2. Typography

Use Inter as the primary font family.

If Inter is unavailable, use:

Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

Typography should be clean and highly readable.

Suggested hierarchy:

Main page heading: 28–36px, 600–700 weight

Section headings: 20–24px, 600 weight

Card headings: 16–18px, 600 weight

Body text: 14–16px, 400 weight

Labels: 13–14px, 500 weight

Helper text: 12–13px

Buttons: 14–15px, 600 weight

Use generous line height and spacing.

3. Responsive Design

The application must be fully responsive.

Design for:

Desktop

Primary target:

1440 × 900

1366 × 768

1920 × 1080

The application should look excellent on desktop monitors and laptops.

Tablet

Support approximately:

768 × 1024

820 × 1180

Mobile

Support:

390 × 844

393 × 852

360 × 800

The application should not simply shrink the desktop design.

On mobile:

Cards become full width

Form fields become full width

Navigation simplifies

Dashboard cards stack vertically

Wi-Fi credentials card remains easy to read

Buttons should have comfortable touch targets

Avoid horizontal scrolling

Maintain generous spacing

4. Application Structure

Create the following main screens:

Login

Student Registration

Staff Registration

Verification

Create Password

Registration Success

Student Dashboard

Staff Dashboard

Wi-Fi Credential View

Profile / Account

Help / Support

The system should use a consistent layout and design language across all screens.

5. Login Page

The login page should be the primary entry point.

Desktop layout:

Use a split-screen design.

Left side

Approximately 45% of the screen.

Display university branding and a simple Wi-Fi-related visual.

For example:

University logo placeholder

"University of Ilesa"

Short statement such as:

"Secure access to your university Wi-Fi."

Supporting text:

"Sign in to view the Wi-Fi credentials assigned to your account."

Add a subtle abstract Wi-Fi/network illustration.

Keep this side visually attractive but minimal.

Right side

Approximately 55%.

Center a login card/form within the available space.

At the top:

Welcome back

"Sign in to access your Wi-Fi credentials."

Below this, provide a user-type selector.

Create two tabs:

Student | Staff

The selected tab should have the university blue accent.

For example:

[ Student ] [ Staff ]

Changing the tab should slightly change the form context.

Login form

For Student:

Label:

Matriculation Number

Placeholder:

Enter your matriculation number

Password:

Password

Placeholder:

Enter your password

Add:

☐ Remember me

And:

Forgot password?

Primary button:

Sign In

Below the button:

"Don't have an account?"

Register here

For Staff:

Replace the matriculation number field with:

Staff ID

Placeholder:

Enter your staff ID

Everything else remains similar.

6. Registration Page

The registration page should maintain the same visual style as login.

At the top:

Create your account

"Register to access your university Wi-Fi credentials."

Provide the same Student / Staff tabs.

The tabs should allow the user to switch between:

Student registration

Staff registration

7. Student Registration Form

Fields:

Matriculation Number

Placeholder:

Enter your matriculation number

University Email

Placeholder:

Enter your university email address

First Name

Last Name

Department

Use a searchable/select dropdown.

Faculty

Use a dropdown.

Phone Number

Optional unless required by the actual requirements.

At the bottom:

☐ I confirm that the information provided belongs to me.

Primary button:

Continue

Below:

"Already have an account?"

Sign in

Important UX requirement:

Do not ask for unnecessary personal information.

The form should feel short and manageable.

8. Staff Registration Form

Fields:

Staff ID

University Email

First Name

Last Name

Department

Faculty / Unit

Then:

☐ I confirm that the information provided belongs to me.

Primary button:

Continue

Below:

"Already have an account?"

Sign in

9. Verification Screen

After registration, show a verification screen.

Title:

Verify your university email

Supporting text:

"We've sent a verification code to your university email address."

Do not display the full email address.

Instead show something like:

i•••••@unilesa.edu.ng

Create a six-digit OTP input.

Example:

[ 4 ] [ 8 ] [ 2 ] [ 1 ] [ 7 ] [ 3 ]

Include:

Verify

And:

"Didn't receive the code?"

Resend code

Show a small countdown such as:

Resend available in 00:42

Also include:

Change email address

10. Create Password Screen

After successful verification:

Title:

Create your password

Supporting text:

"Create a password you'll use to sign in to the Wi-Fi portal."

Fields:

Password

Confirm password

Include a password strength indicator.

For example:

Weak
Fair
Strong

Show basic password requirements:

At least 8 characters

Contains uppercase and lowercase letters

Contains a number

Contains a special character

Do not make the interface unnecessarily complicated.

Button:

Create Account

11. Registration Success

After registration:

Display a clean success screen.

Use a subtle success icon.

Title:

You're all set!

Supporting text:

"Your account has been created successfully."

Then:

"Your Wi-Fi credentials are ready."

Primary button:

Go to Dashboard

Do not display the Wi-Fi password directly on this success screen.

The user should authenticate through the normal dashboard flow before viewing it.

12. Dashboard

After login, the user lands on their dashboard.

Desktop layout:

A simple top navigation bar.

Left:

University logo

University of Ilesa

Navigation:

Dashboard

Wi-Fi Credentials

Profile

Help

Right side:

User avatar / initials

User name

Dropdown:

Profile

Sign out

13. Dashboard Welcome Section

Display:

Good morning, Ibrahim

or use the user's mock name dynamically.

Supporting text:

"Here's the information associated with your Wi-Fi account."

Add a small status badge:

Wi-Fi Account Active

Use a green status indicator.

14. Main Wi-Fi Credential Card

This should be the most visually important component on the dashboard.

Create a large card titled:

Your Wi-Fi Credentials

Supporting text:

"Use these details to connect to the university Wi-Fi network."

Display:

Wi-Fi Username

UNI-WIFI-001284

Password:

••••••••••••••

Have an eye icon:

Show password

When clicked, reveal the password.

Also provide:

Copy username

Copy password

Potentially:

Copy credentials

The password should be hidden by default.

Include a small warning:

"Keep these credentials private. Do not share them with others."

This is an important part of the UX.

15. Credential Status

Inside or immediately below the credential card, show:

Status

🟢 Active

And:

Assigned to

Matriculation Number / Staff ID

Do not expose unnecessary information.

Also display:

Assigned on

September 14, 2026

Use realistic mock data.

16. Connection Instructions

Below the credential card, create a simple section:

How to connect

Use three simple steps:

01

Open Wi-Fi settings on your device.

02

Select the university Wi-Fi network.

Example:

University-WiFi

03

Enter the username and password shown above.

Add a small link:

Need help connecting?

This can lead to the Help page.

17. Dashboard Information Cards

Create three smaller cards:

Account Status

Active

"Your account is currently active."

Credential Status

Assigned

"Your Wi-Fi credential is currently assigned to you."

Account Type

Student / Staff

Display dynamically depending on the account.

Keep these cards subtle and not overly decorative.

18. Wi-Fi Credentials Page

Create a dedicated page accessible from the navigation.

Title:

Wi-Fi Credentials

Supporting text:

"View the Wi-Fi credentials assigned to your university account."

Use the same credential card from the dashboard.

Include:

Username

Password

Show/hide password

Copy username

Copy password

Copy all credentials

Status

Add a security notice:

Keep your Wi-Fi credentials private.

"Anyone who has these credentials may be able to use the university Wi-Fi under your account, depending on the network provider's access controls."

19. Profile Page

Create a simple profile page.

Title:

My Profile

Display:

Name

University ID

University email

Department

Faculty / Unit

Account type

Account status

Do not allow unnecessary editing of university identity information.

Include:

Change password

and:

Sign out

20. Help Page

Create a simple support page.

Title:

Need help?

Common questions:

I can't log in

Provide basic guidance.

I forgot my password

Provide a password-reset action.

My Wi-Fi credentials are not working

Explain that the user should contact the appropriate university ICT/network support channel.

Someone else has my Wi-Fi credentials

Provide:

Report a compromised credential

Do not implement actual support functionality yet. Use realistic placeholder interactions.

21. Important Security UX

Security should be reflected in the interface without making the application difficult to use.

Implement:

Password visibility toggle

OTP verification

Clear authentication states

Session timeout warning

Automatic logout after inactivity

Confirmation before sensitive actions

Never display Wi-Fi passwords by default

Clear warning against credential sharing

Appropriate error messages

For example, instead of:

"Invalid credentials"

Use:

Unable to sign in

"Please check your university ID and password and try again."

Do not reveal whether a particular university ID exists during password/login errors.

22. Error and Empty States

Design realistic states for:

Invalid login

Show a clear error message.

Incorrect OTP

"That verification code is incorrect. Please try again."

Expired OTP

"This code has expired. Request a new code."

Credential unavailable

"Your account has been verified, but a Wi-Fi credential could not be assigned at this time. Please try again later."

Account already exists

"This university ID is already registered."

Provide:

Go to Sign In

Network/system error

"We couldn't complete that request. Please try again."

23. Loading States

Do not simply freeze the interface during actions.

Create loading states for:

Login

Registration

OTP verification

Credential retrieval

Password creation

Copying credentials

Buttons should show:

Signing in...

Creating account...

Verifying...

etc.

24. Empty / First-Time Dashboard

If the user has registered but a credential has not yet been assigned, show:

Your Wi-Fi credential is being prepared

"Your account has been successfully verified. Your Wi-Fi credential will appear here once it has been assigned."

Do not show fake credentials in this state.

25. Navigation Behavior

Desktop:

Top navigation or compact sidebar.

Mobile:

Use a simple mobile header with:

University logo/name

Menu button

The mobile navigation should contain:

Dashboard

Wi-Fi Credentials

Profile

Help

Sign out

26. Component Design

Use reusable components throughout the application.

Create components such as:

Button

Input

PasswordInput

Select

Tabs

OTPInput

StatusBadge

CredentialCard

DashboardCard

Navbar

MobileNavigation

Modal

Toast notification

Alert

LoadingState

EmptyState

The Student and Staff interfaces should reuse the same components rather than creating two completely separate designs.

27. Micro-interactions

Add subtle, professional interactions:

Smooth hover states

Button transitions

Tab transitions

Card hover effects where appropriate

Password reveal animation

Copy-to-clipboard confirmation

Toast notification after copying

Smooth page transitions

Input focus states

Keep animations subtle.

Do not use excessive animations.

28. Accessibility

The interface should be accessible.

Ensure:

Good text contrast

Visible keyboard focus states

Labels for all form fields

Buttons have clear accessible names

Icons should have tooltips or accessible labels

Forms should be usable without a mouse

Do not rely on color alone to communicate status

Touch targets should be comfortable on mobile

29. Mock Data

Use realistic but clearly fictional mock data.

Example student:

Name:
Ibrahim Salami

Matriculation Number:
CSC/2021/0042

Email:
i•••••@unilesa.edu.ng

Department:
Computer Science

Faculty:
Computing

Wi-Fi username:

UNI-WIFI-001284

Wi-Fi password:

UwiFi@2026!284

Example staff:

Name:
Amina Yusuf

Staff ID:

UNI/STAFF/0184

Use mock credentials throughout the frontend.

Do not expose all mock credentials in the UI at once.

30. Data and Backend Preparation

Even though this first version can use mock data, structure the application as if a real backend will eventually be connected.

The conceptual entities are:

User

id

university_id

first_name

last_name

email

department

faculty

user_type

status

created_at

Wi-Fi Credential

id

username

password

status

assigned_user_id

assigned_at

Do not expose the complete credential list to the frontend.

A real implementation should retrieve only the currently authenticated user's credential.

31. Important Security Architecture Rule

The frontend must NEVER determine which Wi-Fi credential a user is allowed to access.

For example, avoid a design where the frontend can simply request:

/credentials/123

and receive credential 123.

The eventual backend should determine the authenticated user's identity and return only the credential assigned to that user.

The interface should therefore be designed around:

"My Wi-Fi Credential"

rather than:

"Search Wi-Fi Credentials."

There should be no student-facing credential search function.

32. Overall Visual Layout

The application should have generous whitespace and strong visual hierarchy.

Use:

Rounded cards, approximately 10–14px radius

Subtle borders

Very light shadows

Clean icons

Consistent spacing

Maximum content width around 1200–1280px

Comfortable form widths around 400–480px

Avoid:

Excessive gradients

Huge illustrations

Excessive rounded/pill elements

Too many colors

Dense tables

Unnecessary charts

Generic SaaS dashboard clutter

33. Branding

Use:

University of Ilesa

as the university name throughout the application.

Create a simple text-based logo treatment if an actual logo asset is unavailable:

UI
University of Ilesa

Use the university blue as the primary brand color.

Do not invent an elaborate official university logo.

If an actual university logo is provided later, structure the header so it can easily be replaced.

34. Final Product Feel

The finished interface should feel like a system that a real Nigerian university could give to thousands of students and staff.

It should be:

Simple enough for a first-year student to understand immediately.

Professional enough for university staff to use.

Security-conscious enough to protect access to the Wi-Fi credentials.

Responsive enough to work primarily from mobile phones while still looking excellent on desktop.

Most importantly, do not overcomplicate the product.

The core journey should remain:

Register → Verify → Create Password → Login → View Wi-Fi Credential

Build the complete frontend experience around this journey, including realistic success, error, loading, empty and mobile states.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://ilesa-wifi-connect.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4ac25e28-b34b-4e0f-b352-9ead94c2bc4a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
