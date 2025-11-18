import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface BookingAttrs {
  eventId: Types.ObjectId;
  email: string;
}

export interface BookingDocument extends BookingAttrs, Document {
  createdAt: Date;
  updatedAt: Date;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<BookingDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string): boolean => emailRegex.test(value),
        message: "Invalid email address",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index on eventId optimizes lookups by event.
bookingSchema.index({ eventId: 1 });

// Pre-save hook to validate referenced event and email format.
bookingSchema.pre("save", async function (next) {
  const doc = this as BookingDocument;

  try {
    // Ensure the referenced Event exists before persisting the booking.
    const EventModel = mongoose.model("Event");
    const exists = await EventModel.exists({ _id: doc.eventId });

    if (!exists) {
      return next(new Error("Referenced event does not exist"));
    }

    // Extra safeguard for email formatting at save time.
    if (!emailRegex.test(doc.email)) {
      return next(new Error("Invalid email address"));
    }

    return next();
  } catch (err) {
    return next(err as Error);
  }
});

export type BookingModel = Model<BookingDocument>;

// Reuse existing compiled model in dev/hot-reload environments.
export const Booking: BookingModel =
  (mongoose.models.Booking as BookingModel) ||
  mongoose.model<BookingDocument>("Booking", bookingSchema);
