"use server";

import { connectDB } from "@/lib/db";
import ContactRequest from "@/models/ContactRequest";
import AuditRequest from "@/models/AuditRequest";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { sanitizeInput } from "@/lib/security";
import { initApp } from "@/lib/";

const dbUnavailable = {
  success: false,
  error: "Service temporarily unavailable. Please try again later.",
};

export async function submitContact(formData) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    company: (formData.get("company")) || undefined,
    phone: (formData.get("phone")) || undefined,
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  if (!(await initApp())) return dbUnavailable;

  await ContactRequest.create({
    type: "contact",
    name: sanitizeInput(parsed.data.name),
    email: parsed.data.email,
    company: parsed.data.company ? sanitizeInput(parsed.data.company) : undefined,
    phone: parsed.data.phone,
    subject: sanitizeInput(parsed.data.subject),
    message: sanitizeInput(parsed.data.message),
  });

  return { success: true, message: "Message sent! We'll respond within 24 hours." };
}

export async function submitQuote(formData) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    company: (formData.get("company")) || undefined,
    phone: (formData.get("phone")) || undefined,
    service: formData.get("service"),
    message: formData.get("message"),
  };

  const parsed = quoteSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  if (!(await initApp())) return dbUnavailable;

  await ContactRequest.create({
    type: "quote",
    name: sanitizeInput(parsed.data.name),
    email: parsed.data.email,
    company: parsed.data.company ? sanitizeInput(parsed.data.company) : undefined,
    phone: parsed.data.phone,
    service: parsed.data.service,
    message: sanitizeInput(parsed.data.message),
  });

  return { success: true, message: "Quote request submitted! Our team will contact you shortly." };
}

export async function submitAuditRequest(formData) {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company"),
    website: formData.get("website"),
    phone: (formData.get("phone")) || undefined,
    industry: formData.get("industry"),
    employees: formData.get("employees"),
    currentSecurity: formData.get("currentSecurity"),
    concerns: formData.get("concerns"),
  };

  const parsed = auditSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message };
  }

  if (!(await initApp())) return dbUnavailable;

  await AuditRequest.create({
    name: sanitizeInput(parsed.data.name),
    email: parsed.data.email,
    company: sanitizeInput(parsed.data.company),
    website: parsed.data.website,
    phone: parsed.data.phone,
    industry: sanitizeInput(parsed.data.industry),
    employees: parsed.data.employees,
    currentSecurity: sanitizeInput(parsed.data.currentSecurity),
    concerns: sanitizeInput(parsed.data.concerns),
  });

  await ContactRequest.create({
    type: "audit",
    name: sanitizeInput(parsed.data.name),
    email: parsed.data.email,
    company: sanitizeInput(parsed.data.company),
    message: `Free audit request for ${parsed.data.website}`,
  });

  return { success: true, message: "Audit request submitted! We'll schedule your free assessment soon." };
}

export async function createNotification(
  userId,
  title,
  message,
  type,
  link
) {
  const conn = await connectDB();
  if (!conn) return;
  await Notification.create({ user: userId, title, message, type, link });
}

export async function broadcastNotification(
  title,
  message,
  type
) {
  await initApp();
  const clients = await User.find({ role: "client", isSuspended: false });
  await Notification.insertMany(
    clients.map((u) => ({ user: u._id, title, message, type }))
  );
  return { success: true, count: clients.length };
}