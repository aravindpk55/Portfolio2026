# Data Science Portfolio

Next.js 14 + Tailwind CSS + Framer Motion + Recharts, with an "Ask about my work" RAG chatbot.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then add your LLM key (optional at first)
npm run dev                  # open http://localhost:3000
```

The chatbot works without a key: it shows the passages it retrieved, so you can check retrieval before connecting a model.

## Make it yours

Almost everything lives in **`data/portfolio.ts`**:

- `profile`: name, role, intro, about, email, GitHub username, LinkedIn.
- `skills` and `timeline`: grouped skills and education/experience.
- `projects`: your case studies. The first entry in `categories` decides the project's colour and where it sits on the hero map.
- Add your resume as `public/resume.pdf`.
- In `app/layout.tsx`, set `metadataBase` to your deployed URL so LinkedIn previews work.

### Project fields worth filling well

| Field | Tip |
|---|---|
| `metrics` | 2–3 numbers a recruiter can grasp in a second (accuracy, latency, % improvement). |
| `chart` | Compare your final model against baselines. Set `highlight: true` on yours. |
| `embed` | A Hugging Face Space URL (`https://<user>-<space>.hf.space`) shows a live demo on the page. |
| `demo` | Any other public link (Streamlit Cloud, Render, etc.). |

## The chatbot

- `lib/knowledge.ts` turns your portfolio data into chunks and ranks them with BM25.
- `app/api/chat/route.ts` sends the top chunks plus the question to any OpenAI-compatible API.
- Default provider is **Groq** (free tier): get a key at console.groq.com and set `LLM_API_KEY`.
- To use OpenAI instead: `LLM_BASE_URL=https://api.openai.com/v1` and `LLM_MODEL=gpt-4o-mini`.
- There's a simple limit of 30 questions per visitor per hour to protect your quota.

**Upgrade idea (good interview talking point):** replace BM25 with hybrid retrieval by precomputing embeddings of each chunk at build time, then combining dense and BM25 scores with reciprocal rank fusion.

## Deploy to Vercel

1. Push this folder to a new GitHub repo.
2. Go to vercel.com, choose "Add New Project", and import the repo.
3. Under Environment Variables, add `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL` (and optionally `GITHUB_TOKEN`).
4. Deploy. Every push to `main` redeploys automatically.
5. Optional: add a custom domain in the project's Domains settings.

## Structure

```
app/
  page.tsx                 home page (hero, projects, skills, GitHub, about, contact)
  projects/[slug]/page.tsx case study page
  api/chat/route.ts        RAG chat endpoint
components/
  EmbeddingMap.tsx         interactive hero map of projects
  ProjectList.tsx          filterable project list
  ResultChart.tsx          results bar chart
  GitHubRepos.tsx          latest repos from the GitHub API (cached hourly)
  Chat.tsx                 floating chat panel
data/portfolio.ts          all your content
lib/knowledge.ts           chunking + BM25 retrieval
```
