"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUp, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { matchFaq } from "@/lib/faq-match";
import { track } from "@/lib/analytics";
import { assistantLeadSchema } from "@/lib/validation";
import { useFormSubmit } from "@/components/forms/useFormSubmit";
import { ConsentCheckbox, FormStatusMessage, Honeypot, Spinner } from "@/components/forms/fields";
import { cn } from "@/lib/utils";

type Msg =
  | { id: number; from: "bot"; text: string; links?: { label: string; href: string }[]; offerLead?: boolean }
  | { id: number; from: "user"; text: string }
  | { id: number; from: "lead" };

const quickReplies = ["What does LARA do?", "Can you automate our work?", "How much does it cost?", "Talk to a person"];

let nextId = 1;

export default function AssistantPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: nextId++,
      from: "bot",
      text: "Hi — I’m the LARA Solutions website guide. I can explain our services, point you to the right page, or pass your question to our team.",
    },
  ]);
  const [input, setInput] = useState("");
  const [lastQuestion, setLastQuestion] = useState("");
  const [thinking, setThinking] = useState(false);
  const [mode, setMode] = useState<"ai" | "faq">("faq");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const ask = async (text: string) => {
    const q = text.trim();
    if (!q || thinking) return;
    setInput("");
    setLastQuestion(q);
    const userMsg: Msg = { id: nextId++, from: "user", text: q };

    const wantsHuman = /(person|human|someone|team|call me|speak to|talk to)/i.test(q);
    if (wantsHuman) {
      setMessages((m) => [...m, userMsg, { id: nextId++, from: "bot", text: "Happy to connect you with our team. Leave your details below and we’ll reply by email." }, { id: nextId++, from: "lead" }]);
      return;
    }

    // Recent text turns give the AI backend conversational context.
    const history = messages
      .filter((m): m is Extract<Msg, { text: string }> => m.from !== "lead" && m.id !== 1)
      .slice(-6)
      .map((m) => ({ role: m.from === "user" ? ("user" as const) : ("assistant" as const), content: m.text }));

    setMessages((m) => [...m, userMsg]);
    setThinking(true);
    let reply: Msg;
    try {
      const res = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: q, history }) });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { mode: "ai" | "faq"; answer: string; links: { label: string; href: string }[]; offerLead: boolean };
      setMode(data.mode);
      track("assistant_question", { mode: data.mode });
      reply = { id: nextId++, from: "bot", text: data.answer, links: data.links, offerLead: data.offerLead };
    } catch {
      // Offline or server error: answer locally from the approved FAQ.
      const hit = matchFaq(q);
      reply = hit
        ? { id: nextId++, from: "bot", text: hit.entry.answer, links: hit.entry.links, offerLead: true }
        : { id: nextId++, from: "bot", text: "I don’t have an approved answer for that yet. Our team can help — would you like to leave your details so someone can reply personally?", offerLead: true };
    } finally {
      setThinking(false);
    }
    setMessages((m) => [...m, reply]);
  };

  const showLeadForm = () => {
    if (messages.some((m) => m.from === "lead")) return;
    setMessages((m) => [...m, { id: nextId++, from: "lead" }]);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void ask(input);
  };

  return (
    <motion.div
      id="lara-assistant"
      role="dialog"
      aria-label="LARA Solutions website assistant"
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="glass ring-gradient fixed inset-x-3 bottom-24 z-[60] flex max-h-[min(640px,calc(100dvh-8rem))] flex-col overflow-hidden rounded-3xl shadow-2xl shadow-black/60 sm:inset-x-auto sm:right-7 sm:w-[400px]"
      style={{ background: "rgb(8 20 39 / 0.96)" }}
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full border border-line-strong bg-section">
            <Image src="/brand/lara-logo-mark.png" alt="" width={562} height={387} className="w-7 h-auto object-contain" />
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-fg">LARA Guide</p>
            <p className="text-[11px] text-muted">{mode === "ai" ? "AI-assisted · approved company information only" : "Answers from our approved FAQ"}</p>
          </div>
        </div>
        <button type="button" onClick={onClose} aria-label="Close assistant" className="rounded-full p-2 text-muted hover:bg-white/5 hover:text-fg">
          <X aria-hidden className="size-4" />
        </button>
      </div>

      <div ref={listRef} data-lenis-prevent className="flex-1 space-y-4 overflow-y-auto px-5 py-5" aria-live="polite">
        {messages.map((m) => {
          if (m.from === "lead") return <LeadForm key={m.id} defaultMessage={lastQuestion} />;
          const bot = m.from === "bot";
          return (
            <div key={m.id} className={cn("flex", bot ? "justify-start" : "justify-end")}>
              <div className={cn("max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed", bot ? "rounded-tl-md bg-card text-body" : "rounded-tr-md bg-electric text-white")}>
                <p>{m.text}</p>
                {bot && m.links && m.links.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.links.map((l) => (
                      <Link key={l.href} href={l.href} className="rounded-full border border-line-strong px-3 py-1 text-xs text-fg hover:border-accent">
                        {l.label} →
                      </Link>
                    ))}
                  </div>
                )}
                {bot && m.offerLead && (
                  <button type="button" onClick={showLeadForm} className="mt-3 block text-xs font-medium text-muted hover:text-fg">
                    Ask our team directly
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {thinking && (
          <div className="flex justify-start" aria-label="Assistant is typing">
            <div className="flex gap-1 rounded-2xl rounded-tl-md bg-card px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {quickReplies.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => void ask(q)}
                className="rounded-full border border-line-strong px-3 py-1.5 text-xs text-body transition-colors hover:border-accent hover:text-fg"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="border-t border-line p-3">
        <div className="flex items-center gap-2 rounded-full border border-line-strong bg-card py-1 pl-4 pr-1 focus-within:border-accent">
          <label htmlFor="assistant-input" className="sr-only">
            Ask a question
          </label>
          <input
            ref={inputRef}
            id="assistant-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about our services…"
            maxLength={300}
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent text-sm text-fg placeholder:text-muted/70 focus:outline-none"
          />
          <button type="submit" aria-label="Send" disabled={!input.trim() || thinking} className="bg-electric flex size-9 items-center justify-center rounded-full text-white disabled:opacity-40">
            <ArrowUp aria-hidden className="size-4" />
          </button>
        </div>
        <p className="mt-2 px-2 text-center text-[10px] text-muted">{mode === "ai" ? "AI answers are limited to approved LARA information and may be imperfect." : "Guided assistant with pre-approved answers."} For anything specific, our team will reply personally.</p>
      </form>
    </motion.div>
  );
}

function LeadForm({ defaultMessage }: { defaultMessage: string }) {
  const [v, setV] = useState({ fullName: "", email: "", message: defaultMessage, consent: false });
  const [honeypot, setHoneypot] = useState("");
  const { status, message, errors, submit } = useFormSubmit("/api/assistant-lead", assistantLeadSchema);

  if (status === "success") return <FormStatusMessage status={status} message={message} />;

  const input = "w-full rounded-xl border border-line-strong bg-card px-3 py-2 text-sm text-fg placeholder:text-muted/70 focus:border-accent focus:outline-none";

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        await submit({ ...v, consent: v.consent as true }, honeypot);
      }}
      className="relative space-y-3 rounded-2xl border border-line-strong bg-card p-4"
    >
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <p className="font-display text-sm font-medium text-fg">Request a consultation</p>
      <div>
        <label htmlFor="al-name" className="sr-only">
          Your name
        </label>
        <input id="al-name" autoComplete="name" placeholder="Your name" className={input} value={v.fullName} onChange={(e) => setV({ ...v, fullName: e.target.value })} aria-invalid={Boolean(errors.fullName) || undefined} />
        {errors.fullName && <p className="mt-1 text-xs text-danger">{errors.fullName}</p>}
      </div>
      <div>
        <label htmlFor="al-email" className="sr-only">
          Work email
        </label>
        <input id="al-email" type="email" autoComplete="email" placeholder="Work email" className={input} value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} aria-invalid={Boolean(errors.email) || undefined} />
        {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="al-msg" className="sr-only">
          How can we help?
        </label>
        <textarea id="al-msg" rows={3} placeholder="How can we help?" className={input} value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} aria-invalid={Boolean(errors.message) || undefined} />
        {errors.message && <p className="mt-1 text-xs text-danger">{errors.message}</p>}
      </div>
      <ConsentCheckbox id="al-consent" checked={v.consent} onChange={(c) => setV({ ...v, consent: c })} error={errors.consent}>
        I agree to be contacted about my request (see{" "}
        <Link href="/privacy" className="underline" target="_blank">
          Privacy Policy
        </Link>
        ).
      </ConsentCheckbox>
      <button type="submit" disabled={status === "submitting"} className="bg-electric flex h-10 w-full items-center justify-center gap-2 rounded-full text-sm font-medium text-white">
        {status === "submitting" ? (
          <>
            <Spinner /> Sending…
          </>
        ) : (
          "Send to the team"
        )}
      </button>
      {status === "error" && <FormStatusMessage status={status} message={message} />}
    </form>
  );
}
