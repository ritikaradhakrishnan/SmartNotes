# SmartNotes interview demo

## Start on your Mac

Open the Ollama application. In a terminal inside the SmartNotes folder, run:

```sh
npm run demo
```

This checks that the required environment variables exist and that Ollama has the configured model, then starts the app on port 3000. The check does not validate Clerk credentials or MongoDB connectivity. Open http://localhost:3000/notes and sign in. Keep the terminal and Ollama running. If port 3000 is already occupied by SmartNotes, use the existing app; do not start another copy. Press Control-C in its terminal to stop the app when finished.

Clerk login and MongoDB Atlas storage require internet. Model inference runs locally on your Mac. A first answer can take longer while the model loads; rehearse once before presenting.

## Two-minute walkthrough

1. Sign in and explain that Clerk provides authentication.
2. Create a note titled “Interview demo checklist” with “The demo rehearsal is at 10 AM.”
3. Edit the time to 11 AM, save, and reload. Explain that the note persists in MongoDB Atlas through Prisma.
4. Search for “Interview” to find it again, then clear the search.
5. Open “Ask your notes” and ask “What time is the demo rehearsal in my Interview demo checklist?” Check that the answer says 11 AM and references the note. Model output can vary.
6. Show the mobile layout and the JSON backup export if time allows.

If that sample note already exists, edit it rather than creating duplicates with conflicting times.

## Explain the architecture

“SmartNotes is a Next.js and TypeScript note-taking app with Clerk authentication and MongoDB Atlas storage through Prisma. The server retrieves notes belonging to the signed-in user, selects relevant excerpts using keyword matching, and sends them with the question to a local Ollama model. The answer includes numbered references so I can check it against the notes. I use Ollama to run inference on my Mac without an OpenAI API balance.”

The current connected app uses Next.js 15 and the configured Ollama model, defaulting to qwen3:4b. It searches the 200 most recently edited notes and passes at most five excerpts. It returns a completed answer rather than streaming tokens. This is keyword-based retrieval, not Pinecone vector search. Local inference does not make the whole app offline: authentication and note storage still use cloud services.

## Public link versus connected app

- https://ritikaradhakrishnan.github.io/SmartNotes/ is the browser-only demo; notes stay in that browser.
- http://localhost:3000/notes is the connected demo on your Mac with Clerk, MongoDB, and Ollama.
- The repository contains both editions. They do not automatically synchronize notes. A visitor to the public site cannot use your local backend or Ollama server.

## Resume wording for the current implementation

- Built a full-stack note-taking application with Next.js, TypeScript, and Shadcn UI, integrating Clerk authentication and MongoDB Atlas through Prisma for user-scoped note management.
- Implemented a local Ollama assistant that answers questions from retrieved note excerpts with source references, alongside responsive layouts, note search, and JSON backup export.

Use these bullets for work you actually completed. Describe OpenAI, Pinecone, or streaming as earlier implementation work only if you can substantiate that work; they are not part of the current demo. Keep recent updates separate from any older employment dates.
