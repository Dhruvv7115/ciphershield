"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

/* ── Static Data ── */
const planFeatures = {
	Starter: [
		"5 security audits/mo",
		"Basic threat monitoring",
		"Email support",
		"1 workspace",
	],
	Professional: [
		"Unlimited audits",
		"AI threat detection",
		"Priority support",
		"5 workspaces",
		"API access",
	],
	Enterprise: [
		"Custom SLAs",
		"Dedicated SOC team",
		"24/7 phone support",
		"Unlimited workspaces",
		"On-prem option",
	],
};

const stats = [
	{
		label: "Active Services",
		value: "3",
		trend: "+1",
		icon: "services",
		color: "#6366F1",
	},
	{
		label: "Threats Blocked",
		value: "1,247",
		trend: "+89",
		icon: "shield",
		color: "#4ADE80",
	},
	{
		label: "Uptime",
		value: "99.9%",
		trend: "—",
		icon: "signal",
		color: "#22D3EE",
	},
	{
		label: "Compliance",
		value: "98",
		trend: "+3",
		icon: "check",
		color: "#FBBF24",
	},
];

const securityItems = [
	{ label: "Firewall", status: "Active", dotClass: "active" },
	{ label: "Endpoint Protection", status: "Active", dotClass: "active" },
	{ label: "Threat Intelligence", status: "Active", dotClass: "active" },
	{ label: "SIEM Integration", status: "Pending", dotClass: "pending" },
	{ label: "Zero-Trust Access", status: "Active", dotClass: "active" },
	{ label: "Incident Response", status: "Standby", dotClass: "standby" },
];

const activityFeed = [
	{
		text: "Firewall rules updated — 12 new rules applied",
		time: "2 hours ago",
		iconBg: "rgba(99,102,241,0.12)",
		iconColor: "#818CF8",
	},
	{
		text: "Threat blocked: Brute-force attempt on SSH",
		time: "5 hours ago",
		iconBg: "rgba(74,222,128,0.12)",
		iconColor: "#4ADE80",
	},
	{
		text: "Weekly compliance scan completed",
		time: "1 day ago",
		iconBg: "rgba(251,191,36,0.12)",
		iconColor: "#FBBF24",
	},
	{
		text: "SSL certificate renewed for *.aritaro.com",
		time: "2 days ago",
		iconBg: "rgba(34,211,238,0.12)",
		iconColor: "#22D3EE",
	},
];

/* ── SVG Icon Components ── */
const Icons = {
	services: (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect
				x="3"
				y="3"
				width="7"
				height="7"
				rx="1.5"
			/>
			<rect
				x="14"
				y="3"
				width="7"
				height="7"
				rx="1.5"
			/>
			<rect
				x="3"
				y="14"
				width="7"
				height="7"
				rx="1.5"
			/>
			<rect
				x="14"
				y="14"
				width="7"
				height="7"
				rx="1.5"
			/>
		</svg>
	),
	shield: (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
			<path d="M9 12l2 2 4-4" />
		</svg>
	),
	signal: (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M2 20h.01" />
			<path d="M7 20v-4" />
			<path d="M12 20v-8" />
			<path d="M17 20V8" />
			<path d="M22 20V4" />
		</svg>
	),
	check: (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
			<polyline points="22 4 12 14.01 9 11.01" />
		</svg>
	),
	overview: (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect
				x="3"
				y="3"
				width="18"
				height="18"
				rx="2"
			/>
			<path d="M3 9h18" />
			<path d="M9 21V9" />
		</svg>
	),
	threats: (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
		</svg>
	),
	reports: (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
			<polyline points="14 2 14 8 20 8" />
			<line
				x1="16"
				y1="13"
				x2="8"
				y2="13"
			/>
			<line
				x1="16"
				y1="17"
				x2="8"
				y2="17"
			/>
		</svg>
	),
	settings: (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle
				cx="12"
				cy="12"
				r="3"
			/>
			<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
		</svg>
	),
	cart: (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle
				cx="9"
				cy="21"
				r="1"
			/>
			<circle
				cx="20"
				cy="21"
				r="1"
			/>
			<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
		</svg>
	),
	logout: (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
			<polyline points="16 17 21 12 16 7" />
			<line
				x1="21"
				y1="12"
				x2="9"
				y2="12"
			/>
		</svg>
	),
	arrow: (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.5"
			strokeLinecap="round"
		>
			<path d="M5 12h14M12 5l7 7-7 7" />
		</svg>
	),
	menu: (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
		>
			<line
				x1="3"
				y1="6"
				x2="21"
				y2="6"
			/>
			<line
				x1="3"
				y1="12"
				x2="21"
				y2="12"
			/>
			<line
				x1="3"
				y1="18"
				x2="21"
				y2="18"
			/>
		</svg>
	),
	trendUp: (
		<svg
			width="12"
			height="12"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
			<polyline points="17 6 23 6 23 12" />
		</svg>
	),
	activity: (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
		</svg>
	),
	checkSmall: (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="#4ADE80"
			strokeWidth="2.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="20 6 9 17 4 12" />
		</svg>
	),
};

