"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import {
	getAdminStats,
	listAdmins,
	createAdmin,
	removeAdmin,
} from "@/actions/admin.actions";

function formatDate(iso) {
	if (!iso) return "Never";
	return new Date(iso).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export default function AdminClient() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const user = session?.user;

	const [userDetails, setUserDetails] = useState(undefined);
	const [stats, setStats] = useState(null);
	const [admins, setAdmins] = useState([]);
	const [loading, setLoading] = useState(true);
	const [message, setMessage] = useState({ type: "", text: "" });
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("overview");

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.replace("/admin/login");
		} else if (status === "authenticated" && user?.role !== "admin") {
			router.replace("/dashboard");
		}
	}, [status, user, router]);

	useEffect(() => {
		console.log(user);
	  console.log(JSON.stringify(user, null, 2));
		if (user?.role !== "admin") return;
		setUserDetails(user);
		loadData();
	}, [user]);

	async function loadData() {
		setLoading(true);
		const [statsRes, adminsRes] = await Promise.all([
			getAdminStats(),
			listAdmins(),
		]);
		if (statsRes.success) setStats(statsRes.stats);
		if (adminsRes.success) setAdmins(adminsRes.admins);
		console.log(statsRes.success);
		setLoading(false);
	}

	async function onAddAdmin(data) {
		setMessage({ type: "", text: "" });
		const formData = new FormData();
		formData.set("name", data.name);
		formData.set("email", data.email);
		formData.set("password", data.password);

		const result = await createAdmin(formData);
		console.log(result)
		if (result.success) {
			setMessage({ type: "success", text: result.message });
			reset();
			await loadData();
		} else {
			setMessage({ type: "error", text: result.error });
		}
	}

	async function onRemoveAdmin(adminId) {
		if (!confirm("Remove admin access for this user?")) return;
		setMessage({ type: "", text: "" });
		const result = await removeAdmin(adminId);
		if (result.success) {
			setMessage({ type: "success", text: result.message });
			await loadData();
		} else {
			setMessage({ type: "error", text: result.error });
		}
	}

	if (status === "loading" || !user || user.role !== "admin") {
		return (
			<div
				style={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: "#020617",
				}}
			>
				<div
					style={{
						width: 36,
						height: 36,
						border: "3px solid rgba(99,102,241,0.2)",
						borderTopColor: "#6366F1",
						borderRadius: "50%",
						animation: "spin 0.7s linear infinite",
					}}
				/>
				<style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
			</div>
		);
	}

	const statCards = [
		{
			label: "Admins",
			value: stats?.adminCount ?? "—",
			color: "#818CF8",
			bg: "rgba(99,102,241,0.12)",
		},
		{
			label: "Clients",
			value: stats?.clientCount ?? "—",
			color: "#4ADE80",
			bg: "rgba(74,222,128,0.12)",
		},
		{
			label: "Contact Requests",
			value: stats?.contactCount ?? "—",
			color: "#22D3EE",
			bg: "rgba(34,211,238,0.12)",
		},
		{
			label: "Audit Requests",
			value: stats?.auditCount ?? "—",
			color: "#FBBF24",
			bg: "rgba(251,191,36,0.12)",
		},
	];

	return (
		<div className="dash-layout">
			{/* <button
				className="dash-mobile-toggle"
				onClick={() => setSidebarOpen(!sidebarOpen)}
				aria-label="Toggle menu"
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
					<path d="M3 12h18M3 6h18M3 18h18" />
				</svg>
			</button> */}

			<aside className={`dash-sidebar ${sidebarOpen ? "open" : ""}`}>
				<Link href="/" className="dash-sidebar-logo">
					<div style={{ width: 32, height: 32, position: "relative" }}>
						<Image
							src="/aritaro-logo.png"
							alt="Aritaro"
							fill
							sizes="32px"
							style={{ objectFit: "contain" }}
							priority
						/>
					</div>
					<span>ARITARO</span>
				</Link>

				<div className="dash-nav-section">
					<div className="dash-nav-label">Admin</div>
					<button
						type="button"
						className={`dash-nav-item ${activeTab === "overview" ? "active" : ""}`}
						onClick={() => {
							setActiveTab("overview");
							setSidebarOpen(false);
						}}
						style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
					>
						Overview
					</button>
					<button
						type="button"
						className={`dash-nav-item ${activeTab === "admins" ? "active" : ""}`}
						onClick={() => {
							setActiveTab("admins");
							setSidebarOpen(false);
						}}
						style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
					>
						Manage Admins
					</button>
				</div>

				<div className="dash-sidebar-footer">
					<div className="dash-user-card">
						<div className="dash-avatar">
							{userDetails?.name?.charAt(0)?.toUpperCase() || "A"}
						</div>
						<div className="dash-user-info">
							<div className="dash-user-name">{userDetails?.name || user.name || "Admin"}</div>
							<div className="dash-user-email">{userDetails?.email}</div>
						</div>
					</div>
				</div>
			</aside>

			<main className="dash-main">
				<div className="dash-main-bg" />
				<div className="dash-content">
					<div className="dash-header dash-animate dash-animate-1">
						<div className="dash-header-left">
							<div
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: 8,
									background: "rgba(239,68,68,0.08)",
									border: "1px solid rgba(239,68,68,0.2)",
									borderRadius: 100,
									padding: "4px 14px",
									marginBottom: 12,
								}}
							>
								<span
									style={{
										width: 6,
										height: 6,
										borderRadius: "50%",
										background: "#F87171",
										boxShadow: "0 0 8px rgba(248,113,113,0.7)",
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
									ADMIN PANEL
								</span>
							</div>
							<h1>
								Admin <span className="grad-indigo">Dashboard</span>
							</h1>
							<p>Manage platform access and monitor activity</p>
						</div>
						<div className="dash-header-actions">
							<button
								onClick={() => signOut({ callbackUrl: "/admin/login" })}
								className="dash-btn-danger"
							>
								Logout
							</button>
						</div>
					</div>

					{message.text && (
						<div
							className="dash-animate dash-animate-2"
							style={{
								padding: "12px 16px",
								borderRadius: 12,
								marginBottom: 20,
								background:
									message.type === "success"
										? "rgba(74,222,128,0.1)"
										: "rgba(239,68,68,0.1)",
								border: `1px solid ${
									message.type === "success"
										? "rgba(74,222,128,0.3)"
										: "rgba(239,68,68,0.3)"
								}`,
								color: message.type === "success" ? "#4ADE80" : "#F87171",
								fontSize: 14,
							}}
						>
							{message.text}
						</div>
					)}

					{activeTab === "overview" && (
						<>
							<div className="dash-stats">
								{statCards.map((s, i) => (
									<div
										key={s.label}
										className={`dash-stat-card dash-animate dash-animate-${i + 2}`}
									>
										<div className="dash-stat-top">
											<div
												className="dash-stat-icon"
												style={{ background: s.bg, color: s.color }}
											>
												<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
													<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
												</svg>
											</div>
										</div>
										<div className="dash-stat-value">
											{loading ? "…" : s.value}
										</div>
										<div className="dash-stat-label">{s.label}</div>
									</div>
								))}
							</div>

							<div className="dash-panel dash-animate dash-animate-5">
								<div className="dash-panel-header">
									<h2 className="dash-panel-title">Quick Actions</h2>
								</div>
								<div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
									<button
										type="button"
										className="dash-btn-primary"
										onClick={() => setActiveTab("admins")}
									>
										Add New Admin
									</button>
									<Link href="/contact" className="dash-btn-outline" style={{ textDecoration: "none" }}>
										View Contact Page
									</Link>
								</div>
							</div>
						</>
					)}

					{activeTab === "admins" && (
						<div style={{ display: "grid", gap: 24 }}>
							<div className="dash-panel dash-animate dash-animate-2">
								<div className="dash-panel-header">
									<h2 className="dash-panel-title">Add Admin</h2>
								</div>
								<form
									onSubmit={handleSubmit(onAddAdmin)}
									style={{ display: "grid", gap: 16, maxWidth: 480 }}
								>
									<div>
										<label style={labelStyle}>Full Name</label>
										<input
											{...register("name", { required: "Name is required" })}
											style={inputStyle}
											placeholder="Jane Doe"
										/>
										{errors.name && (
											<p style={errorStyle}>{errors.name.message}</p>
										)}
									</div>
									<div>
										<label style={labelStyle}>Email</label>
										<input
											type="email"
											{...register("email", {
												required: "Email is required",
												pattern: {
													value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
													message: "Invalid email address",
												},
											})}
											style={inputStyle}
											placeholder="admin@company.com"
										/>
										{errors.email && (
											<p style={errorStyle}>{errors.email.message}</p>
										)}
									</div>
									<div>
										<label style={labelStyle}>Password</label>
										<input
											type="password"
											{...register("password", {
												required: "Password is required",
												minLength: {
													value: 8,
													message: "Minimum 8 characters",
												},
											})}
											style={inputStyle}
											placeholder="Min. 8 characters"
										/>
										{errors.password && (
											<p style={errorStyle}>{errors.password.message}</p>
										)}
									</div>
									<button
										type="submit"
										className="dash-btn-primary"
										disabled={isSubmitting}
										style={{ width: "fit-content" }}
									>
										{isSubmitting ? "Creating…" : "Create Admin"}
									</button>
								</form>
							</div>

							<div className="dash-panel dash-animate dash-animate-3">
								<div className="dash-panel-header">
									<h2 className="dash-panel-title">
										Admin Users ({admins.length})
									</h2>
								</div>
								{loading ? (
									<p style={{ color: "#64748B", fontSize: 14 }}>Loading…</p>
								) : admins.length === 0 ? (
									<p style={{ color: "#64748B", fontSize: 14 }}>
										No admins found.
									</p>
								) : (
									<div style={{ overflowX: "auto" }}>
										<table style={{ width: "100%", borderCollapse: "collapse" }}>
											<thead>
												<tr>
													{["Name", "Email", "Joined", "Last Login", ""].map(
														(h) => (
															<th key={h} style={thStyle}>
																{h}
															</th>
														),
													)}
												</tr>
											</thead>
											<tbody>
												{admins.map((admin) => (
													<tr key={admin.id}>
														<td style={tdStyle}>{admin.name}</td>
														<td style={tdStyle}>{admin.email}</td>
														<td style={tdStyle}>
															{formatDate(admin.createdAt)}
														</td>
														<td style={tdStyle}>
															{formatDate(admin.lastLogin)}
														</td>
														<td style={tdStyle}>
															{admin.id !== user.id && (
																<button
																	type="button"
																	onClick={() => onRemoveAdmin(admin.id)}
																	style={{
																		background: "rgba(239,68,68,0.1)",
																		border: "1px solid rgba(239,68,68,0.3)",
																		color: "#F87171",
																		borderRadius: 8,
																		padding: "6px 12px",
																		fontSize: 12,
																		cursor: "pointer",
																	}}
																>
																	Remove
																</button>
															)}
															{admin.id === user.id && (
																<span
																	style={{
																		fontSize: 12,
																		color: "#64748B",
																	}}
																>
																	You
																</span>
															)}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}

const labelStyle = {
	display: "block",
	fontSize: 13,
	color: "#94A3B8",
	marginBottom: 6,
};

const inputStyle = {
	width: "100%",
	padding: "12px 14px",
	borderRadius: 10,
	border: "1px solid rgba(51,65,85,0.6)",
	background: "rgba(15,23,42,0.5)",
	color: "#E2E8F0",
	fontSize: 14,
	outline: "none",
	boxSizing: "border-box",
};

const errorStyle = {
	color: "#F87171",
	fontSize: 12,
	marginTop: 4,
};

const thStyle = {
	textAlign: "left",
	padding: "10px 12px",
	fontSize: 11,
	fontWeight: 600,
	color: "#64748B",
	textTransform: "uppercase",
	letterSpacing: "0.5px",
	borderBottom: "1px solid rgba(51,65,85,0.4)",
};

const tdStyle = {
	padding: "14px 12px",
	fontSize: 14,
	color: "#CBD5E1",
	borderBottom: "1px solid rgba(51,65,85,0.2)",
};
