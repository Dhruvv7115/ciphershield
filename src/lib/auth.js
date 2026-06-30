// src/lib/auth.ts
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/User";
import connectDB from "@/lib/db";

export const authOptions = {
	session: {
		strategy: "jwt",
	},

	pages: {
		signIn: "/login",
		error: "/login",
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
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Email and password required");
				}

				try {
					await connectDB();

					const user = await User.findOne({
						email: credentials.email,
					}).select("+password");

					if (!user || !user.password) {
						throw new Error("No account found with this email");
					}

					const isValid = await user.comparePassword(credentials.password);

					if (!isValid) {
						throw new Error("Incorrect password");
					}

					if (user.isSuspended) {
						throw new Error("Your account has been suspended");
					}

					await User.updateOne(
						{ _id: user._id },
						{ $set: { lastLogin: new Date() } },
					);

					return {
						id: user._id.toString(),
						name: user.name,
						email: user.email,
						role: user.role,
						avatar: user.avatar,
						isVerified: user.isVerified,
					};
				} catch (e) {
					throw new Error(e.message); // re-throw so NextAuth surfaces the error
				}
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
		async jwt({ token, user, account }) {
			if (user) {
				if (account?.provider === "credentials") {
					token.id = user.id;
					token.name = user.name;
					token.avatar = user.avatar;
					token.role = user.role;
					token.isVerified = user.isVerified;
				} else {
					await connectDB();

					await User.updateOne(
						{ email: user.email || "" },
						{
							$set: {
								avatar: user.avatar,
							},
						},
						{ upsert: true },
					);

					const dbUser = await User.findOne({ email: user.email });

					token.id = dbUser?._id?.toString() || user.id;
					token.name = dbUser?.name || user.name;
					token.avatar = dbUser?.avatar || user.avatar;
					token.role = dbUser?.role || user.role;
					token.isVerified = dbUser?.isVerified ?? user.isVerified;
				}
			}
			return token;
		},

		// Expose token data on the session object (accessible via useSession)
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id ?? token.sub;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.avatar = token.avatar;
				session.user.role = token.role;
				session.user.isVerified = token.isVerified;
			}
			return session;
		},
		
		async redirect({ url, baseUrl, token }) {
			// after login, redirect admins to /admin, others to /
			if (url.startsWith(baseUrl)) return url;
			return baseUrl;
		},
	},
};
