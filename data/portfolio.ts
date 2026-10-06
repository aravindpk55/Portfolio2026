// ─────────────────────────────────────────────────────────────
// EDIT THIS FILE. Everything on the site (and everything the
// chatbot knows about you) comes from here.
// ─────────────────────────────────────────────────────────────

export type Category = "ml" | "llm" | "rag" | "analysis";

export const categoryLabels: Record<Category, string> = {
  ml: "Machine learning",
  llm: "LLMs",
  rag: "RAG",
  analysis: "Data analysis",
};

export type Project = {
  slug: string;
  title: string;
  categories: Category[]; // first one decides its colour and cluster on the map
  summary: string; // one sentence for the list view
  problem: string;
  data: string;
  approach: string[];
  results: string;
  metrics: { label: string; value: string }[];
  chart?: {
    title: string;
    unit?: string;
    higherIsBetter?: boolean;
    bars: { name: string; value: number; highlight?: boolean }[];
  };
  stack: string[];
  github: string;
  demo?: string; // a public demo link
  embed?: string; // a Hugging Face Space URL like https://<user>-<space>.hf.space
  featured?: boolean;
  year: string;
};

export const profile = {
  name: "Aravind",
  role: "Data scientist and Business Intelligence analyst",
  location: "Melbourne, Australia",
  intro:
    "I build retrieval and language-model systems end to end, from cleaning the data to shipping a demo people can use.",
  about: [
    "I build systems that turn raw information into something useful.",
    "My work sits at the intersection of data science, machine learning, large language models, retrieval-augmented pipelines, and AI. What interests me most is the problem solving behind the technology: understanding messy data, finding the signal, choosing the right approach, and turning the result into something people can actually use.",
  ],
  lookingFor: "I'm now looking for opportunities across data science, data analytics and AI/ML, where I can work on real problems and build intelligent, measurable solutions.",
  email: "aravindpk55@gmail.com",
  github: "aravindpk55",
  linkedin: "https://www.linkedin.com/in/aravind-pk-972909381",
  resume: "/resume.pdf", // put your PDF in /public/resume.pdf
};

export const skills: { group: string; items: string[] }[] = [
  { group: "Machine learning", items: ["scikit-learn", "XGBoost", "PyTorch", "Feature engineering", "Model evaluation"] },
  { group: "LLMs and RAG", items: ["Hugging Face Transformers", "LangChain", "LlamaIndex", "Vector databases", "Prompt evaluation"] },
  { group: "Data analysis", items: ["Python", "SQL", "Tableau", "Excel", "Streamlit"] },
  { group: "Engineering", items: ["FastAPI", "Docker", "Git", "Gradio", "AWS basics"] },
];

export const timeline: { period: string; title: string; place: string; detail: string }[] = [
  { period: "2024 – 2026", title: "Master of Data Science", place: "RMIT University", detail: "Advanced study across machine learning, big data, information retrieval, time series analysis, and applied data science. Built practical projects spanning analytics, AI, RAG, document intelligence, and data visualisation." },
  { period: "2023 – 2024", title: "Project Intern Data Analyst", place: "Anoixe", detail: "Worked on data analysis and project-based problem solving, using data-driven approaches to extract insights and support practical business requirements." },
  { period: "2020 – 2024", title: "B.E. Computer Science", place: "Anna University", detail: "Built a strong foundation in computer science, programming, databases, algorithms, and software development, forming the foundation for my transition into data science and AI." },
];

// Your projects. Add more by copying a block and changing the values.
export const projects: Project[] = [
  {
    slug: "fashion-flask-ai",
    title: "FashionFlask: review-based recommendation app",
    categories: ["ml"],
    summary: "A Flask web app that predicts whether a shopper would recommend a clothing item from their review, and suggests similar items.",
    problem:
      "Online stores collect thousands of written reviews, but shoppers and merchandisers can't read them all. The goal was to turn a new review into an instant recommend / don't-recommend signal, and use the same model to surface items worth suggesting.",
    data: "19,662 women's clothing reviews across 1,095 items and 20 product classes, each with review text, a 1–5 star rating and a recommended flag (82% positive).",
    approach: [
      "Dropped incomplete rows and turned the review text into TF-IDF features (top 5,000 terms).",
      "Combined the text features with the star rating and trained a logistic regression classifier on an 80/20 split.",
      "Saved the model and vectorizer with joblib and loaded them into a Flask app.",
      "Built pages to browse items by category, read reviews, and submit a new review that is classified on the spot.",
      "Used the model's predictions to show three recommended items from the same category on each product page.",
    ],
    results:
      "The combined text-and-rating model reached 95.2% accuracy and 0.985 ROC-AUC on the held-out set, well above the 82.2% from always predicting the majority class. Rating alone is a strong signal, and adding the review text improves it further.",
    metrics: [
      { label: "Accuracy", value: "95.2%" },
      { label: "ROC-AUC", value: "0.985" },
      { label: "Macro F1", value: "0.92" },
    ],
    chart: {
      title: "Test accuracy by input features",
      unit: "%",
      higherIsBetter: true,
      bars: [
        { name: "Majority baseline", value: 82.2 },
        { name: "Review text", value: 89.8 },
        { name: "Star rating", value: 94.5 },
        { name: "Text + rating", value: 95.2, highlight: true },
      ],
    },
    stack: ["Python", "scikit-learn", "pandas", "TF-IDF", "Flask", "Bootstrap"],
    github: "https://github.com/aravindpk55/Fashion-Flask-AI",
    featured: true,
    year: "2025",
  },
  {
    slug: "global-sales-insights",
    title: "Sales insights dashboard",
    categories: ["analysis"],
    summary: "An interactive Tableau dashboard over a MySQL sales database, showing revenue and volume by market, customer, product and time.",
    problem:
      "Sales leaders at a hardware distributor had transaction data spread across several tables and no single view of how revenue was moving across markets, customers and products.",
    data: "A MySQL database of five linked tables (transactions, customers, products, markets, dates) covering 38 customers, 279 products and 15 Indian markets, from June 2017 onwards.",
    approach: [
      "Connected Tableau directly to MySQL and joined the five tables in a star schema around transactions.",
      "Converted USD transactions to INR with a calculated field so all revenue is comparable.",
      "Removed invalid records (zero or negative sales amounts) and out-of-scope markets outside India.",
      "Built nine views: revenue and quantity totals, revenue by market and by year, sales quantity by market, and top 5 customers and products.",
      "Combined them into one dashboard with year, month and market filters so any view can be drilled into.",
    ],
    results:
      "A single dashboard where a manager can pick a year, month or market and immediately see revenue, volume and the top customers and products behind it.",
    metrics: [
      { label: "Linked tables", value: "5" },
      { label: "Markets", value: "15" },
      { label: "Dashboard views", value: "9" },
    ],
    stack: ["Tableau", "MySQL", "SQL", "Data cleaning"],
    github: "https://github.com/aravindpk55/Global-Sales-Insights-",
    year: "2025",
  },
];
