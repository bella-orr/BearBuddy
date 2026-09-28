# BearBuddy SSO Research

## General Idea

For BearBuddy, we want to implement **Single Sign-On (SSO)** so that UC students can log into the app using their existing UC account instead of creating a separate BearBuddy username and password.

SSO is already included in our project scope as part of the student information and security features.

## Possible Approach

- Add a **"Sign in with UC"** option to the BearBuddy login page.
- Use the University's existing authentication system if we are able to get access to it.
- One possibility to research is **Microsoft Entra ID**, since UC students already use Microsoft/O365 services.
- Determine whether UC allows student projects to connect to its authentication system and what requirements or approvals would be necessary.

## How We Think It Would Work

1. Student opens BearBuddy.
2. Student clicks **"Sign in with UC."**
3. BearBuddy redirects the student to the UC authentication page.
4. Student signs in with their UC account.
5. UC verifies the student's identity.
6. The student is redirected back to BearBuddy.
7. BearBuddy recognizes the student and loads their account.

## Technology

Our current project uses **React Native** for the mobile application and **Node.js/Express** for the backend. The SSO solution would need to work with both.

### Technologies to Research

- Microsoft Entra ID
- OAuth 2.0
- OpenID Connect (OIDC)
- PKCE for the React Native mobile application
- Microsoft Authentication Library (MSAL)

## Security Considerations

- BearBuddy should **never store students' UC passwords**.
- Only request the student information that BearBuddy actually needs.
- Protect authentication tokens and other sensitive information.
- Keep authentication secrets and credentials out of the GitHub repository.
- Use HTTPS when communicating between the application and backend.
- Make sure authenticated users cannot access another student's information.
- Properly handle expired authentication tokens and sessions.
- Implement secure logout functionality.

## GitHub Implementation

The SSO implementation would be developed in the existing BearBuddy GitHub repository.

A possible development workflow would be:

1. Create a separate branch for the SSO feature.
2. Implement and test the authentication flow on the branch.
3. Commit changes using descriptive commit messages.
4. Push the branch to GitHub.
5. Create a pull request.
6. Have the rest of the team review and test the implementation.
7. Merge the feature into the main branch after approval.

## Things We Still Need to Research

- What SSO/authentication system does UC currently use for students?
- Can our team get access to UC's authentication system?
- Does UC require approval before an application can use student SSO?
- What information would BearBuddy be allowed to receive from UC?
- How would SSO connect to our React Native frontend?
- How would the Node.js/Express backend verify the authenticated user?
- What would we need to configure in Microsoft Entra ID if UC allows us to use it?
- How should BearBuddy handle logout and expired sessions?
- How can we test SSO without using real student information?
- What security and privacy requirements would UC require for a student-developed application?
