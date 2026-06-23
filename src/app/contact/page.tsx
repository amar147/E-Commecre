"use client";

import { FormEvent, useState } from "react";
import { Clock3, Headphones, Mail, MapPin, Phone } from "lucide-react";

const contactCards = [
  {
    title: "Phone",
    detail: "+1 (800) 123-4567",
    href: "tel:+18001234567",
    hint: "Mon to Sat, 9:00 AM to 8:00 PM",
    icon: Phone,
  },
  {
    title: "Email",
    detail: "support@freshcart.com",
    href: "mailto:support@freshcart.com",
    hint: "We reply within 24 hours",
    icon: Mail,
  },
  {
    title: "Office",
    detail: "FreshCart HQ, Cairo",
    hint: "Nasr City, Cairo, Egypt",
    icon: MapPin,
  },
  {
    title: "Business Hours",
    detail: "Daily: 9:00 AM to 8:00 PM",
    hint: "Friday support closes at 5:00 PM",
    icon: Clock3,
  },
];

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setIsSubmitted(false);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setFormData({
      fullName: "",
      email: "",
      subject: "",
      message: "",
    });
    setIsLoading(false);
    setIsSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#f7faf8] py-8 sm:py-10">
      <div className="container mx-auto px-4 md:px-6">
        <section className="rounded-3xl bg-linear-to-r from-emerald-600 via-emerald-500 to-lime-500 p-6 text-white shadow-[0_18px_35px_rgba(16,185,129,0.25)] sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-emerald-100">
              FreshCart Support
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-3xl">
              Contact Us
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-emerald-50 sm:text-base">
              Need help with orders, delivery, or returns? Send us a message and
              our support team will get back to you quickly.
            </p>
          </div>
        </section>

        <section className="mt-7 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
          <aside className="space-y-4">
            {contactCards.map((card) => {
              const Icon = card.icon;

              return (
                <article
                  key={card.title}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    {card.href ? (
                      <a
                        href={card.href}
                        aria-label={`${card.title}: ${card.detail}`}
                        className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-colors hover:text-green-600"
                      >
                        <Icon className="size-5" />
                      </a>
                    ) : (
                      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <Icon className="size-5" />
                      </span>
                    )}

                    <div className="min-w-0">
                      <p className="text-xs font-semibold tracking-[0.12em] text-slate-400 uppercase">
                        {card.title}
                      </p>
                      {card.href ? (
                        <a
                          href={card.href}
                          className="mt-1 inline-flex cursor-pointer text-base font-semibold text-slate-900 transition-colors hover:text-green-600"
                        >
                          {card.detail}
                        </a>
                      ) : (
                        <p className="mt-1 text-base font-semibold text-slate-900">
                          {card.detail}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-slate-500">{card.hint}</p>
                    </div>
                  </div>
                </article>
              );
            })}

            <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600">
                  <Headphones className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-emerald-700">
                    Priority Support
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-emerald-700/90">
                    For urgent order issues, mention your order ID in the form
                    so we can route your request faster.
                  </p>
                </div>
              </div>
            </article>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <Headphones className="size-5" />
              </span>
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Send us a Message
                </h2>
                <p className="mt-1 text-xl text-slate-500">
                  Fill out the form and we&apos;ll get back to you
                </p>
              </div>
            </div>

            {isSubmitted ? (
              <div
                role="status"
                aria-live="polite"
                className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800"
              >
                <span className="mt-0.5 inline-flex size-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  ✓
                </span>
                <p className="text-sm font-medium">
                  Message sent successfully! We&apos;ll get back to you as soon
                  as possible.
                </p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        fullName: event.target.value,
                      }))
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((previous) => ({
                        ...previous,
                        email: event.target.value,
                      }))
                    }
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      subject: event.target.value,
                    }))
                  }
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="" disabled>
                    Select a subject
                  </option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Order Support">Order Support</option>
                  <option value="Shipping Question">Shipping Question</option>
                  <option value="Returns & Refunds">Returns & Refunds</option>
                  <option value="Product Information">
                    Product Information
                  </option>
                  <option value="Feedback & Suggestions">
                    Feedback & Suggestions
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      message: event.target.value,
                    }))
                  }
                  rows={6}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex h-12 min-w-42 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-80"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="size-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="opacity-30"
                      />
                      <path
                        d="M21 12a9 9 0 0 0-9-9"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </section>
        </section>
      </div>
    </main>
  );
}
