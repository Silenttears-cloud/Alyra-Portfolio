import { motion } from "motion/react";
import { useState } from "react";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { useSectionInView } from "@/lib/useSectionInView";
import { SectionHeader } from "./Modules";
import { Magnetic } from "@/ui/Magnetic";

const EMAIL = "ayushi29507@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/ayushi-raj-299a99388/";
const GITHUB = "https://github.com/Silenttears-cloud";
const INSTAGRAM = "https://www.instagram.com/Silenttears_82";

const SOCIALS = [
  { label: "LinkedIn", href: LINKEDIN, icon: Linkedin },
  { label: "GitHub", href: GITHUB, icon: Github },
  { label: "Instagram", href: INSTAGRAM, icon: Instagram },
  { label: "Email", href: `mailto:${EMAIL}`, icon: Mail },
];

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Please enter a valid email").max(120),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(2000),
});

export function Transmission() {
  const ref = useSectionInView("transmission");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [sending, setSending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Partial<Record<keyof typeof form, string>> = {};
      for (const issue of parsed.error.issues) {
        const k = issue.path[0] as keyof typeof form;
        if (!errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      toast.error("Please fix the highlighted fields.");
      return;
    }
    setErrors({});
    setSending(true);
    const subject = encodeURIComponent(`Portfolio inquiry — ${parsed.data.name}`);
    const body = encodeURIComponent(`${parsed.data.message}\n\n— ${parsed.data.name}\n${parsed.data.email}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    toast.success("Opening your email client…");
    setTimeout(() => setSending(false), 800);
  };

  return (
    <section
      id="transmission"
      ref={ref as React.RefObject<HTMLElement>}
      className="relative min-h-screen px-5 py-24 sm:px-8 md:px-16"
    >
      <div className="mx-auto max-w-5xl">
        <SectionHeader
          eyebrow="05 · Contact"
          title="Let's Build Together"
          caption="Open to internships, collaborations, and interesting problems."
        />

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-6">
            <ContactRow k="Email" v={EMAIL} href={`mailto:${EMAIL}`} />
            <ContactRow k="LinkedIn" v="ayushi-raj-299a99388" href={LINKEDIN} />
            <ContactRow k="GitHub" v="Silenttears-cloud" href={GITHUB} />
            <ContactRow k="Instagram" v="Silenttears_82" href={INSTAGRAM} />
            <ContactRow k="Location" v="Nawada, Bihar · India" />

            <div className="flex items-center gap-3 pt-2" aria-label="Social links">
              {SOCIALS.map((s) => (
                <Magnetic key={s.label} label={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    aria-label={s.label}
                    className="scan-hover flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/60 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    <s.icon size={18} strokeWidth={1.5} />
                  </a>
                </Magnetic>
              ))}
            </div>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The fastest way to reach me is email. I typically reply within a
              day.
            </p>
          </div>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="glass-panel flex flex-col gap-4 p-6 md:p-8"
            noValidate
          >
            <Field label="Name" error={errors.name}>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground"
                placeholder="Your name"
              />
            </Field>
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground"
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Message" error={errors.message}>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="w-full resize-none border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground"
                placeholder="What are you working on?"
              />
            </Field>

            <div className="mt-2">
              <Magnetic label="SEND">
                <button
                  type="submit"
                  disabled={sending}
                  className="scan-hover inline-flex items-center gap-3 rounded-full border border-foreground bg-foreground px-6 py-3 text-[12px] font-medium tracking-wide text-background disabled:opacity-60"
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--pink)" }} />
                  {sending ? "Sending…" : "Send Message"}
                </button>
              </Magnetic>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="hud-label">{label}</span>
      {children}
      {error && (
        <span className="mt-1 text-[11px]" style={{ color: "var(--pink)" }}>
          {error}
        </span>
      )}
    </label>
  );
}

function ContactRow({ k, v, href }: { k: string; v: string; href?: string }) {
  const inner = (
    <div className="group flex items-baseline justify-between border-b border-border py-3">
      <span className="hud-label">{k}</span>
      <span className="text-sm font-medium transition-colors group-hover:text-foreground" style={{ color: "var(--foreground)" }}>
        {v} {href && <span className="text-muted-foreground">↗</span>}
      </span>
    </div>
  );
  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
        {inner}
      </a>
    );
  }
  return inner;
}