/* ── Compliance Ring SVG ── */
function ComplianceRing({ score = 98 }) {
	const r = 56;
	const circumference = 2 * Math.PI * r;
	const offset = circumference - (score / 100) * circumference;

	return (
		<div className="dash-ring-container">
			<div className="dash-ring-wrap">
				<svg
					width="140"
					height="140"
					viewBox="0 0 140 140"
				>
					<circle
						cx="70"
						cy="70"
						r={r}
						fill="none"
						stroke="rgba(51,65,85,0.3)"
						strokeWidth="10"
					/>
					<circle
						cx="70"
						cy="70"
						r={r}
						fill="none"
						stroke="url(#ringGrad)"
						strokeWidth="10"
						strokeLinecap="round"
						strokeDasharray={circumference}
						strokeDashoffset={offset}
						style={{
							transform: "rotate(-90deg)",
							transformOrigin: "50% 50%",
							transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)",
						}}
					/>
					<defs>
						<linearGradient
							id="ringGrad"
							x1="0%"
							y1="0%"
							x2="100%"
							y2="100%"
						>
							<stop
								offset="0%"
								stopColor="#6366F1"
							/>
							<stop
								offset="50%"
								stopColor="#818CF8"
							/>
							<stop
								offset="100%"
								stopColor="#22D3EE"
							/>
						</linearGradient>
					</defs>
				</svg>
				<div className="dash-ring-text">
					<div className="dash-ring-value">{score}%</div>
					<div className="dash-ring-label">Compliance</div>
				</div>
			</div>
		</div>
	);
}

/* ── Stat Icon Backgrounds ── */
const iconBgs = {
	services: { bg: "rgba(99,102,241,0.12)", color: "#818CF8" },
	shield: { bg: "rgba(74,222,128,0.12)", color: "#4ADE80" },
	signal: { bg: "rgba(34,211,238,0.12)", color: "#22D3EE" },
	check: { bg: "rgba(251,191,36,0.12)", color: "#FBBF24" },
};

const typeColors = {
	info: { bg: "rgba(99,102,241,0.12)", color: "#818CF8" },
	success: { bg: "rgba(74,222,128,0.12)", color: "#4ADE80" },
	warning: { bg: "rgba(251,191,36,0.12)", color: "#FBBF24" },
	error: { bg: "rgba(239,68,68,0.12)", color: "#EF4444" },
	update: { bg: "rgba(34,211,238,0.12)", color: "#22D3EE" },
};

const getRelativeTime = (dateStr) => {
	const now = new Date();
	const past = new Date(dateStr);
	const ms = now - past;
	const mins = Math.floor(ms / 60000);
	const hours = Math.floor(mins / 60);
	const days = Math.floor(hours / 24);

	if (mins < 1) return "Just now";
	if (mins < 60) return `${mins}m ago`;
	if (hours < 24) return `${hours}h ago`;
	return `${days}d ago`;
};

