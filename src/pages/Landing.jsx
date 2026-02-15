import React from "react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Prompt to UI",
    desc: "Turn a plain prompt into practical component structure without visual clutter.",
  },
  {
    title: "Framework Control",
    desc: "Choose HTML, Tailwind, or React-oriented output before generation.",
  },
  {
    title: "Live Preview",
    desc: "Review code and visual output side by side for faster iteration.",
  },
  {
    title: "Export Ready",
    desc: "Copy or download generated code and integrate directly into your project.",
  },
];

const workflow = [
  { step: "01", title: "Describe", text: "Define intent, layout, and visual tone." },
  { step: "02", title: "Generate", text: "Create a working UI block from your prompt." },
  { step: "03", title: "Refine", text: "Adjust spacing and hierarchy after preview." },
  { step: "04", title: "Ship", text: "Export polished output into your product." },
];

const useCases = [
  "Portfolio sections",
  "Marketing hero blocks",
  "Pricing layouts",
  "Dashboard widgets",
  "Auth and forms",
  "Landing sections",
  "Showcase pages",
  "Reusable modules",
];

const showcaseIdeas = [
  {
    title: "SaaS Hero",
    summary: "Headline-driven hero with trust row, CTAs, and balanced responsive layout.",
  },
  {
    title: "Pricing Comparison",
    summary: "Three-plan pricing section with highlighted option and clean feature breakdown.",
  },
  {
    title: "Admin Summary",
    summary: "Top stats, chart area, and recent activity for product dashboards.",
  },
];

const qualityPoints = [
  "Clear typography and spacing hierarchy",
  "Mobile-first responsiveness",
  "Clean editable markup",
  "Fast prompt-to-preview cycle",
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-[#f4ede1] text-[#2b2117]">
      <div className="pointer-events-none absolute -left-28 top-20 h-80 w-80 rounded-full bg-[#d9824c]/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-[34rem] h-96 w-96 rounded-full bg-[#7e9a70]/25 blur-3xl" />
      <div className="pointer-events-none absolute left-1/3 top-[120rem] h-80 w-80 rounded-full bg-[#c7a36c]/20 blur-3xl" />

      <section className="reveal-scroll reveal-early relative z-10 mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 pb-14 pt-28 md:px-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="mb-5 w-fit rounded-full border border-[#5e442f]/25 bg-[#fffaf2] px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#7b5738]">
            UI Builder
          </p>
          <h1 className="max-w-3xl text-4xl font-black leading-[1.05] md:text-6xl">
            Build clean components,
            <span className="block text-[#9a3f22]">without template-looking UI.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#4a3a2e] md:text-lg">
            This app speeds up frontend production while keeping output practical, editable, and visually consistent.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate("/gen")}
              className="rounded-full bg-[#a34b2b] px-8 py-4 text-base font-semibold text-[#fff7ef] shadow-[0_14px_30px_rgba(102,46,25,0.26)] transition hover:-translate-y-0.5 hover:bg-[#8a3f24]"
            >
              Start Building
            </button>
            <button
              onClick={() => navigate("/showcase")}
              className="rounded-full border border-[#7b5738]/40 px-6 py-3 text-sm font-semibold text-[#5e4c3d] transition hover:bg-[#fff8ef]"
            >
              Browse Prompt Showcase
            </button>
          </div>
        </div>

        <div className="fluid-panel-alt reveal-scroll reveal-late relative mx-auto w-full max-w-sm p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f6c50]">Output quality</p>
          <p className="mt-3 text-5xl font-black text-[#2f241b]">4x</p>
          <p className="mt-2 text-sm leading-relaxed text-[#5a4737]">
            Faster UI drafting with cleaner structure and preview-first iteration.
          </p>
        </div>
      </section>

      <section className="reveal-scroll relative z-10 mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8f6c50]">Inside the app</p>
          <h2 className="mt-3 text-3xl font-black leading-tight md:text-5xl">What you get</h2>
        </div>

        <div className="relative">
          <div className="absolute left-[7px] top-3 h-[calc(100%-24px)] w-px bg-[#b99372]/50" />
          <div className="space-y-10">
            {features.map((item, index) => (
              <article key={item.title} className="relative pl-10">
                <span className="absolute left-0 top-2 h-4 w-4 rounded-full bg-[#9a3f22]" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a3f22]">Point {index + 1}</p>
                <h3 className="mt-1 text-2xl font-black text-[#2f241b]">{item.title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5a4737]">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal-scroll reveal-late relative z-10 mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8f6c50]">From showcase</p>
            <h2 className="mt-2 text-3xl font-black md:text-5xl">Popular component directions</h2>
          </div>
          <button
            onClick={() => navigate("/showcase")}
            className="rounded-full bg-[#a34b2b] px-6 py-3 text-sm font-semibold text-[#fff7ef] transition hover:bg-[#8a3f24]"
          >
            Open Prompt Library
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {showcaseIdeas.map((item) => (
            <article key={item.title} className="fluid-panel p-6">
              <h3 className="text-2xl font-black text-[#2f241b]">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5a4737]">{item.summary}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {qualityPoints.map((item) => (
            <span
              key={item}
              className="rounded-full border border-[#5f4632]/20 bg-[#fffaf4]/80 px-5 py-2 text-sm font-semibold text-[#3f3126]"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="reveal-scroll relative z-10 mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#2b2117] px-6 py-10 text-[#f7eee3] md:px-10 md:py-14">
          <div className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full border border-[#f1d7bb]/25" />
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d4bda7]">Workflow</p>
          <h2 className="mt-3 text-3xl font-black md:text-5xl">How it works</h2>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {workflow.map((item, index) => (
              <div key={item.step} className={`${index % 2 === 1 ? "md:translate-y-6" : ""}`}>
                <p className="text-xs font-bold tracking-[0.2em] text-[#d28a52]">STEP {item.step}</p>
                <h3 className="mt-1 text-2xl font-black">{item.title}</h3>
                <p className="mt-2 text-sm text-[#dcc9b6]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="reveal-scroll relative z-10 mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8f6c50]">Use cases</p>
        <h2 className="mt-3 text-3xl font-black md:text-5xl">Built for multiple screens</h2>

        <div className="mt-10 flex flex-wrap gap-3">
          {useCases.map((item) => (
            <span
              key={item}
              className="rounded-full border border-[#5f4632]/20 bg-[#fffaf4]/80 px-5 py-2 text-sm font-semibold text-[#3f3126]"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="reveal-scroll relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 pt-6 md:px-10">
        <div className="flex flex-col items-start justify-between gap-6 border-t border-[#b99372]/40 py-10 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-black leading-tight md:text-5xl">Ready to generate your first component?</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5a4737] md:text-base">
              Write a prompt, select a framework, preview the result, and ship.
            </p>
          </div>
          <button
            onClick={() => navigate("/gen")}
            className="rounded-full bg-[#a34b2b] px-7 py-3 text-base font-semibold text-[#fff7ef] transition hover:bg-[#8a3f24]"
          >
            Go to Generator
          </button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
