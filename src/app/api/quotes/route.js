import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { Cart, QuoteRequest, Notification, User } from "@/models";
import { sendEmail, quoteConfirmationEmailHtml } from "@/lib/email";
import mongoose from "mongoose";

export async function GET(request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}

		await connectDB();

		const quotes = await QuoteRequest.find({ user: session.user.id })
			.populate("items.serviceId")
			.sort({ createdAt: -1 });

		const mappedQuotes = quotes.map((quote) => ({
			id: quote._id.toString(),
			totalPrice: quote.totalPrice,
			discount: quote.discount,
			couponCode: quote.couponCode,
			status: quote.status,
			notes: quote.notes,
			createdAt: quote.createdAt,
			items: quote.items.map((item) => {
				const serviceDoc = item.serviceId;
				return {
					title: serviceDoc?.name || "Deleted Service",
					slug: serviceDoc?.slug || "",
					pricePerMonth: item.pricePerMonth,
					months: item.months,
					totalCost: item.totalCost,
				};
			}),
		}));

		return Response.json({ quotes: mappedQuotes });
	} catch (error) {
		console.error("Error fetching quotes:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}

export async function POST(request) {
	let quoteRequest = null;
	try {
		const session = await getServerSession(authOptions);
		if (!session || !session.user) {
			return Response.json({ message: "Unauthorized" }, { status: 401 });
		}

		const { notes } = await request.json().catch(() => ({ notes: "" }));

		await connectDB();

		// Find user's cart and populate service details
		const cartDoc = await Cart.findOne({ user: session.user.id }).populate("items.serviceId");
		if (!cartDoc || cartDoc.items.length === 0) {
			return Response.json({ message: "Cart is empty" }, { status: 400 });
		}

		// 1. Create quote
		quoteRequest = await QuoteRequest.create({
			user: session.user.id,
			items: cartDoc.items.map((item) => ({
				serviceId: item.serviceId._id,
				pricePerMonth: item.pricePerMonth,
				months: item.months,
				totalCost: item.totalCost,
			})),
			totalPrice: cartDoc.totalPrice,
			discount: cartDoc.discount || 0,
			couponCode: cartDoc.couponCode || "",
			status: "pending",
			notes: notes || "",
		});

		// 2. Send confirmation email
		const userDoc = await User.findById(session.user.id);
		if (userDoc) {
			const emailItems = cartDoc.items.map((item) => ({
				title: item.serviceId?.name || "Service",
				months: item.months,
				totalCost: item.totalCost,
			}));

			const emailHtml = quoteConfirmationEmailHtml(
				userDoc.name,
				quoteRequest._id.toString(),
				emailItems,
				quoteRequest.totalPrice,
			);

			await sendEmail({
				to: userDoc.email,
				subject: "Quote Request Confirmed — CipherShield",
				html: emailHtml,
			}).catch((err) => console.error("Failed to send quote confirmation email:", err));
		}

		// 3. Clear cart
		const cart = await Cart.findOne({ user: session.user.id });
		if (cart) {
			cart.items = [];
			cart.totalPrice = 0;
			cart.discount = 0;
			cart.couponCode = "";
			await cart.save();
		}

		// 4. Create notification
		const notification = await Notification.create({
			user: session.user.id,
			title: "Quote requested successfully",
			message: `Your quote request has been submitted. Quote ID: ${quoteRequest._id}`,
			type: "success",
			isRead: false,
		});

		return Response.json({
			message: "Quote requested successfully",
			quoteId: quoteRequest._id.toString(),
			notification,
		});
	} catch (error) {
		if (quoteRequest?._id) {
			await QuoteRequest.findByIdAndDelete(quoteRequest._id).catch(() => {});
		}
		console.error("Error creating quote request:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}
