"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useFormState, useFormStatus } from "react-dom";
import {
  submitNewsletterSignup,
  type NewsletterSignupState,
} from "@/app/actions/newsletterSignup";

const initial: NewsletterSignupState = { ok: true };

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-accent px-10 py-3 text-xs font-semibold uppercase tracking-[0.2em] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export function NewsletterSignup() {
  const t = useTranslations("ComingSoon");
  const [state, formAction] = useFormState(submitNewsletterSignup, initial);

  if (state.success) {
    return (
      <div className="w-full rounded-2xl border border-white/25 bg-white/[0.03] px-8 py-14 backdrop-blur-sm">
        <p className="text-center text-2xl font-semibold tracking-tight text-white md:text-3xl">
          {t("thanksTitle")}
        </p>
        <p className="mt-4 text-center text-sm text-muted">{t("thanksBody")}</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-white/25 bg-white/[0.03] px-8 py-10 backdrop-blur-sm md:px-10 md:py-12">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-white md:text-3xl">
        {t("formTitle")}
      </h2>
      <p className="mt-3 text-center text-sm text-muted">{t("formHint")}</p>

      <form action={formAction} className="mt-10 space-y-4">
        <FieldGroup htmlFor="newsletter-email" label={t("email")}>
          <input
            id="newsletter-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full border-0 bg-transparent py-1 text-sm text-white caret-white outline-none ring-0 placeholder:text-muted focus:ring-0"
          />
        </FieldGroup>

        <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
          <input
            name="consent"
            type="checkbox"
            value="true"
            required
            className="mt-1 h-4 w-4 shrink-0 rounded border-white/30 bg-black accent-accent"
          />
          <span>{t("consent")}</span>
        </label>

        {state.errorKey ? (
          <p className="text-sm text-accent" role="alert">
            {state.errorKey === "emailRequired"
              ? t("errors.emailRequired")
              : state.errorKey === "emailInvalid"
                ? t("errors.emailInvalid")
                : t("errors.consentRequired")}
          </p>
        ) : null}

        <div className="flex justify-start pt-2">
          <SubmitButton label={t("submit")} pendingLabel={t("sending")} />
        </div>
      </form>
    </div>
  );
}

function FieldGroup({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="relative border border-white/20 bg-black px-3 pb-2 pt-7 transition-colors focus-within:border-accent/55">
      <label
        htmlFor={htmlFor}
        className="absolute left-3 top-2 cursor-text font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-white"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
