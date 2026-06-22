import mongoose from "mongoose";

async function connectDB() {
	if (mongoose.connection.readyState >= 1) return;
	await mongoose.connect(process.env.MONGODB_URI);
}

export default connectDB;
