"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { budgetOptions, industryOptions } from "@/content/site";
import { contactSchema, serviceInterestOptions, type ContactInput } from "@/lib/validation";
import { Button } from "@/components/ui/Button";
import { ConsentCheckbox, Field, FormStatusMessage, Honeypot, Select, Spinner, TextArea, TextInput } from "./fields";
import { Turnstile } from "./Turnstile";
import { useFormSubmit } from "./useFormSubmit";

type Values = {
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  country: string;
  industry: string;
  service: string;
  budget: string;
  message: string;
  consent: boolean;
};

export function ContactForm({ defaultService = "", defaultIndustry = "" }: { defaultService?: string; defaultIndustry?: string }) {
  const initial: Values = {
    fullName: "",
    businessName: "",
    email: "",
    phone: "",
    country: "",
    industry: (industryOptions as readonly string[]).includes(defaultIndustry) ? defaultIndustry : "",
    service: (serviceInterestOptions as readonly string[]).includes(defaultService) ? defaultService : "",
    budget: "",
    message: "",
    consent: false,
  };
  const [values, setValues] = useState<Values>(initial);
  const [honeypot, setHoneypot] = useState("");
  const { status, message, errors, setErrors, submit, reset, setTurnstileToken } = useFormSubmit("/api/contact", contactSchema);

  const set = <K extends keyof Values>(key: K, v: Values[K]) => {
    setValues((prev) => ({ ...prev, [key]: v }));
    if (errors[key]) setErrors({ ...errors, [key]: "" });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...values,
      phone: values.phone || undefined,
      country: values.country || undefined,
      budget: values.budget || undefined,
    } as unknown as ContactInput;
    const ok = await submit(payload, honeypot);
    if (ok) setValues(initial);
  };

  if (status === "success") {
    return (
      <div className="space-y-6">
        <FormStatusMessage status={status} message={message} />
        <p className="text-sm text-muted">
          A member of our team will review your enquiry and reply to the email you provided. If you’d like to add anything, you can send another message.
        </p>
        <Button variant="secondary" onClick={reset}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-5 sm:grid-cols-2" aria-describedby="contact-form-note">
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <Field id="fullName" label="Full name" error={errors.fullName}>
        <TextInput id="fullName" autoComplete="name" required value={values.fullName} onChange={(e) => set("fullName", e.target.value)} error={errors.fullName} />
      </Field>
      <Field id="businessName" label="Business name" error={errors.businessName}>
        <TextInput
          id="businessName"
          autoComplete="organization"
          required
          value={values.businessName}
          onChange={(e) => set("businessName", e.target.value)}
          error={errors.businessName}
        />
      </Field>
      <Field id="email" label="Work email" error={errors.email}>
        <TextInput id="email" type="email" autoComplete="email" required value={values.email} onChange={(e) => set("email", e.target.value)} error={errors.email} />
      </Field>
      <Field id="phone" label="Phone number" optional error={errors.phone}>
        <TextInput id="phone" type="tel" autoComplete="tel" value={values.phone} onChange={(e) => set("phone", e.target.value)} error={errors.phone} />
      </Field>
      <Field id="industry" label="Industry" error={errors.industry}>
        <Select id="industry" required options={industryOptions} placeholder="Select your industry" value={values.industry} onChange={(e) => set("industry", e.target.value)} error={errors.industry} />
      </Field>
      <Field id="country" label="Country / region" optional error={errors.country}>
        <TextInput id="country" autoComplete="country-name" value={values.country} onChange={(e) => set("country", e.target.value)} error={errors.country} />
      </Field>
      <Field id="service" label="Service of interest" error={errors.service}>
        <Select
          id="service"
          required
          options={serviceInterestOptions}
          placeholder="Select a service"
          value={values.service}
          onChange={(e) => set("service", e.target.value)}
          error={errors.service}
        />
      </Field>
      <Field id="budget" label="Approximate project budget" optional error={errors.budget}>
        <Select id="budget" options={budgetOptions} placeholder="Select a range" value={values.budget} onChange={(e) => set("budget", e.target.value)} error={errors.budget} />
      </Field>
      <Field id="message" label="Business challenge / project description" error={errors.message} hint="What would you like to improve, and what does success look like?" className="sm:col-span-2">
        <TextArea
          id="message"
          required
          rows={6}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          error={errors.message}
          hint="What would you like to improve, and what does success look like?"
        />
      </Field>
      <div className="sm:col-span-2">
        <ConsentCheckbox id="consent" checked={values.consent} onChange={(v) => set("consent", v)} error={errors.consent} />
      </div>
      <div className="sm:col-span-2">
        <Turnstile onToken={setTurnstileToken} />
      </div>
      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p id="contact-form-note" className="text-xs text-muted">
          We typically reply within one to two business days. Your details are never sold or shared for marketing.
        </p>
        <Button type="submit" size="lg" disabled={status === "submitting"} className="shrink-0">
          {status === "submitting" ? (
            <>
              <Spinner /> Sending…
            </>
          ) : (
            <>
              Start Your Transformation <Send aria-hidden className="size-4" />
            </>
          )}
        </Button>
      </div>
      <div className="sm:col-span-2">
        <FormStatusMessage status={status} message={message} />
      </div>
    </form>
  );
}
