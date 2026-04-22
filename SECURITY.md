# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| latest  | ✅        |

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Report security issues privately via GitHub's built-in security advisory system:

1. Go to the **Security** tab of this repository
2. Click **"Report a vulnerability"**
3. Fill in the details

You can also reach out directly through the contact on the GitHub profile.

### What to include

- A clear description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fix (optional)

### What to expect

- Acknowledgement within **48 hours**
- A fix or mitigation plan within **7 days** for critical issues
- Credit in the release notes if you wish

## Scope

This is a React Native mobile application. The main areas of concern are:

- Hardcoded secrets or credentials in source code
- Insecure data storage on device
- Insecure network communication
- Dependency vulnerabilities (please also open a Dependabot alert if applicable)

## Out of Scope

- Issues in third-party dependencies (report those upstream)
- UI/UX bugs (open a regular issue)
