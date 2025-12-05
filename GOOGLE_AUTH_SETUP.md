Setup Google Sign-In for this project

1) Install dependency

- Run in PowerShell (project root):

  expo install expo-auth-session

2) Create OAuth Client IDs

- Go to Google Cloud Console → APIs & Services → Credentials.
- Create an OAuth 2.0 Client ID of type `Web application`.
  - Add authorized redirect URIs if needed, but for Expo Go the helper `AuthSession.makeRedirectUri({ useProxy: true })` works.
- Note the Web client ID (looks like `...apps.googleusercontent.com`).

3) Configure the client ID

- Option A (recommended): set an environment variable when starting Expo:

  Windows PowerShell:

  $env:EXPO_GOOGLE_CLIENT_ID = "your-web-client-id.apps.googleusercontent.com"; expo start

  macOS / Linux (bash):

  EXPO_GOOGLE_CLIENT_ID="your-web-client-id.apps.googleusercontent.com" expo start

- Option B (recommended for builds): add the value to `app.json` (or `app.config.js`) so it is available in `Constants.expoConfig.extra` at runtime.

  Example `app.json` snippet:

  {
    "expo": {
      "name": "HabitTracker",
      "slug": "habit-tracker",
      "extra": {
        "EXPO_GOOGLE_CLIENT_ID": "your-web-client-id.apps.googleusercontent.com"
      }
    }
  }

- Option C: use a local `.env` file during development. Copy `.env.example` to `.env` and fill the value. Then start Expo with the variable loaded (examples in Option A).

4) Test the flow

- In the auth screens a Google icon button triggers the flow.
- On success the code exchanges the returned `id_token` for a Firebase credential and signs in via `signInWithCredential`.

Notes

- For standalone Android/iOS builds you may need to create platform-specific OAuth client IDs and configure redirect URIs accordingly.
- For a simpler developer experience, consider using `expo-auth-session/providers/google` to use the built-in provider hooks.

If you want, I can also scaffold an `.env` integration (for example using `dotenv` during local dev or `app.config.js` to read `.env` at build time) and update `app.json`/`app.config.js` accordingly.