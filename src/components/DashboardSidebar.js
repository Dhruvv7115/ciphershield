"use client";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import React, { useState } from "react";
import { useCart } from "./CartContext";
import Link from "next/link";
import Image from "next/image";
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
const DashboardSidebar = () => {
	const { data: session } = useSession();
	const user = session?.user || null;
	const { items } = useCart();
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const pathname = usePathname();
	return (
		<>
			{/* Mobile menu button */}
			<button
				className="dash-mobile-toggle"
				onClick={() => setSidebarOpen(!sidebarOpen)}
			>
				{Icons.menu}
			</button>

			{/* ── SIDEBAR ── */}
			<aside className={`dash-sidebar ${sidebarOpen ? "open" : ""}`}>
				<Link
					href="/"
					className="dash-sidebar-logo"
				>
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
					<div className="dash-nav-label">Main</div>
					<Link
						href="/dashboard"
						className={`dash-nav-item ${pathname === "/dashboard" ? "active" : ""}`}
						onClick={() => setSidebarOpen(false)}
					>
						<span className="dash-nav-icon">{Icons.overview}</span>
						Overview
					</Link>
					<Link
						href="/dashboard/services"
						className={`dash-nav-item ${pathname === "/dashboard/services" ? "active" : ""}`}
						onClick={() => setSidebarOpen(false)}
					>
						<span className="dash-nav-icon">{Icons.services}</span>
						Services
					</Link>
					<div className="dash-nav-item">
						<span className="dash-nav-icon">{Icons.threats}</span>
						Threat Center
					</div>
					<div className="dash-nav-item">
						<span className="dash-nav-icon">{Icons.reports}</span>
						Reports
					</div>
				</div>

				<div className="dash-nav-section">
					<div className="dash-nav-label">Account</div>
					<div className="dash-nav-item">
						<span className="dash-nav-icon">{Icons.cart}</span>
						Quote Builder
						{items.length > 0 && (
							<span className="dash-nav-badge">{items.length}</span>
						)}
					</div>
					<div className="dash-nav-item">
						<span className="dash-nav-icon">{Icons.settings}</span>
						Settings
					</div>
				</div>

				<div className="dash-sidebar-footer">
					<div className="dash-user-card">
						<div className="dash-avatar">
							{user?.avatar || user?.name.charAt(0).toUpperCase()}
						</div>
						<div className="dash-user-info">
							<div className="dash-user-name">{user?.name}</div>
							<div className="dash-user-email">{user?.email}</div>
						</div>
					</div>
				</div>
			</aside>
			{/* Sidebar backdrop for mobile */}
			{sidebarOpen && (
				<div
					onClick={() => setSidebarOpen(false)}
					style={{
						position: "fixed",
						inset: 0,
						background: "rgba(0,0,0,0.5)",
						zIndex: 99,
					}}
				/>
			)}
		</>
	);
};

export default DashboardSidebar;
