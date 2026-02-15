import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { BsStars } from "react-icons/bs";
import { HiOutlineCode } from "react-icons/hi";
import Editor from "@monaco-editor/react";
import { IoCloseSharp, IoCopy } from "react-icons/io5";
import { PiExportBold } from "react-icons/pi";
import { ImNewTab } from "react-icons/im";
import { FiRefreshCcw } from "react-icons/fi";
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const highlights = [
  "Prompt to code and preview in one place",
  "Framework-aware generation",
  "Copy, export, and iterate quickly",
  "Structured output, not random clutter",
];

const promptTips = [
  "Clearly define the component goal.",
  "Describe visual hierarchy and layout flow.",
  "Mention responsive behavior for mobile and desktop.",
  "Specify tone, spacing, and interaction style.",
];

const frameworkOptions = [
  { value: "html-css", label: "HTML + CSS" },
  { value: "html-css-js", label: "HTML + CSS + JS" },
  { value: "html-tailwind", label: "HTML + Tailwind CSS" },
  { value: "react-js", label: "React (JavaScript)" },
  { value: "react-ts", label: "React (TypeScript)" },
  { value: "react-tailwind", label: "React + Tailwind CSS" },
  { value: "nextjs-tailwind", label: "Next.js + Tailwind CSS" },
  { value: "nextjs-ts", label: "Next.js (TypeScript)" },
  { value: "nextjs-css-modules", label: "Next.js + CSS Modules" },
  { value: "vue-tailwind", label: "Vue + Tailwind CSS" },
];

const frameworkGuide = {
  "html-css": "Return a single HTML file with internal CSS.",
  "html-css-js": "Return a single HTML file with internal CSS and JS.",
  "html-tailwind": "Return a single HTML file with Tailwind CDN setup.",
  "react-js": "Return one React component in JavaScript (.jsx).",
  "react-ts": "Return one React component in TypeScript (.tsx).",
  "react-tailwind": "Return one React component using Tailwind classes.",
  "nextjs-tailwind": "Return one Next.js component/page using Tailwind.",
  "nextjs-ts": "Return one Next.js component/page in TypeScript.",
  "nextjs-css-modules": "Return Next.js component + CSS module code blocks.",
  "vue-tailwind": "Return one Vue SFC component using Tailwind classes.",
};

