# SmartNotes

[Open SmartNotes](https://ritikaradhakrishnan.github.io/SmartNotes/)

## Browser edition

The public launch lives in `standalone/`. It is a dependency-free notes workspace with editing, search, notebooks, tags, pinning, archive, deletion with undo, and validated JSON backup import/export. Notes remain in localStorage on the visitor's browser and website origin. There is no cloud sync, sign-in, or AI chat in this edition. Clearing browser data removes notes; export backups regularly. Five editable example notes appear on first use.

Run locally from this repository:

```sh
python3 -m http.server 4317 --bind 127.0.0.1 --directory standalone
```

Open `http://127.0.0.1:4317`. Run model and backup checks with `node --test tests/browser-notes.test.mjs`. Keyboard shortcuts: `N` creates a note and `/` focuses search when not typing. Notes save when you select **Save note**; closing an unsaved draft asks before discarding it.

Build the browser edition with `node scripts/build-browser.mjs`. GitHub Actions tests the app and publishes the generated `dist/` directory to GitHub Pages after changes are pushed to `main`. The original Next.js application is retained below for a future connected edition. It needs service credentials and dependency updates before deployment; it is not part of this static launch.

## Connected application: Clerk + MongoDB + local Ollama

See [LOCAL_SETUP.md](LOCAL_SETUP.md) for private local configuration and startup. The connected edition now uses your local Ollama model instead of OpenAI and Pinecone. The historical project description below describes the original architecture.

## Original project background

AI Chatbot with Next.js, OpenAI, and Vector Embeddings
The project showcases the development of an AI chatbot leveraging Next.js 14, resulting in a seamless user experience. Here's an overview of the technologies and features incorporated:

Technologies Utilized:

Next.js 14: The backbone of the chatbot's frontend, providing a robust foundation for building interactive user interfaces.

Shadcn UI: Integrated to deliver a polished and modern user interface, enhancing the overall user experience.

MongoDB Atlas and Prisma: Efficiently manage data with the power of MongoDB Atlas and Prisma, ensuring a reliable and scalable database.

Clerk: Secure user authentication is implemented via Clerk, safeguarding user data and interactions.

OpenAI and Pinecone: The integration of OpenAI and Pinecone enables the chatbot to respond intelligently to user queries, providing sophisticated vector embeddings for enhanced understanding.

Vercel AI SDK: For seamless AI integration, the Vercel AI SDK for OpenAIStream is utilized, showcasing expertise in AI integration.

With a focus on these cutting-edge technologies, this project demonstrates the capabilities of building an AI chatbot that offers an intuitive user interface, efficient data management, secure authentication, and intelligent responses, all within the framework of Next.js 14.



In summary, this project exemplifies the synergy of Next.js, OpenAI, and vector embeddings, resulting in a sophisticated AI chatbot that enhances user interactions and showcases the potential of modern web development and AI integration.

SmartNotes! 🤖



