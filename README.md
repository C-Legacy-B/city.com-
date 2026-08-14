# CITY LEGACY BANK — Connected Web System

Complete banking frontend suite connected to a single **JSONBin** cloud database.

---

## Files Included

| File | Purpose |
|------|---------|
| `index.html` | Main customer website + customer dashboard (login, transfers, investments, savings, mail, settings) |
| `admin.html` | Master Admin control panel |
| `agent.html` | Agent Portal (create customers, fund float, mail, wallet replies) |
| `loan.html` | Public loan application + loan portal for applicants |

---

## JSONBin Configuration

All four pages use the **same** bin:

- **Bin ID:** `6a7f1688da38895dfee49120`
- **Master Key:** `$2a$10$GYQxLL1XXB8n2AXo1tBan.EUKVKBdug7t2lYt7W7APyCPafTrZzTq`
- **Access Key:** `$2a$10$V7Lthft9tZLpM5UE7XVPM.CnL6qZSVOaCRJXVlU78JbxQVIQm6y/S`

API endpoint used by every page:
```
https://api.jsonbin.io/v3/b/6a7f1688da38895dfee49120
```

---

## How to Deploy

1. Upload all four HTML files to the **same folder** on your host (or open them locally).
2. Keep the filenames as shown above so internal links work:
   - Customer site → `index.html`
   - Admin → `admin.html`
   - Agents → `agent.html`
   - Loans → `loan.html`
3. Open `index.html` in a browser. No build step is required.

---

## Default / Test Logins

### Master Admin
- Open `admin.html`
- Username: `admin`
- Password: `admin123`

### Customer (sample account already in the bin)
- Open `index.html` → Sign In
- Username: `Deputy11`
- Password: `202030`
- Transaction PIN: `2468`

### Agent
- Open `agent.html` → “Open Agent Portal”
- Use any agent credentials created in the Master Admin panel.

### Loan Portal
- Apply on `loan.html`
- After submission you receive temporary **loan portal** username & password to track status and request disbursement.

---

## Important Features

### Customer Dashboard (`index.html`)
- Checking balance, transfers, investments, savings pots
- Internal mail & notifications
- Profile photo, settings, language
- **3-minute idle logout** — if the user does not click, type, move the mouse, or scroll for 3 minutes, the session is automatically closed and they are returned to the sign-in page.

### Master Admin (`admin.html`)
- Full customer & agent management
- Fund / deduct / freeze / restrict accounts
- Approve pending transfers & credential changes
- KYC review, loan applications, wallet address replies
- Chat, mail, investment engines, savings unlock

### Agent Portal (`agent.html`)
- Agents only see customers they created
- Create customers, fund from agent float, debit customers
- Reply to crypto wallet requests, send mail
- Permissions controlled by Master Admin

### Loan Page (`loan.html`)
- Personal / Business / Mortgage applications
- Selfie + ID upload (stored as metadata flags)
- Dedicated loan portal for status tracking and disbursement request

---

## Data Structure (JSONBin)

Typical top-level keys in the bin:

```json
{
  "customers": [],
  "agents": [],
  "transactions": [],
  "messages": [],
  "pendingTransfers": [],
  "pendingChanges": [],
  "pendingSignups": [],
  "loanApplications": [],
  "walletRequests": [],
  "cryptoWalletRequests": [],
  "chats": [],
  "auditLog": [],
  "investmentConfig": {},
  "meta": {
    "updatedAt": "...",
    "bankName": "CITY LEGACY BANK"
  }
}
```

---

## Security Notes

- All sensitive actions on the customer side require the 4-digit **Transaction PIN**.
- Customer session is stored in `sessionStorage` (cleared when the tab is closed or after idle timeout).
- Admin session uses `sessionStorage` key `clb_admin`.
- Agent session uses `sessionStorage` key `clb_session_agent`.
- Never expose the Master Key in public client-side code if you move to a real production backend. For this JSONBin prototype the key is embedded so the pure-HTML apps can read/write the bin.

---

## Idle Logout (Customer only)

- Timeout: **3 minutes** of inactivity
- Events that reset the timer: `click`, `touchstart`, `keydown`, `mousemove`, `scroll`
- On timeout → forces logout and returns to the Sign-In page

---

## Support / Customisation

To change the JSONBin credentials later, search each HTML file for:

```js
var BIN_ID = '...'
var MASTER_KEY = '...'
var ACCESS_KEY = '...'
```

(There are three places in `index.html` and one place in each of the other three files.)

---

**City Legacy Bank** — Connected system ready for use.
