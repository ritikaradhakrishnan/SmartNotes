# SmartNotes connected edition

The connected app runs on your Mac at http://localhost:3000. The GitHub Pages edition remains browser-only. Local Ollama is not exposed to the internet.

## Configure your existing accounts

1. In Clerk, select your SmartNotes application and its **Development** instance. Open **API keys** and copy the publishable and secret keys into `.env.local`. Enable your preferred sign-in methods in Clerk. Email verification is a straightforward starting option; Google sign-in follows your Clerk configuration.
2. In Atlas, create a database user with read/write access to the `smartnotes` database. Under **Network Access**, allow your Mac's current public IP. Under **Connect → Drivers**, copy the connection URI into `DATABASE_URL` in `.env.local`. Replace the password placeholder (URL-encode special characters) and include `/smartnotes` before `?`. This is the database user's password, not the Atlas account password.
3. Keep Ollama running with `qwen3:4b` installed. No OpenAI or Pinecone account is needed.

The local `.env.local` file is ignored by Git. Never commit it or put the secret key or database URI in any `NEXT_PUBLIC_` variable. Only Clerk's publishable key belongs in a public variable.

## Run

```sh
npm install
npm run check:setup
npm run dev
```

Open http://localhost:3000, sign up or sign in, create a note, reload to verify it persists, then ask the assistant about it. Use the profile button to sign out. Notes are scoped to the signed-in Clerk user. MongoDB is still a cloud service; login and storage need internet, while model inference runs on the Mac.

Chat uses keyword matching across the 200 most recently edited notes and supplies up to five bounded note excerpts. It is not semantic vector search. Answers show the selected reference notes and can be imperfect. There is no automatic transfer from the browser-only site in this version.

Validation: `npm run test:connected`, `npm run lint`, and `npm run build`. End-to-end login and database checks require real account configuration. The dev server binds to loopback only. Hosting this edition for other people requires a separate backend deployment and an available model server; GitHub Pages cannot execute it.

## Before public backend hosting

The current dependency audit still reports advisories in the older CSS/build tooling dependency tree (including PostCSS and braces). Compatible fixes were applied, but this is a loopback-only development edition; complete the remaining dependency migration and multi-user integration checks before exposing the backend publicly.
