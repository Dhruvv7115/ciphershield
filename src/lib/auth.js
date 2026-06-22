// src/lib/auth.ts
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import connectDB from "@/lib/db";

export const authOptions = {
	// Use JWT strategy because we're using CredentialsProvider
	// (Credentials doesn't work with database sessions)
	session: {
		strategy: "jwt",
	},

	// Point NextAuth to your custom pages — it won't use its default UI
	pages: {
		signIn: "/login",
		error: "/login", // errors redirect back to signin with ?error=
	},

	providers: [
		// ─── Email + Password ──────────────────────────────────────────
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				await connectDB();
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Email and password required");
				}

				const user = await User.findOne({ email: credentials.email }).select(
					"+password",
				);

				if (!user || !user.password) {
					throw new Error("No account found with this email");
				}

				const isValid = await user.comparePassword(credentials.password);

				if (!isValid) {
					throw new Error("Incorrect password");
				}

				return {
					id: user.id,
					email: user.email,
					name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
					image: user.avatar,
				};
			},
		}),

		// ─── Google OAuth ──────────────────────────────────────────────
		// GoogleProvider({
		// 	clientId: process.env.GOOGLE_CLIENT_ID!,
		// 	clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		// 	profile(profile) {
		// 		return {
		// 			id: profile.sub,
		// 			firstName: profile.given_name,
		// 			lastName: profile.family_name,
		// 			email: profile.email,
		// 			avatar: profile.picture,
		// 			name: profile.name,
		// 			emailVerified: profile.email_verified ? new Date() : undefined,
		// 		};
		// 	},
		// }),

		// // ─── GitHub OAuth ──────────────────────────────────────────────
		// GithubProvider({
		// 	clientId: process.env.GITHUB_CLIENT_ID!,
		// 	clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		// 	profile(profile) {
		// 		const [firstName, ...rest] = (profile.name ?? profile.login).split(" ");
		// 		return {
		// 			id: String(profile.id),
		// 			firstName,
		// 			lastName: rest.join(" ") || null,
		// 			email: profile.email,
		// 			avatar: profile.avatar_url,
		// 			name: profile.name ?? profile.login,
		// 			emailVerified: profile.verified ? new Date() : undefined,
		// 		};
		// 	},
		// }),
	],

	callbacks: {
		// Save user to database and attach data to JWT token
		async jwt({ token, user }) {
			if (user) {
				await connectDB();

				await User.updateOne(
					{ email: user.email || "" },
					{
						$set: {
							avatar: user.image,
						},
					},
					{ upsert: true },
				);

				const dbUser = await User.findOne({ email: user.email });

				token.id = dbUser._id.toString();
				token.name = dbUser.name;
				token.avatar = dbUser.avatar;
			}
			return token;
		},

		// Expose token data on the session object (accessible via useSession)
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.avatar = token.avatar;
			}
			return session;
		},
	},
};