export default function DashboardPage() {
	const { data: session } = useSession();
	const user = session?.user || null;
	const { items } = useCart();
	
	const [activePlan] = useState("Professional");
	const [notifications, setNotifications] = useState([]);
	const [loadingNotifications, setLoadingNotifications] = useState(true);

	useEffect(() => {
		const fetchNotifications = async () => {
			try {
				const res = await fetch("/api/notifications");
				const data = await res.json();
				setNotifications(data.notifications || []);
			} catch (err) {
				console.error("Failed to fetch notifications:", err);
			} finally {
				setLoadingNotifications(false);
			}
		};
		if (user) {
			fetchNotifications();
		}
	}, [user]);

	if (!user)
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

	const joinDate = user.joinedAt
		? new Date(user.joinedAt).toLocaleDateString("en-US", {
				month: "long",
				year: "numeric",
			})
		: "Recently";

	return (
		<main className="dash-main">
			<div className="dash-main-bg" />
			<div className="dash-content">
				{/* Header */}
				<div className="dash-header dash-animate dash-animate-1">
					<div className="dash-header-left">
						<div
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: 8,
								background: "rgba(99,102,241,0.08)",
								border: "1px solid rgba(99,102,241,0.2)",
								borderRadius: 100,
								padding: "4px 14px",
								marginBottom: 12,
							}}
							className="dash-operational-badge"
						>
							<span
								style={{
									width: 6,
									height: 6,
									borderRadius: "50%",
									background: "#4ADE80",
									boxShadow: "0 0 8px rgba(74,222,128,0.7)",
									animation: "pulse-glow 2s ease-in-out infinite",
								}}
							/>
							<span
								style={{
									fontFamily: "var(--font-mono)",
									fontSize: 10,
									letterSpacing: "2px",
									color: "#4ADE80",
									fontWeight: 600,
								}}
							>
								SYSTEMS OPERATIONAL
							</span>
						</div>
						<h1>
							Welcome back,{" "}
							<span className="grad-indigo">{user.name.split(" ")[0]}</span>
						</h1>
						<p>
							Member since {joinDate} · {user.email}
						</p>
					</div>
					<div className="dash-header-actions">
						<Link
							href="/services"
							className="dash-btn-primary"
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: 8,
								textDecoration: "none",
							}}
						>
							Browse Services {Icons.arrow}
						</Link>
						<button
							onClick={() => signOut({ callbackUrl: "/login" })}
							className="dash-btn-danger"
						>
							{Icons.logout} Logout
						</button>
					</div>
				</div>

				{/* Stats Grid */}
				<div className="dash-stats">
					{stats.map((s, i) => (
						<div
							key={i}
							className={`dash-stat-card dash-animate dash-animate-${i + 2}`}
						>
							<div className="dash-stat-top">
								<div
									className="dash-stat-icon"
									style={{
										background: iconBgs[s.icon].bg,
										color: iconBgs[s.icon].color,
									}}
								>
									{Icons[s.icon]}
								</div>
								{s.trend !== "—" ? (
									<span className="dash-stat-trend up">
										{Icons.trendUp} {s.trend}
									</span>
								) : (
									<span className="dash-stat-trend neutral">{s.trend}</span>
								)}
							</div>
							<div className="dash-stat-value">{s.value}</div>
							<div className="dash-stat-label">{s.label}</div>
						</div>
					))}
				</div>

				{/* Two-column panels */}
				<div className="dash-panels dash-animate dash-animate-5">
					{/* Security Status */}
					<div className="dash-panel">
						<div className="dash-panel-header">
							<h2 className="dash-panel-title">Security Status</h2>
							<span
								className="dash-panel-badge"
								style={{
									background: "rgba(74,222,128,0.1)",
									border: "1px solid rgba(74,222,128,0.25)",
									color: "#4ADE80",
								}}
							>
								ALL SYSTEMS GO
							</span>
						</div>
						{securityItems.map((item, i) => (
							<div
								key={i}
								className="dash-status-item"
							>
								<span className={`dash-status-dot ${item.dotClass}`} />
								<span className="dash-status-name">{item.label}</span>
								<span
									className="dash-status-label"
									style={{
										color:
											item.dotClass === "active"
												? "#4ADE80"
												: item.dotClass === "pending"
													? "#FBBF24"
													: "#22D3EE",
									}}
								>
									{item.status}
								</span>
							</div>
						))}
					</div>

					{/* Compliance + Plan */}
					<div className="dash-panel">
						<div className="dash-panel-header">
							<h2 className="dash-panel-title">Compliance Score</h2>
							<span
								className="dash-panel-badge"
								style={{
									background: "rgba(99,102,241,0.1)",
									border: "1px solid rgba(99,102,241,0.25)",
									color: "#818CF8",
								}}
							>
								{activePlan.toUpperCase()}
							</span>
						</div>

						<ComplianceRing score={98} />

						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: 8,
								marginTop: 16,
							}}
						>
							<div
								style={{
									padding: "10px 14px",
									background: "rgba(2,6,23,0.4)",
									border: "1px solid rgba(51,65,85,0.3)",
									borderRadius: 10,
									textAlign: "center",
								}}
							>
								<div
									style={{
										fontFamily: "var(--font-mono)",
										fontSize: 16,
										fontWeight: 700,
										color: "#F1F5F9",
									}}
								>
									24
								</div>
								<div style={{ fontSize: 11, color: "#475569" }}>
									Checks Passed
								</div>
							</div>
							<div
								style={{
									padding: "10px 14px",
									background: "rgba(2,6,23,0.4)",
									border: "1px solid rgba(51,65,85,0.3)",
									borderRadius: 10,
									textAlign: "center",
								}}
							>
								<div
									style={{
										fontFamily: "var(--font-mono)",
										fontSize: 16,
										fontWeight: 700,
										color: "#FBBF24",
									}}
								>
									1
								</div>
								<div style={{ fontSize: 11, color: "#475569" }}>
									Needs Review
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Activity + Plan Row */}
				<div className="dash-panels dash-animate dash-animate-6">
					{/* Activity Feed */}
					<div className="dash-panel">
						<div className="dash-panel-header">
							<h2 className="dash-panel-title">Recent Activity</h2>
							<button
								className="dash-btn-outline"
								style={{ padding: "6px 14px", fontSize: 12 }}
							>
								View All
							</button>
						</div>
						{loadingNotifications ? (
							<div style={{ display: "flex", justifyContent: "center", padding: "20px 0", color: "#818CF8" }}>
								<div
									style={{
										width: 20,
										height: 20,
										border: "2px solid rgba(129,140,248,0.2)",
										borderTopColor: "#818CF8",
										borderRadius: "50%",
										animation: "spin 1s linear infinite",
									}}
								/>
							</div>
						) : notifications.length === 0 ? (
							<div style={{ padding: "24px 0", textAlign: "center", color: "#64748B", fontSize: 13 }}>
								No recent activity
							</div>
						) : (
							notifications.map((a, i) => {
								const styleMeta = typeColors[a.type] || typeColors.info;
								return (
									<div
										key={i}
										className="dash-activity-item"
									>
										<div
											className="dash-activity-icon"
											style={{ background: styleMeta.bg, color: styleMeta.color }}
										>
											{Icons.activity}
										</div>
										<div className="dash-activity-content">
											<div className="dash-activity-text">{a.message}</div>
											<div className="dash-activity-time">{getRelativeTime(a.createdAt)}</div>
										</div>
									</div>
								);
							})
						)}
					</div>

					{/* Active Plan */}
					<div className="dash-panel">
						<div className="dash-panel-header">
							<h2 className="dash-panel-title">Active Plan</h2>
							<span
								className="dash-panel-badge"
								style={{
									background: "rgba(99,102,241,0.1)",
									border: "1px solid rgba(99,102,241,0.25)",
									color: "#818CF8",
								}}
							>
								PRO
							</span>
						</div>

						<div
							style={{
								height: 3,
								background: "linear-gradient(90deg,#6366F1,#818CF8,#22D3EE)",
								borderRadius: 4,
								marginBottom: 20,
							}}
						/>

						<div
							className="dash-feature-list"
							style={{ marginBottom: 20 }}
						>
							{(planFeatures[activePlan] || []).map((f, i) => (
								<div
									key={i}
									className="dash-feature-item"
								>
									{Icons.checkSmall}
									<span>{f}</span>
								</div>
							))}
						</div>

						{/* Usage bar */}
						<div style={{ marginBottom: 20 }}>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									marginBottom: 4,
								}}
							>
								<span style={{ fontSize: 12, color: "#94A3B8" }}>
									Usage this month
								</span>
								<span
									style={{
										fontSize: 12,
										color: "#818CF8",
										fontFamily: "var(--font-mono)",
										fontWeight: 600,
									}}
								>
									67%
								</span>
							</div>
							<div className="dash-progress-track">
								<div
									className="dash-progress-fill"
									style={{
										width: "67%",
										background: "linear-gradient(90deg,#6366F1,#818CF8)",
									}}
								/>
							</div>
						</div>

						<div style={{ display: "flex", gap: 8 }}>
							<button
								className="dash-btn-outline"
								style={{ flex: 1 }}
							>
								Manage
							</button>
							<button
								className="dash-btn-primary"
								style={{ flex: 1 }}
							>
								Upgrade ↗
							</button>
						</div>
					</div>
				</div>

				{/* Quote Builder (if items exist) */}
				{items.length > 0 && (
					<div className="dash-full-panel dash-animate dash-animate-6">
						<div className="dash-panel-header">
							<h2 className="dash-panel-title">Quote Builder</h2>
							<span
								className="dash-panel-badge"
								style={{
									background: "rgba(255,61,90,0.1)",
									border: "1px solid rgba(255,61,90,0.25)",
									color: "#FF6B81",
								}}
							>
								{items.length} ITEMS
							</span>
						</div>
						<div className="dash-services-grid">
							{items.slice(0, 6).map((item) => (
								<div
									key={item.number}
									className="dash-status-item"
								>
									<div
										style={{
											width: 34,
											height: 34,
											borderRadius: 8,
											background: "rgba(99,102,241,0.12)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											color: "#818CF8",
											flexShrink: 0,
										}}
									>
										{Icons.services}
									</div>
									<div style={{ flex: 1, minWidth: 0 }}>
										<div
											style={{
												fontSize: 12,
												fontWeight: 600,
												color: "#E2E8F0",
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											{item.title}
										</div>
										<div
											style={{
												fontSize: 11,
												color: "#475569",
												fontFamily: "var(--font-mono)",
											}}
										>
											{item.price}
										</div>
									</div>
								</div>
							))}
						</div>
						<div
							style={{
								marginTop: 16,
								display: "flex",
								justifyContent: "flex-end",
							}}
						>
							<button
								className="dash-btn-primary"
								style={{
									display: "inline-flex",
									alignItems: "center",
									gap: 8,
								}}
							>
								Request Quote {Icons.arrow}
							</button>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
