import mongoose, { Schema } from "mongoose";

const AuditRequestSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, lowercase: true, trim: true },
		company: { type: String, required: true, trim: true },
		website: { type: String, required: true, trim: true },
		phone: { type: String, trim: true },
		industry: { type: String, required: true },
		employees: { type: String, required: true },
		currentSecurity: { type: String, required: true },
		concerns: { type: String, required: true },
		status: {
			type: String,
			enum: ["new", "in_progress", "resolved"],
			default: "new",
		},
		adminNotes: { type: String },
	},
	{ timestamps: true },
);

const AuditRequest =
	mongoose.models.AuditRequest ||
	mongoose.model("AuditRequest", AuditRequestSchema);

export default AuditRequest;
