# Login connection

The form now sends JSON `{ email, password }` to `POST /api/auth/login`.
There are no hardcoded accepted credentials. Use an account registered in your
backend database. The old `pass123` demo password fails the backend's 8-character
minimum.

## Local setup

1. In `server/`, install dependencies with `npm ci`.
2. Configure `.env` using `.env.example`: actual `DATABASE_PASSWORD` or
   `DATABASE_URL`, plus a private random `JWT_SECRET` of at least 32 bytes.
3. Apply the included migration only to your selected development database if
   `app.users` does not yet exist. Then run `npm start` on port 3000.
4. In `frontend/`, run `npm ci`, then `npm run dev`.

Vite forwards `/api` requests to `http://127.0.0.1:3000`. If your backend uses a
different port, change the proxy target in `vite.config.js`.

Successful login displays the returned account email and a Sign out button.
The returned JWT stays in React memory, and the password is cleared. Refreshing
the page signs you out. Remember-me and password-reset behavior remain
unimplemented. Sign out clears the frontend session; the issued JWT retains its
backend expiry because this backend has no token revocation endpoint.

The dashboard has not been built. The previous redirect to its nonexistent route
was removed. A future dashboard can receive the session from App; protected API
requests should send `Authorization: Bearer <token>`. The backend must add JWT
verification middleware before exposing protected client data.

## Production

The development proxy is not included in `npm run build`. Your deployment must
serve the React build and route `/api/*` to Express under the same HTTPS origin.
Keep database credentials and the JWT signing secret exclusively on the backend.
Do not set secret values in Vite frontend environment variables.
