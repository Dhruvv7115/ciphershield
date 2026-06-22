import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import type { UserRole } from "@/types";

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	role: UserRole;
	company?: string;
	phone?: string;
	avatar?: string;
	isVerified: boolean;
	isSuspended: boolean;
	verificationToken?: string;
	verificationTokenExpiry?: Date;
	resetPasswordToken?: string;
	resetPasswordExpiry?: Date;
	lastLogin?: Date;
	createdAt: Date;
	updatedAt: Date;
	comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
	{
		name: { type: String, required: true, trim: true },
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: { type: String, required: true, minlength: 8, select: false },
		role: {
			type: String,
			enum: ["guest", "client", "admin"],
			default: "client",
		},
		company: { type: String, trim: true },
		phone: { type: String, trim: true },
		avatar: { type: String },
		isVerified: { type: Boolean, default: false },
		isSuspended: { type: Boolean, default: false },
		verificationToken: { type: String, select: false },
		verificationTokenExpiry: { type: Date, select: false },
		resetPasswordToken: { type: String, select: false },
		resetPasswordExpiry: { type: Date, select: false },
		lastLogin: { type: Date },
	},
	{ timestamps: true },
);

userSchema.pre("save", async function () {
	if (!this.isModified("password")) return;
	this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (
	candidatePassword: string,
): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
