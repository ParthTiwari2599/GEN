import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const promptLibrary = [
  {
    id: 1,
    title: "Modern SaaS Hero Section",
    focus: "Landing",
    prompt:
      "Create a modern SaaS hero section with a strong headline, short supporting text, two CTA buttons, trust badge row, and a right-side product mockup card. Keep it responsive for mobile-first screens. Use clean spacing, subtle shadows, and smooth hover animations.",
  },
  {
    id: 2,
    title: "3-Tier Pricing Section",
    focus: "Conversion",
    prompt:
      "Build a responsive pricing section with 3 pricing cards where the middle plan is highlighted as Most Popular. Include plan name, price, feature list, and CTA button. Add toggle-ready structure for monthly/yearly text. Keep typography clear and conversion focused.",
  },
  {
    id: 3,
    title: "Dashboard Stats + Activity",
    focus: "Product UI",
    prompt:
      "Design a dashboard section with top stat cards, one chart placeholder area, and a recent activity list. Use a clean grid, readable spacing, and responsive stacking on mobile. Make it feel like an admin product interface.",
  },
  {
    id: 4,
    title: "Auth Form Block",
    focus: "UX",
    prompt:
      "Generate a polished sign in / sign up form section with heading, helper text, labeled inputs, primary CTA, social login buttons, and forgot password link. Include validation state styling and mobile responsive layout.",
  },
  {
    id: 5,
    title: "Feature Bento Grid",
    focus: "Marketing",
    prompt:
      "Create a feature showcase section in bento-grid style with 5 cards of different sizes. Each card should include icon placeholder, short heading, and one-line description. Add subtle hover interaction and maintain responsive behavior.",
  },
  {
    id: 6,
    title: "Testimonial + Logos Section",
    focus: "Social Proof",
    prompt:
      "Build a testimonial section with 3 user reviews, ratings, names, and roles plus a trusted-by logo strip above. Keep design clean and product-oriented with good spacing and responsive card layout.",
  },
];

const usageSteps = [
  "Copy a prompt from this library.",
  "Open GEN and paste it into the prompt area.",
  "Select your framework and generate the component.",
  "Preview, refine, then copy or export the code.",
];

const Showcase = () => {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = async (item) => {
    try {
      await navigator.clipboard.writeText(item.prompt);
      setCopiedId(item.id);
      toast.success("Prompt copied");
      setTimeout(() => setCopiedId(null), 1400);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#f4ede1] text-[#2b2117]">
      <div className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-[#d9824c]/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-28 top-[38rem] h-96 w-96 rounded-full bg-[#7e9a70]/20 blur-3xl" />

      <section className="reveal-scroll reveal-early relative z-10 mx-auto min-h-[72vh] w-full max-w-6xl px-6 pb-10 pt-28 md:px-10">
        <p className="w-fit rounded-full border border-[#5e442f]/20 bg-[#fffaf2] px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#7b5738]">
          Prompt Showcase
        </p>
        <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.05] md:text-6xl">
          Copy a prompt,
          <span className="block text-[#9a3f22]">paste in GEN, build your section.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#4a3a2e] md:text-lg">
          This page provides production-friendly UI/UX prompts. Copy a template, paste it into GEN, and generate your
          section instantly.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate("/gen")}
            className="rounded-full bg-[#a34b2b] px-7 py-3 text-base font-semibold text-[#fff7ef] transition hover:bg-[#8a3f24]"
          >
            Open GEN
          </button>
          <span className="text-sm text-[#5e4c3d]">Copy a prompt and generate immediately.</span>
        </div>
      </section>

      <section className="reveal-scroll relative z-10 mx-auto w-full max-w-6xl px-6 py-12 md:px-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8f6c50]">Prompt library</p>
            <h2 className="mt-2 text-3xl font-black md:text-5xl">UI/UX prompt templates</h2>
          </div>
          <p className="max-w-lg text-sm leading-relaxed text-[#5a4737]">
            Use these prompts as-is, or tweak them to match your product tone and content style.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {promptLibrary.map((item) => (
            <article key={item.id} className="fluid-panel reveal-scroll reveal-late p-6">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a3f22]">{item.focus}</p>
              <h3 className="mt-2 text-2xl font-black text-[#2f241b]">{item.title}</h3>

              <div className="mt-4 rounded-2xl border border-[#d8c6b4] bg-[#fffdf8] p-4">
                <p className="text-sm leading-relaxed text-[#4a3a2e]">{item.prompt}</p>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleCopy(item)}
                  className="rounded-full bg-[#a34b2b] px-5 py-2 text-sm font-semibold text-[#fff7ef] transition hover:bg-[#8a3f24]"
                >
                  {copiedId === item.id ? "Copied" : "Copy Prompt"}
                </button>
                <button
                  onClick={() => navigate("/gen")}
                  className="rounded-full border border-[#7b5738]/40 px-4 py-2 text-sm font-semibold text-[#5e4c3d] transition hover:bg-[#fff8ef]"
                >
                  Paste in GEN
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="reveal-scroll relative z-10 mx-auto w-full max-w-6xl px-6 pb-24 pt-14 md:px-10">
        <div className="rounded-[2.5rem] bg-[#2b2117] px-6 py-10 text-[#f7eee3] md:px-10 md:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d4bda7]">How to use</p>
          <h2 className="mt-2 text-3xl font-black md:text-5xl">Quick workflow</h2>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {usageSteps.map((step, index) => (
              <div key={step} className="flex items-start gap-3">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#d28a52] text-xs font-black text-[#2f1f12]">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm text-[#e2d2c1]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Showcase;
