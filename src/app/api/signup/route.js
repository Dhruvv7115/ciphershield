// api/signup
import User from "@/models/User";
import connectDB from "@/lib/db";

export async function POST(request) {
	try {
		await connectDB();
		const { name, email, password } = await request.json();

		if (!name.trim() || !email.trim() || !password.trim()) {
			return new Response("Missing required fields", { status: 400 });
		}

		const user = await User.findOne({ email });
		if (user) {
			return new Response("User already exists", { status: 400 });
		}

		const newUser = new User({ name, email, password });
		await newUser.save();

		return Response.json(
			{ message: "User created successfully", user: newUser },
			{ status: 201 },
		);
	} catch (error) {
		console.error("Error creating user:", error);
		return Response.json({ message: "Internal Server Error" }, { status: 500 });
	}
}
