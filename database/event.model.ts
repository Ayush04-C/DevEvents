import mongoose, { Schema, Document, Model } from "mongoose";

// Supported event delivery modes; allow string extension in schema typing.
export type EventMode = "online" | "offline" | "hybrid" | string;

export interface EventAttrs {
  title: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // stored as normalized ISO date string (YYYY-MM-DD)
  time: string; // stored as normalized 24h time string (HH:MM)
  mode: EventMode;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
}

export interface EventDocument extends EventAttrs, Document {
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<EventDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: { type: [String], required: true, default: [] },
    organizer: { type: String, required: true, trim: true },
    tags: { type: [String], required: true, default: [] },
  },
  {
    timestamps: true,
  }
);

// Unique index on slug to enforce URL uniqueness.
eventSchema.index({ slug: 1 }, { unique: true });

// Generate a URL-friendly slug from a title.
function generateSlug(title: string): string {
  return title
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric chars with dashes
    .replace(/^-+|-+$/g, ""); // remove leading/trailing dashes
}

// Normalize date to ISO date string (YYYY-MM-DD) and validate.
function normalizeDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid event date");
  }
  return date.toISOString().split("T")[0];
}

// Normalize time to 24h format HH:MM and validate.
function normalizeTime(timeStr: string): string {
  const trimmed = timeStr.trim();
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(trimmed);
  if (match) {
    return `${match[1]}:${match[2]}`;
  }

  throw new Error("Invalid event time; expected HH:MM (24h) format");
}

// Pre-save hook for slug generation, date/time normalization, and extra validation.
eventSchema.pre("save", function (next) {
  const doc = this as EventDocument;

  // Ensure required string fields are present and non-empty after trimming.
  const requiredStringFields: (keyof EventAttrs)[] = [
    "title",
    "description",
    "overview",
    "image",
    "venue",
    "location",
    "date",
    "time",
    "mode",
    "audience",
    "organizer",
  ];

  for (const field of requiredStringFields) {
    const value = doc[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      return next(new Error(`Field "${field}" is required and cannot be empty`));
    }
  }

  if (!Array.isArray(doc.agenda) || doc.agenda.length === 0) {
    return next(new Error("Field \"agenda\" is required and cannot be empty"));
  }

  if (!Array.isArray(doc.tags) || doc.tags.length === 0) {
    return next(new Error("Field \"tags\" is required and cannot be empty"));
  }

  // Only regenerate slug when title changes or slug is missing.
  if (doc.isModified("title") || !doc.slug) {
    doc.slug = generateSlug(doc.title);
  }

  try {
    // Normalize date and time to consistent formats for storage and querying.
    doc.date = normalizeDate(doc.date);
    doc.time = normalizeTime(doc.time);
  } catch (err) {
    return next(err as Error);
  }

  return next();
});

export type EventModel = Model<EventDocument>;

// Reuse existing compiled model in dev/hot-reload environments.
export const Event: EventModel =
  (mongoose.models.Event as EventModel) ||
  mongoose.model<EventDocument>("Event", eventSchema);
