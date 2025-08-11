// ─────────────────────────────────────────────────────────────────────────────
// LUCIDAD — Web-optimized ad fact‑checker (Next.js 14 + Tailwind)
// OPTIMIZED FOR WEB: Performance, accessibility, SEO, desktop experience
// ─────────────────────────────────────────────────────────────────────────────

// ============================================================================
// app/page.tsx — Main UI (client) - Web Optimized
// ============================================================================
"use client";
import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import type { FactCheckResult } from "@/lib/types";
import Head from "next/head";

export default function Page() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [cameraSupported, setCameraSupported] = useState(true);

  // Detect desktop and camera support
  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 768);
      setCameraSupported(!!navigator.mediaDevices?.getUserMedia);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Optimized camera initialization
  const initializeCamera = useCallback(async () => {
    if (typeof window === "undefined" || streaming || !cameraSupported) return;
    
    try {
      const constraints = {
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: isDesktop ? 1920 : 1280 },
          height: { ideal: isDesktop ? 1080 : 720 },
          aspectRatio: { ideal: 16/9 }
        },
        audio: false,
      };

      const media = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = media;
        await videoRef.current.play();
        setStreaming(true);
      }
    } catch (e) {
      console.warn("Camera access failed:", e);
      setCameraSupported(false);
    }
  }, [streaming, cameraSupported, isDesktop]);

  useEffect(() => {
    initializeCamera();
  }, [initializeCamera]);

  // Optimized photo capture with better quality
  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const maxW = isDesktop ? 2000 : 1400;
    const maxH = isDesktop ? 2000 : 1400;
    const vw = video.videoWidth || 1280;
    const vh = video.videoHeight || 720;
    const ratio = Math.min(maxW / vw, maxH / vh, 1);

    canvas.width = Math.round(vw * ratio);
    canvas.height = Math.round(vh * ratio);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Enhanced image processing for web
    ctx.filter = "contrast(1.1) saturate(1.05) brightness(1.05) sharpness(0.1)";
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/webp", 0.92); // Better compression
    setImageDataUrl(dataUrl);
    setResult(null);
    setError(null);
  }, [isDesktop]);

  // Optimized file upload with validation
  const onFileUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // File validation
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError("File too large. Please use an image under 10MB.");
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result);
    reader.readAsDataURL(file);
    setResult(null);
    setError(null);
  }, []);

  // Drag and drop support for web
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setImageDataUrl(reader.result);
      reader.readAsDataURL(file);
      setResult(null);
      setError(null);
    }
  }, []);

  const resetAll = useCallback(() => {
    setImageDataUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  // Optimized analysis with better error handling
  const analyze = useCallback(async () => {
    if (!imageDataUrl) return;
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageDataUrl }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${res.status}`);
      }
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Something went wrong while analyzing the advertisement.");
    } finally {
      setLoading(false);
    }
  }, [imageDataUrl]);

  // Keyboard shortcuts for web
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && imageDataUrl && !loading) {
        analyze();
      } else if (e.key === 'Escape') {
        resetAll();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [imageDataUrl, loading, analyze, resetAll]);

  // Memoized UI components for better performance
  const cameraUI = useMemo(() => (
    <div className="rounded-2xl overflow-hidden border border-neutral-200 bg-white shadow-sm">
      <div className={`${isDesktop ? 'aspect-video' : 'aspect-[3/4]'} w-full bg-black relative`}>
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          muted
          autoPlay
          aria-label="Camera preview"
        />
        {!cameraSupported && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-800 text-white">
            <p className="text-center p-4">Camera not supported. Please upload an image instead.</p>
          </div>
        )}
      </div>
      <div className="p-3 flex items-center gap-3">
        <button
          onClick={capturePhoto}
          disabled={!cameraSupported}
          className="flex-1 rounded-xl bg-neutral-900 text-white py-3 text-center font-medium active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Capture photo from camera"
        >
          Capture
        </button>
        <label className="flex-1 rounded-xl border border-neutral-300 bg-white py-3 text-center font-medium cursor-pointer hover:bg-neutral-50 transition-colors">
          Upload
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={onFileUpload}
            aria-label="Upload image file"
          />
        </label>
      </div>
    </div>
  ), [isDesktop, cameraSupported, capturePhoto, onFileUpload]);

  const dragDropZone = useMemo(() => (
    <div
      className="rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-50 p-8 text-center transition-all duration-200 hover:border-neutral-400 hover:bg-neutral-100"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
      aria-label="Drag and drop image here or click to upload"
    >
      <div className="space-y-2">
        <div className="text-4xl">📁</div>
        <p className="text-neutral-600">Drag & drop an image here</p>
        <p className="text-sm text-neutral-500">or click to browse</p>
      </div>
    </div>
  ), [handleDragOver, handleDragLeave, handleDrop]);

  return (
    <>
      <Head>
        <title>LucidAd - AI-Powered Ad Fact Checker</title>
        <meta name="description" content="Verify advertising claims with AI-powered fact checking. Point, capture, and verify any advertisement instantly." />
        <meta name="keywords" content="fact checker, advertising, AI, verification, claims" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="LucidAd - AI-Powered Ad Fact Checker" />
        <meta property="og:description" content="Verify advertising claims with AI-powered fact checking" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://lucidad.app" />
      </Head>

      <main className="min-h-[100dvh] bg-gradient-to-br from-neutral-50 to-neutral-100 text-neutral-900">
        <div className={`mx-auto w-full ${isDesktop ? 'max-w-4xl' : 'max-w-md'} pb-40`}>
          <header className="px-4 pt-6 pb-3 sticky top-0 bg-white/80 backdrop-blur z-10 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">LucidAd</h1>
                <p className="text-sm text-neutral-600">Point. Capture. Verify.</p>
              </div>
              {isDesktop && (
                <div className="text-xs text-neutral-500">
                  <p>Press Enter to analyze • Esc to reset</p>
                </div>
              )}
            </div>
          </header>

          <section className="p-4 space-y-4">
            {!imageDataUrl && (
              <>
                {isDesktop && dragDropZone}
                {!isDesktop && cameraUI}
              </>
            )}

            {imageDataUrl && (
              <div className="rounded-2xl overflow-hidden border border-neutral-200 bg-white shadow-sm">
                <img 
                  src={imageDataUrl} 
                  alt="Captured advertisement for analysis" 
                  className="w-full object-contain max-h-96"
                  loading="eager"
                />
              </div>
            )}

            {loading && (
              <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neutral-900"></div>
                  <p className="text-sm text-neutral-600">Analyzing ad… this usually takes a few seconds.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                <div className="flex items-start space-x-2">
                  <span className="text-red-500 text-lg">⚠️</span>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {result && <ResultCard result={result} />}
          </section>
        </div>

        <div
          className="fixed bottom-0 left-0 right-0 border-t border-neutral-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom))" }}
        >
          <div className={`mx-auto ${isDesktop ? 'max-w-4xl' : 'max-w-md'} px-4 py-2 grid grid-cols-2 gap-3`}>
            <button
              onClick={resetAll}
              className="rounded-xl border border-neutral-300 bg-white py-3 font-medium hover:bg-neutral-50 transition-colors"
              aria-label="Reset and start over"
            >
              Retake
            </button>
            <button
              disabled={!imageDataUrl || loading}
              onClick={analyze}
              className="rounded-xl bg-neutral-900 text-white py-3 font-medium disabled:opacity-50 hover:bg-neutral-800 transition-colors"
              aria-label="Analyze the captured advertisement"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </main>
    </>
  );
}

function ResultCard({ result }: { result: FactCheckResult }) {
  const score = Math.max(0, Math.min(100, result.truthScore ?? 0));
  const scoreColor = score >= 80 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-rose-500";

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-neutral-500">Product</div>
          <div className="text-lg font-semibold">{result.productName || "Unknown product"}</div>
          <div className="text-sm text-neutral-600">{result.company || "Unknown company"}</div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-neutral-500">Truth Score</div>
          <div className="text-2xl font-bold tabular-nums">{score}%</div>
        </div>
      </div>

      <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
        <div className={`h-full ${scoreColor}`} style={{ width: `${score}%` }} />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {result.category && <InfoRow label="Category" value={result.category} />}
        {result.briefContext && <InfoRow label="Context" value={result.briefContext} />}
        {result.keyNumbers?.length > 0 && <InfoList label="Key numbers" items={result.keyNumbers} />} 
        {result.measurableFacts?.length > 0 && <InfoList label="Measurable facts" items={result.measurableFacts} />}
      </div>

      {result.report && (
        <div>
          <div className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Fact‑check</div>
          <p className="text-sm leading-6 text-neutral-800">{result.report}</p>
        </div>
      )}

      {result.sources?.length > 0 && (
        <div>
          <div className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Sources</div>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {result.sources.map((s, i) => (
              <li key={i}>
                <a href={s.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                  {s.title || s.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[7rem,1fr] items-baseline gap-3">
      <div className="text-xs uppercase tracking-wider text-neutral-500">{label}</div>
      <div className="text-sm text-neutral-800">{value}</div>
    </div>
  );
}

function InfoList({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-neutral-500 mb-1">{label}</div>
      <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-800">
        {items.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// app/api/analyze/route.ts — Secure server route (no API key in client)
// ============================================================================
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { factCheckZ } from "@/lib/schema";

export const dynamic = "force-dynamic";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { image } = (await req.json()) as { image?: string };
    if (!image || typeof image !== "string" || !image.startsWith("data:image")) {
      return NextResponse.json(
        { error: "Invalid image. Send a data URL (base64) captured from camera or upload." },
        { status: 400 }
      );
    }

    const model = process.env.OPENAI_VISION_MODEL || "gpt-4o"; // or newer when available

    const instructions =
      "You are LucidAd, an advertising claim fact-checker. Analyze the advertisement image and return concise, source-linked JSON per the schema. Steps: 1) Identify ad name/company; 2) Virtually enhance (brightness/contrast/sharpness), denoise, deskew (conceptually) and run OCR; 3) Focus on relevant ad area; 4) Extract text, isolate factual claims; 5) Briefly infer context; 6) Rephrase main claim(s) as fact-checkable statements; 7) Extract product, company, key numbers, measurable facts; 8) Categorize claim type; 9) Optionally map to date/region/model; 10) Verify claim(s); 11) Assign 0–100 truth probability; 12) ~2 sentence summary; 13) Provide 2–5 credible source links.";

    const FactCheckSchemaForAPI = {
      name: "fact_check_schema",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          productName: { type: ["string", "null"] },
          company: { type: ["string", "null"] },
          keyNumbers: { type: "array", items: { type: "string" } },
          measurableFacts: { type: "array", items: { type: "string" } },
          category: { type: ["string", "null"] },
          briefContext: { type: ["string", "null"] },
          truthScore: { type: ["integer", "null"], minimum: 0, maximum: 100 },
          report: { type: "string" },
          sources: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: { type: ["string", "null"] },
                url: { type: "string" },
              },
              required: ["url"],
            },
          },
        },
        required: [
          "productName",
          "company",
          "keyNumbers",
          "measurableFacts",
          "category",
          "briefContext",
          "truthScore",
          "report",
          "sources",
        ],
      },
      strict: true,
    } as const;

    const response = await client.responses.create({
      model,
      temperature: 0.2,
      response_format: { type: "json_schema", json_schema: FactCheckSchemaForAPI },
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: instructions },
            { type: "input_image", image_url: image },
          ],
        },
      ],
      max_output_tokens: 900,
    });

    const jsonText = (response as any).output_text as string;
    const parsed = JSON.parse(jsonText);

    const validated = factCheckZ.parse(parsed);
    return NextResponse.json(validated);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 422 });
    }
    console.error("/api/analyze error", err);
    return NextResponse.json({ error: err?.message || "Unexpected server error" }, { status: 500 });
  }
}

// ============================================================================
// lib/types.ts — Shared types
// ============================================================================
export type SourceLink = { title?: string | null; url: string };
export type FactCheckResult = {
  productName: string | null;
  company: string | null;
  keyNumbers: string[];
  measurableFacts: string[];
  category: string | null;
  briefContext: string | null;
  truthScore: number | null; // 0–100
  report: string; // ~2 sentences
  sources: SourceLink[];
};

// ============================================================================
// lib/schema.ts — Zod schema + helper
// ============================================================================
import { z } from "zod";

export const sourceZ = z.object({
  title: z.string().nullable().optional(),
  url: z.string().url(),
});

export const factCheckZ = z.object({
  productName: z.string().nullable(),
  company: z.string().nullable(),
  keyNumbers: z.array(z.string()).default([]),
  measurableFacts: z.array(z.string()).default([]),
  category: z.string().nullable(),
  briefContext: z.string().nullable(),
  truthScore: z.number().int().min(0).max(100).nullable(),
  report: z.string(),
  sources: z.array(sourceZ).default([]),
});

export type FactCheck = z.infer<typeof factCheckZ>;

// ============================================================================
// styles/globals.css — Tailwind + globals (NO nested comments)
// ============================================================================
/* Tailwind layer directives */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light; }
html, body { height: 100%; }
body { @apply bg-neutral-50 text-neutral-900; }

/* Avoid 100vh issues on iOS; dvh handles dynamic viewport */
img, video { max-width: 100%; height: auto; }

// ============================================================================
// tailwind.config.ts — minimal example
// ============================================================================
// import type { Config } from "tailwindcss";
// const config: Config = {
//   content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
//   theme: { extend: {} },
//   plugins: [],
// };
// export default config;

// ============================================================================
// __tests__/factCheckResult.schema.test.ts — basic tests
// Run with:  npx vitest  (add devDeps: vitest zod @types/node)
// ============================================================================
import { describe, it, expect } from "vitest";
import { factCheckZ } from "@/lib/schema";

describe("factCheckZ schema", () => {
  it("accepts a valid response", () => {
    const data = {
      productName: "TurboBattery X",
      company: "PowerCorp",
      keyNumbers: ["3x longer", "5000mAh"],
      measurableFacts: ["Battery capacity: 5000mAh", "Fast charge: 45W"],
      category: "tech spec",
      briefContext: "Smartphone battery endurance claim.",
      truthScore: 72,
      report: "Independent tests show above-average endurance but not 3× under standardized benchmarks.",
      sources: [
        { title: "PowerCorp specs", url: "https://example.com/specs" },
        { title: "Lab review", url: "https://example.com/review" },
      ],
    };
    const parsed = factCheckZ.parse(data);
    expect(parsed.productName).toBe("TurboBattery X");
    expect(parsed.truthScore).toBe(72);
    expect(parsed.sources.length).toBe(2);
  });

  it("rejects out-of-range truthScore", () => {
    const bad = {
      productName: "X",
      company: "Y",
      keyNumbers: [],
      measurableFacts: [],
      category: null,
      briefContext: null,
      truthScore: 120, // invalid
      report: "x",
      sources: [],
    };
    expect(() => factCheckZ.parse(bad)).toThrow();
  });

  it("allows nullables and defaults", () => {
    const minimal = {
      productName: null,
      company: null,
      keyNumbers: [],
      measurableFacts: [],
      category: null,
      briefContext: null,
      truthScore: null,
      report: "Insufficient information to verify.",
      sources: [],
    };
    const parsed = factCheckZ.parse(minimal);
    expect(parsed.report).toContain("Insufficient");
  });
});

// ============================================================================
// README (quick run)
// ============================================================================
// 1) npm i openai zod
// 2) (optional) npm i -D vitest @types/node
// 3) Add .env.local with OPENAI_API_KEY
// 4) npm run dev
// 5) Run tests: npx vitest
