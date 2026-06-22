import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
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

userSchema.methods.comparePassword = async function (candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
