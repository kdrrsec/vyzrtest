"use server";

export type ContactFormState = {
  ok: boolean;
  error?: string;
  success?: boolean;
};

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const comment = String(formData.get("comment") ?? "").trim();

  if (!name || !email) {
    return { ok: false, error: "Name and email are required." };
  }
  if (!emailOk(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  if (process.env.NODE_ENV === "development") {
    console.info("[contact]", { name, email, phone: phone || "(none)", commentLen: comment.length });
  }

  // Wire Resend, SendGrid, or a ticket API here.
  return { ok: true, success: true };
}
