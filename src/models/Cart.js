import mongoose, { Schema, Types } from "mongoose";

const cartItemSchema = new Schema({
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

const cartSchema = new Schema(
	{
		user: {
			type: Types.ObjectId,
			ref: "User",
			required: true,
		},
		items: [cartItemSchema],
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
	},
	{
		timestamps: true,
	},
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

export default Cart;
