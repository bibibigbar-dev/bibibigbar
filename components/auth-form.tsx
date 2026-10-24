"use client";

import { useFormState, useFormStatus } from "react-dom";

interface AuthFormProps {
  action: (previous: { error?: string }, formData: FormData) => Promise<{ error?: string }>;
  title: string;
  subtitle: string;
  submitLabel: string;
  includeName?: boolean;
  nextPath?: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="btn btn-primary mt-2 w-full" disabled={pending}>
      {pending ? "Please wait…" : label}
    </button>
  );
}

export function AuthForm({
  action,
  title,
  subtitle,
  submitLabel,
  includeName = false,
  nextPath = "",
}: AuthFormProps) {
  const [state, formAction] = useFormState(action, {});

  return (
    <div className="container py-14">
      <div className="mx-auto max-w-md surface animate-rise rounded-[2rem] p-8 shadow-[var(--shadow)]">
        <p className="display text-3xl font-bold text-[var(--sky-deep)]">{title}</p>
        <p className="mt-2 text-sm text-[var(--muted)]">{subtitle}</p>
        {state.error ? (
          <p className="mt-4 rounded-2xl bg-[rgba(180,35,24,0.08)] px-4 py-3 text-sm text-[#b42318]">
            {state.error}
          </p>
        ) : null}
        <form action={formAction} className="mt-6 grid gap-4">
          {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
          {includeName ? (
            <label className="field">
              <span>Name</span>
              <input name="name" required placeholder="Your name" />
            </label>
          ) : null}
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" required placeholder="you@email.com" />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
            />
          </label>
          <SubmitButton label={submitLabel} />
        </form>
      </div>
    </div>
  );
}
