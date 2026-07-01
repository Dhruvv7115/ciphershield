import mongoose, { Schema, Types } from "mongoose";

const quoteItemSchema = new Schema({
	serviceId: {
		type: Types.ObjectId,
		ref: "Service",
		required: true,
	},
	pricePerMonth: {
		type: Number,
		required: true,
	},
	months: {
		type: Number,
		required: true,
		default: 1,
	},
	totalCost: {
		type: Number,
		required: true,
		validate: {
			validator: function (value) {
				return value === this.months * this.pricePerMonth;
			},
			message: "Total cost is not equal to months * price per month",
		},
	},
});

const quoteRequestSchema = new Schema(
	{
		user: {
			type: Types.ObjectId,
			ref: "User",
			required: true,
		},
		items: [quoteItemSchema],
		totalPrice: {
			type: Number,
			required: true,
			validate: {
				validator: function (value) {
					const discount = this.discount ?? 0;
					const itemsTotal = this.items.reduce(
						(acc, item) => acc + item.totalCost,
						0,
					);
					return value === itemsTotal - discount;
				},
				message:
					"Total price is not equal to sum of total costs minus discount",
			},
		},
		discount: {
			type: Number,
			required: false,
			default: 0,
		},
		couponCode: {
			type: String,
			required: false,
			default: "",
		},
		status: {
			type: String,
			enum: ["pending", "approved", "declined", "contracted"],
			default: "pending",
		},
		notes: {
			type: String,
			required: false,
			default: "",
		},
		adminNotes: {
			type: String,
			required: false,
			default: "",
		},
	},
	{
		timestamps: true,
	},
);

const QuoteRequest =
	mongoose.models.QuoteRequest ||
	mongoose.model("QuoteRequest", quoteRequestSchema);

export default QuoteRequest;
