"use server";

import User from "@/models/User";
import ContactRequest from "@/models/ContactRequest";
import AuditRequest from "@/models/AuditRequest";
import { requireAdmin } from "@/lib/session";
import { initApp } from "@/lib/init";
import { sanitizeInput } from "@/lib/security";

const dbUnavailable = {
	success: false,
	error: "Service temporarily unavailable. Please try again later.",
};

export async function getAdminStats() {
	const { authorized } = await requireAdmin();
	console.log(authorized);
	if (!authorized) {
		return { success: false, error: "Unauthorized" };
	}

	if (!(await initApp())) return dbUnavailable;

	const [adminCount, clientCount, contactCount, auditCount] = await Promise.all(
		[
			User.countDocuments({ role: "admin" }),
			User.countDocuments({ role: "client" }),
			ContactRequest.countDocuments(),
			AuditRequest.countDocuments(),
		],
	);

	return {
		success: true,
		stats: { adminCount, clientCount, contactCount, auditCount },
	};
}

export async function listAdmins() {
	const { authorized } = await requireAdmin();
	if (!authorized) {
		return { success: false, error: "Unauthorized" };
	}

	if (!(await initApp())) return dbUnavailable;

	const admins = await User.find({ role: "admin" })
		.select("name email isVerified isSuspended createdAt lastLogin")
		.sort({ createdAt: 1 })
		.lean();

	return {
		success: true,
		admins: admins.map((admin) => ({
			id: admin._id.toString(),
			name: admin.name,
			email: admin.email,
			isVerified: admin.isVerified,
			isSuspended: admin.isSuspended,
			createdAt: admin.createdAt?.toISOString() ?? null,
			lastLogin: admin.lastLogin?.toISOString() ?? null,
		})),
	};
}

export async function createAdmin(formData) {
	const { authorized, session } = await requireAdmin();
	if (!authorized) {
		return { success: false, error: "Unauthorized" };
	}

	const name = sanitizeInput(String(formData.get("name") || "").trim());
	const email = String(formData.get("email") || "")
		.trim()
		.toLowerCase();
	const password = String(formData.get("password") || "");

	if (!name || !email || !password) {
		return { success: false, error: "All fields are required" };
	}

	if (password.length < 8) {
		return {
			success: false,
			error: "Password must be at least 8 characters",
		};
	}

	if (!(await initApp())) return dbUnavailable;

	const existing = await User.findOne({ email });
	if (existing) {
		if (existing.role === "admin") {
			return { success: false, error: "This user is already an admin" };
		}
		existing.role = "admin";
		existing.isVerified = true;
		if (name) existing.name = name;
		if (password) existing.password = password;
		await existing.save();
		return {
			success: true,
			message: `${existing.email} has been promoted to admin`,
		};
	}
	console.log("creating admin...");

	const admin = await User.create({
		name,
		email,
		password,
		role: "admin",
		isVerified: true,
	})
		.select("name email isVerified isSuspended createdAt lastLogin")
		.lean();

	return {
		success: true,
		message: `Admin account created for ${email}`,
		admin,
	};
}

export async function removeAdmin(adminId) {
	const { authorized, session } = await requireAdmin();
	if (!authorized) {
		return { success: false, error: "Unauthorized" };
	}

	if (!adminId) {
		return { success: false, error: "Admin ID is required" };
	}

	if (adminId === session.user.id) {
		return { success: false, error: "You cannot remove your own admin access" };
	}

	if (!(await initApp())) return dbUnavailable;

	const adminCount = await User.countDocuments({ role: "admin" });
	if (adminCount <= 1) {
		return {
			success: false,
			error: "Cannot remove the last admin account",
		};
	}

	const user = await User.findOne({ _id: adminId, role: "admin" });
	if (!user) {
		return { success: false, error: "Admin not found" };
	}

	user.role = "client";
	await user.save();

	return {
		success: true,
		message: `${user.email} has been removed from admin access`,
	};
}
