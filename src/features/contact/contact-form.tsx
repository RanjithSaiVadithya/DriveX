"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { contactSchema, type ContactInput } from "@/schemas/contact.schema";
import { contactApi } from "@/services/api/contact.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { isAppError } from "@/services/domain/errors";
import { useState } from "react";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactInput) {
    setSubmitting(true);
    try {
      await contactApi.submit(values);
      toast.success("Message sent");
      form.reset();
    } catch (error) {
      form.setError("root", {
        message: isAppError(error) ? error.message : "Something went wrong",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      {(
        [
          ["name", "Name", "text"],
          ["email", "Email", "email"],
          ["phone", "Phone", "tel"],
          ["subject", "Subject", "text"],
        ] as const
      ).map(([key, label, type]) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{label}</Label>
          <Input id={key} type={type} className="h-11" {...form.register(key)} />
          {form.formState.errors[key] ? (
            <p className="text-sm text-destructive">
              {form.formState.errors[key]?.message}
            </p>
          ) : null}
        </div>
      ))}
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={5} {...form.register("message")} />
        {form.formState.errors.message ? (
          <p className="text-sm text-destructive">
            {form.formState.errors.message.message}
          </p>
        ) : null}
      </div>
      {form.formState.errors.root ? (
        <p className="text-sm text-destructive" role="alert">
          {form.formState.errors.root.message}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting}>
        {submitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
