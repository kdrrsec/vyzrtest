"use server";

export type NewsletterSignupState = {
  ok: boolean;
  success?: boolean;
  errorKey?: "emailRequired" | "emailInvalid" | "consentRequired";
};

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function submitNewsletterSignup(
  _prev: NewsletterSignupState,
  formData: FormData
): Promise<NewsletterSignupState> {
  const email = String(formData.get("email") ?? "").trim();
  const consent = formData.get("consent") === "on" || formData.get("consent") === "true";

  if (!email) {
    return { ok: false, errorKey: "emailRequired" };
  }
  if (!emailOk(email)) {
    return { ok: false, errorKey: "emailInvalid" };
  }
  if (!consent) {
    return { ok: false, errorKey: "consentRequired" };
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[newsletter signup]", email);
  }

  // Wire Mailchimp, Brevo, Resend list, Klaviyo, etc. here.
  return { ok: true, success: true };
}