const Gen = () => {
  const navigate = useNavigate();
  const options = frameworkOptions;

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [previewDoc, setPreviewDoc] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const cacheRef = useRef(new Map());

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      setScrollProgress(Math.max(0, Math.min(100, progress)));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isNewTabOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onEscape = (event) => {
      if (event.key === "Escape") setIsNewTabOpen(false);
    };
    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onEscape);
    };
  }, [isNewTabOpen]);

  function cleanFenceArtifacts(source) {
    if (!source) return "";
    let cleaned = source.trim();
    cleaned = cleaned.replace(/^\s*(?:```|~~~)[a-zA-Z0-9_-]*\s*\n?/, "");
    cleaned = cleaned.replace(/\n?\s*(?:```|~~~)\s*$/, "");
    cleaned = cleaned.replace(/^\s*(?:```|~~~)\s*$/gm, "");
    return cleaned.trim();
  }

  function ensureRunnableHtml(source) {
    const cleaned = cleanFenceArtifacts(source);
    if (!cleaned) return "";
    const lower = cleaned.toLowerCase();
    if (
      lower.includes("<!doctype") ||
      lower.includes("<html") ||
      lower.includes("<head") ||
      lower.includes("<body")
    ) {
      return cleaned;
    }
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Generated Preview</title>
    <style>body{margin:0;padding:16px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;}</style>
  </head>
  <body>
${cleaned}
  </body>
</html>`;
  }

  function extractCodeBlocks(response) {
    const matches = [...response.matchAll(/(?:```|~~~)(\w+)?\s*([\s\S]*?)(?:```|~~~)/g)];
    if (!matches.length) {
      return [{ lang: "", code: cleanFenceArtifacts(response) }];
    }

    return matches.map((match) => ({
      lang: (match[1] || "").toLowerCase(),
      code: cleanFenceArtifacts(match[2]),
    }));
  }

  function isRunnableHtml(source) {
    const s = source.toLowerCase();
    return s.includes("<html") || s.includes("<body") || s.includes("<!doctype");
  }

  const ai = new GoogleGenAI({
    apiKey: "AIzaSyD3xFymDosdKckq5gV97Md4a7DrTVvh1Ck",
  });

  async function generateWithFastStrategy(contents) {
    const attempts = [
      {
        model: "gemini-2.0-flash-lite",
        config: { temperature: 0.35, maxOutputTokens: 2200, thinkingConfig: { thinkingBudget: 0 } },
      },
      {
        model: "gemini-2.5-flash",
        config: { temperature: 0.35, maxOutputTokens: 2500, thinkingConfig: { thinkingBudget: 0 } },
      },
      { model: "gemini-2.5-flash" },
    ];

    let lastError;
    for (const attempt of attempts) {
      try {
        return await ai.models.generateContent({
          model: attempt.model,
          contents,
          ...(attempt.config ? { config: attempt.config } : {}),
        });
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  }

  async function getResponse() {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) return toast.error("Please describe your component first");

    const cacheKey = `${frameWork.value}::${cleanPrompt}`;
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      setCode(cached.code);
      setPreviewDoc(cached.previewDoc);
      setOutputScreen(true);
      toast.success("Loaded from cache");
      return;
    }

    try {
      setLoading(true);
      const response = await generateWithFastStrategy(
        `You are a senior frontend engineer.
Task: generate a clean, modern, responsive UI for this request: "${cleanPrompt}".
Framework: ${frameWork.label}.
Rule: ${frameworkGuide[frameWork.value] || "Return valid production-ready code."}
For HTML-based frameworks, return one code block only.
For non-HTML frameworks, return exactly two code blocks in this order:
1) framework code
2) a complete runnable HTML preview (standalone with CSS/JS) labeled html.
Do not add explanation text.`
      );

      const rawText = typeof response.text === "string" ? response.text : "";
      const blocks = extractCodeBlocks(rawText);
      const primaryCode = blocks[0]?.code || "";
      const htmlBlock =
        blocks.find((b) => b.lang === "html" && isRunnableHtml(b.code)) ||
        blocks.find((b) => isRunnableHtml(b.code));
      const previewHtml = ensureRunnableHtml(htmlBlock?.code || primaryCode);

      cacheRef.current.set(cacheKey, { code: cleanFenceArtifacts(primaryCode), previewDoc: previewHtml });
      setCode(cleanFenceArtifacts(primaryCode));
      setPreviewDoc(previewHtml);
      setOutputScreen(true);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while generating code");
    } finally {
      setLoading(false);
    }
  }

  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy");
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const downloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");
    const fileName = "GenUI-Code.html";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  return (
    <div className="gen-page relative overflow-hidden bg-[#f4ede1] text-[#2b2117]">
      <div className="scroll-progress-track">
        <div className="scroll-progress-fill" style={{ width: `${scrollProgress}%` }} />
      </div>
      <div className="gen-lines" />
      <div className="float-orb float-orb-one" />
      <div className="float-orb float-orb-two" />
      <div className="float-orb float-orb-three" />

      <section className="reveal-scroll reveal-early relative z-10 mx-auto min-h-[78vh] w-full max-w-6xl px-6 pb-8 pt-28 md:px-10">
        <p className="w-fit rounded-full border border-[#5e442f]/20 bg-[#fffaf2] px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#7b5738]">
          GEN Workspace
        </p>
        <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.05] md:text-6xl">
          Idea to code,
          <span className="block text-[#9a3f22]">inside one smooth workflow.</span>
        </h1>

        <div className="mt-8 flex flex-wrap gap-3">
          {highlights.map((item) => (
            <span
              key={item}
              className="rounded-full border border-[#5f4632]/20 bg-[#fffaf4]/80 px-4 py-2 text-sm font-semibold"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="reveal-scroll relative z-10 mx-auto w-full max-w-6xl px-6 py-10 md:px-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="fluid-panel relative overflow-hidden p-5 md:p-7">
            <div className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full border border-[#b99372]/30" />
            <h2 className="text-3xl font-black">Generator</h2>
            <p className="mt-2 text-[#6a5443]">Describe your component and generate usable frontend code.</p>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#7b5738]">Framework</p>
            <Select
              className="mt-2"
              options={options}
              value={frameWork}
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#fff8ef",
                  borderColor: "#d8c6b4",
                  color: "#2b2117",
                  boxShadow: "none",
                  borderRadius: "9999px",
                  padding: "4px 8px",
                  "&:hover": { borderColor: "#b9977d" },
                }),
                menu: (base) => ({ ...base, backgroundColor: "#fff8ef", color: "#2b2117", border: "1px solid #d8c6b4" }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected ? "#d28a52" : state.isFocused ? "#f2e4d5" : "#fff8ef",
                  color: "#2b2117",
                }),
                singleValue: (base) => ({ ...base, color: "#2b2117" }),
                input: (base) => ({ ...base, color: "#2b2117" }),
              }}
              onChange={(selected) => setFrameWork(selected)}
            />

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-[#7b5738]">Component brief</p>
            <textarea
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
              className="mt-3 min-h-[220px] w-full resize-none rounded-[1.5rem] border border-[#d8c6b4] bg-[#fffdf8] p-4 text-[#2b2117] placeholder-[#8a7463] outline-none focus:border-[#b9977d]"
              placeholder="Example: create a clean services section with icon-led cards and a mobile-first layout"
            />

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#6a5443]">Generate and refine output in the right panel.</p>
              <button
                onClick={getResponse}
                className="flex items-center gap-2 rounded-full bg-[#a34b2b] px-6 py-3 font-semibold text-[#fff7ef] transition hover:bg-[#8a3f24]"
              >
                {loading ? <ClipLoader color="#fff7ef" size={18} /> : <BsStars />}
                Generate
              </button>
            </div>
          </div>

          <div className="fluid-panel reveal-scroll reveal-late relative h-[80vh] overflow-hidden rounded-[2.8rem_2.8rem_1.4rem_1.4rem]">
            {!outputScreen ? (
              <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center">
                <div className="flex h-[82px] w-[82px] items-center justify-center rounded-full bg-[#d28a52] text-[35px] text-[#2f1f12]">
                  <HiOutlineCode />
                </div>
                <p className="mt-4 text-[16px] text-[#6a5443]">Generated code and preview will appear here.</p>
              </div>
            ) : (
              <>
                <div className="flex h-[52px] w-full items-center gap-3 border-b border-[#d9c8b8] bg-[#f7ece0] px-3">
                  <button
                    onClick={() => setTab(1)}
                    className={`w-1/2 rounded-full py-2 transition ${
                      tab === 1 ? "bg-[#a34b2b] text-[#fff7ef]" : "bg-[#e6d8ca] text-[#4b3a2e]"
                    }`}
                  >
                    Code
                  </button>
                  <button
                    onClick={() => setTab(2)}
                    className={`w-1/2 rounded-full py-2 transition ${
                      tab === 2 ? "bg-[#a34b2b] text-[#fff7ef]" : "bg-[#e6d8ca] text-[#4b3a2e]"
                    }`}
                  >
                    Preview
                  </button>
                </div>

                <div className="flex h-[52px] w-full items-center justify-between border-b border-[#d9c8b8] bg-[#f7ece0] px-4">
                  <p className="font-bold text-[#3b2c22]">Output</p>
                  <div className="flex items-center gap-2">
                    {tab === 1 ? (
                      <>
                        <button
                          onClick={copyCode}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ccb6a1] hover:bg-[#eadacc]"
                        >
                          <IoCopy />
                        </button>
                        <button
                          onClick={downloadFile}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ccb6a1] hover:bg-[#eadacc]"
                        >
                          <PiExportBold />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setIsNewTabOpen(true)}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ccb6a1] hover:bg-[#eadacc]"
                          title="Open full screen"
                        >
                          <ImNewTab />
                        </button>
                        <button
                          onClick={() => setRefreshKey((prev) => prev + 1)}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ccb6a1] hover:bg-[#eadacc]"
                        >
                          <FiRefreshCcw />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="h-[calc(100%-104px)]">
                  {tab === 1 ? (
                    <Editor value={code} height="100%" theme="vs-light" language="html" />
                  ) : (
                    <iframe
                      key={refreshKey}
                      srcDoc={previewDoc || code}
                      className="h-full w-full bg-white text-black"
                      title="preview"
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {isNewTabOpen && (
          <div className="fixed inset-0 z-[90] h-dvh w-screen bg-[#120d09]/85 backdrop-blur-md">
            <div className="h-full w-full p-2 md:p-5">
              <div className="fluid-panel relative h-full w-full overflow-hidden rounded-[1.6rem] !bg-white">
                <div className="absolute inset-x-0 top-0 z-20 flex h-[64px] items-center justify-between border-b border-[#e6d8ca] bg-[#f7ece0]/95 px-4 text-[#2b2117] md:px-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setIsNewTabOpen(false);
                        navigate(-1);
                      }}
                      className="rounded-full border border-[#ccb6a1] px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-[#eadacc]"
                    >
                      Cut and Go Back
                    </button>
                    <p className="font-bold">Full Screen Preview</p>
                  </div>
                  <button
                    onClick={() => setIsNewTabOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ccb6a1] hover:bg-[#eadacc]"
                    title="Close full screen"
                  >
                    <IoCloseSharp />
                  </button>
                </div>
                <iframe
                  srcDoc={previewDoc || code}
                  className="h-full w-full pt-[64px]"
                  title="fullscreen-preview"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="reveal-scroll relative z-10 mx-auto w-full max-w-6xl px-6 py-20 md:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8f6c50]">Prompt guidance</p>
            <h3 className="mt-3 text-3xl font-black md:text-5xl">Write better prompts for cleaner output</h3>
            <ul className="mt-8 space-y-4">
              {promptTips.map((tip, index) => (
                <li key={tip} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#a34b2b] text-xs font-bold text-[#fff7ef]">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-[#5a4737]">{tip}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="fluid-panel-alt reveal-scroll reveal-late p-10 text-[#2b2117]">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8f6c50]">Quick launch</p>
            <h4 className="mt-2 text-3xl font-black">Ready to generate?</h4>
            <p className="mt-3 text-sm leading-relaxed text-[#5a4737]">
              Use a focused prompt, generate the section, review in preview mode, then export the final output.
            </p>
            <button
              onClick={getResponse}
              className="mt-6 rounded-full bg-[#a34b2b] px-6 py-3 font-semibold text-[#fff7ef] transition hover:bg-[#8a3f24]"
            >
              Generate now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gen;
