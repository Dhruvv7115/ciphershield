"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { signIn, signOut, getSession, useSession } from "next-auth/react";

function AdminLoginContent() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [error, setError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [focused, setFocused] = useState(null);
	const [mounted, setMounted] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm();

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (status === "authenticated" && session?.user?.role === "admin") {
			router.replace("/admin");
		}
	}, [status, session, router]);

	const onSubmit = async (data) => {
		setError("");
		try {
			const res = await signIn("credentials", {
				email: data.email,
				password: data.password,
				redirect: false,
			});

			if (res?.error) {
				setError("Invalid email or password");
				return;
			}

			const newSession = await getSession();
			if (newSession?.user?.role !== "admin") {
				await signOut({ redirect: false });
				setError("This account does not have admin access");
				return;
			}

			router.replace("/admin");
			reset();
		} catch {
			setError("Something went wrong. Please try again.");
		}
	};

	if (status === "loading") {
		return (
			<div style={pageStyle}>
				<div className="admin-login-spinner" />
				<style>{`@keyframes spin { to { transform: rotate(360deg); } } .admin-login-spinner { width: 36px; height: 36px; border: 3px solid rgba(239,68,68,0.2); border-top-color: #EF4444; border-radius: 50%; animation: spin 0.7s linear infinite; }`}</style>
			</div>
		);
	}

	const inputStyle = (field) => ({
		width: "100%",
		padding: "13px 16px",
		borderRadius: 12,
		border: `1px solid ${focused === field ? "rgba(239,68,68,0.5)" : "rgba(51,65,85,0.6)"}`,
		background: focused === field ? "rgba(30,41,59,0.8)" : "rgba(15,23,42,0.5)",
		color: "#E2E8F0",
		fontSize: 14,
		fontFamily: "var(--font-sans)",
		outline: "none",
		transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
		boxShadow: focused === field ? "0 0 0 3px rgba(239,68,68,0.12)" : "none",
		boxSizing: "border-box",
	});

	return (
		<div style={pageStyle}>
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"radial-gradient(ellipse 60% 50% at 50% 0%, rgba(239,68,68,0.08) 0%, transparent 70%)",
					pointerEvents: "none",
				}}
			/>

			<div
				style={{
					width: "100%",
					maxWidth: 420,
					position: "relative",
					zIndex: 1,
					animation: mounted
						? "formIn 0.6s cubic-bezier(0.16,1,0.3,1) both"
						: "none",
				}}
			>
				<div
					style={{
						background: "rgba(15,23,42,0.7)",
						backdropFilter: "blur(24px)",
						border: "1px solid rgba(51,65,85,0.5)",
						borderRadius: 20,
						overflow: "hidden",
						boxShadow:
							"0 32px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
					}}
				>
					<div
						style={{
							height: 3,
							background:
								"linear-gradient(90deg, transparent, #EF4444 30%, #F87171 60%, transparent)",
						}}
					/>

					<div style={{ padding: "36px 36px 28px" }}>
						<Link
							href="/"
							style={{
								display: "flex",
								alignItems: "center",
								gap: 10,
								textDecoration: "none",
								marginBottom: 32,
							}}
						>
							<div style={{ width: 36, height: 36, position: "relative" }}>
								<Image
									src="/aritaro-logo.png"
									alt="Aritaro"
									fill
									sizes="36px"
									style={{ objectFit: "contain" }}
								/>
							</div>
							<span
								style={{
									fontFamily: "var(--font-sans)",
									fontSize: 15,
									fontWeight: 700,
									letterSpacing: "0.06em",
									color: "#E2E8F0",
								}}
							>
								ARITARO
							</span>
						</Link>

						<div
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: 8,
								background: "rgba(239,68,68,0.08)",
								border: "1px solid rgba(239,68,68,0.2)",
								borderRadius: 100,
								padding: "4px 14px",
								marginBottom: 20,
							}}
						>
							<span
								style={{
									width: 6,
									height: 6,
									borderRadius: "50%",
									background: "#F87171",
								}}
							/>
							<span
								style={{
									fontFamily: "var(--font-mono)",
									fontSize: 10,
									letterSpacing: "2px",
									color: "#F87171",
									fontWeight: 600,
								}}
							>
								ADMIN ACCESS
							</span>
						</div>

						<h1
							style={{
								fontFamily: "var(--font-sans)",
								fontSize: 24,
								fontWeight: 800,
								color: "#F1F5F9",
								marginBottom: 6,
							}}
						>
							Admin Sign In
						</h1>
						<p
							style={{
								fontSize: 13,
								color: "#475569",
								marginBottom: 28,
								lineHeight: 1.5,
							}}
						>
							Restricted area — authorized personnel only
						</p>

						{error && (
							<div
								style={{
									background: "rgba(239,68,68,0.1)",
									border: "1px solid rgba(239,68,68,0.3)",
									borderRadius: 10,
									padding: "10px 14px",
									marginBottom: 20,
									fontSize: 13,
									color: "#F87171",
								}}
							>
								{error}
							</div>
						)}

						<form
							onSubmit={handleSubmit(onSubmit)}
							style={{ display: "flex", flexDirection: "column", gap: 18 }}
						>
							<div>
								<label
									style={{
										display: "block",
										fontSize: 12,
										fontWeight: 600,
										color: "#64748B",
										marginBottom: 8,
										letterSpacing: "0.04em",
										textTransform: "uppercase",
									}}
								>
									Email
								</label>
								<input
									type="email"
									placeholder="admin@ciphershield.com"
									{...register("email", { required: "Email is required" })}
									style={inputStyle("email")}
									onFocus={() => setFocused("email")}
									onBlur={() => setFocused(null)}
								/>
								{errors.email && (
									<p style={{ color: "#F87171", fontSize: 12, marginTop: 6 }}>
										{errors.email.message}
									</p>
								)}
							</div>

							<div>
								<label
									style={{
										display: "block",
										fontSize: 12,
										fontWeight: 600,
										color: "#64748B",
										marginBottom: 8,
										letterSpacing: "0.04em",
										textTransform: "uppercase",
									}}
								>
									Password
								</label>
								<div style={{ position: "relative" }}>
									<input
										type={showPassword ? "text" : "password"}
										placeholder="••••••••"
										{...register("password", {
											required: "Password is required",
										})}
										style={{ ...inputStyle("password"), paddingRight: 44 }}
										onFocus={() => setFocused("password")}
										onBlur={() => setFocused(null)}
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										style={{
											position: "absolute",
											right: 12,
											top: "50%",
											transform: "translateY(-50%)",
											background: "none",
											border: "none",
											color: "#64748B",
											cursor: "pointer",
											fontSize: 12,
										}}
									>
										{showPassword ? "Hide" : "Show"}
									</button>
								</div>
								{errors.password && (
									<p style={{ color: "#F87171", fontSize: 12, marginTop: 6 }}>
										{errors.password.message}
									</p>
								)}
							</div>

							<button
								type="submit"
								disabled={isSubmitting}
								style={{
									marginTop: 4,
									padding: "14px 0",
									borderRadius: 12,
									border: "none",
									cursor: isSubmitting ? "not-allowed" : "pointer",
									fontFamily: "var(--font-sans)",
									fontSize: 14,
									fontWeight: 700,
									color: "#FFF",
									background: isSubmitting
										? "rgba(239,68,68,0.5)"
										: "linear-gradient(135deg, #DC2626, #EF4444)",
									boxShadow: "0 4px 20px rgba(239,68,68,0.3)",
									transition: "all 0.2s",
									opacity: isSubmitting ? 0.7 : 1,
								}}
							>
								{isSubmitting ? "Signing in…" : "Sign In to Admin Panel"}
							</button>
						</form>
					</div>

					<div
						style={{
							padding: "16px 36px 20px",
							borderTop: "1px solid rgba(51,65,85,0.3)",
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							background: "rgba(2,6,23,0.3)",
						}}
					>
						<Link
							href="/login"
							style={{
								fontSize: 13,
								color: "#475569",
								textDecoration: "none",
							}}
						>
							← Client login
						</Link>
						<Link
							href="/"
							style={{
								fontSize: 13,
								color: "#334155",
								textDecoration: "none",
							}}
						>
							Home
						</Link>
					</div>
				</div>
			</div>

			<style>{`
        @keyframes formIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
		</div>
	);
}

const pageStyle = {
	minHeight: "100vh",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	background: "#020617",
	padding: "24px",
	position: "relative",
	overflow: "hidden",
};

export default function AdminLoginPage() {
	return (
		<Suspense
			fallback={
				<div style={pageStyle}>
					<div
						style={{
							width: 36,
							height: 36,
							border: "3px solid rgba(239,68,68,0.2)",
							borderTopColor: "#EF4444",
							borderRadius: "50%",
							animation: "spin 0.7s linear infinite",
						}}
					/>
				</div>
			}
		>
			<AdminLoginContent />
		</Suspense>
	);
}
