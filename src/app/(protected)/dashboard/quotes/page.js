"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const Icons = {
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
	doc: (
		<svg
			width="22"
			height="22"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
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
};

const statusColors = {
	pending: {
		text: "#F59E0B",
		bg: "rgba(245, 158, 11, 0.08)",
		border: "1px solid rgba(245, 158, 11, 0.2)",
	},
	approved: {
		text: "#10B981",
		bg: "rgba(16, 185, 129, 0.08)",
		border: "1px solid rgba(16, 185, 129, 0.2)",
	},
	declined: {
		text: "#EF4444",
		bg: "rgba(239, 68, 68, 0.08)",
		border: "1px solid rgba(239, 68, 68, 0.2)",
	},
	contracted: {
		text: "#3B82F6",
		bg: "rgba(59, 130, 246, 0.08)",
		border: "1px solid rgba(59, 130, 246, 0.2)",
	},
};

export default function QuotesPage() {
	const [quotes, setQuotes] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchQuotes = async () => {
			try {
				const res = await fetch("/api/quotes");
				const data = await res.json();
				setQuotes(data.quotes || []);
			} catch (err) {
				console.error("Error fetching quotes:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchQuotes();
	}, []);

	return (
		<main className="dash-main">
			<div className="dash-main-bg" />
			<div className="dash-content">
				{/* Header */}
				<div
					className="dash-header dash-animate dash-animate-1"
					style={{ marginBottom: 24 }}
				>
					<div className="dash-header-left">
						<div
							className="dash-operational-badge"
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
						>
							<span
								style={{
									width: 6,
									height: 6,
									borderRadius: "50%",
									background: "#818CF8",
									boxShadow: "0 0 8px rgba(129,140,248,0.7)",
								}}
							/>
							<span
								style={{
									fontFamily: "var(--font-mono)",
									fontSize: 10,
									letterSpacing: "2px",
									color: "#818CF8",
									fontWeight: 600,
								}}
							>
								QUOTE REQUESTS
							</span>
						</div>
						<h1>My Custom Quotes</h1>
						<p>Track the status and active review details of your security coverage quotes.</p>
					</div>

					<div className="dash-header-actions">
						<Link
							href="/dashboard/services"
							className="dash-btn-primary"
							style={{
								display: "inline-flex",
								alignItems: "center",
								gap: 8,
								textDecoration: "none",
							}}
						>
							Build New Quote {Icons.arrow}
						</Link>
					</div>
				</div>

				{/* Quotes Grid / Table */}
				{loading ? (
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							padding: "60px 0",
							color: "#818CF8",
						}}
					>
						<div
							style={{
								width: 32,
								height: 32,
								border: "3px solid rgba(129,140,248,0.2)",
								borderTopColor: "#818CF8",
								borderRadius: "50%",
								animation: "spin 1s linear infinite",
							}}
						/>
					</div>
				) : quotes.length === 0 ? (
					<div
						style={{
							textAlign: "center",
							padding: "64px 24px",
							background: "rgba(15,23,42,0.3)",
							border: "1px solid rgba(255,255,255,0.05)",
							borderRadius: 18,
							color: "#64748B",
							maxWidth: 600,
							margin: "0 auto",
							marginTop: 40,
						}}
					>
						<div style={{ fontSize: 32, marginBottom: 16 }}>📋</div>
						<h3 style={{ color: "#F1F5F9", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
							No Quote Requests Yet
						</h3>
						<p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6, marginBottom: 20 }}>
							You haven't submitted any custom quotes. Use the Quote Builder in the services catalog to construct a quote request.
						</p>
						<Link
							href="/dashboard/services"
							className="dash-btn-outline"
							style={{ display: "inline-flex", textDecoration: "none" }}
						>
							Go to Services
						</Link>
					</div>
				) : (
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: 20,
						}}
						className="dash-animate dash-animate-2"
					>
						{quotes.map((quote) => {
							const colorMeta = statusColors[quote.status] || statusColors.pending;

							return (
								<div
									key={quote.id}
									style={{
										background: "rgba(15,23,42,0.45)",
										border: "1px solid rgba(99,102,241,0.12)",
										borderRadius: 18,
										padding: "24px",
										backdropFilter: "blur(8px)",
										position: "relative",
										overflow: "hidden",
									}}
								>
									{/* Top Bar info */}
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "flex-start",
											borderBottom: "1px solid rgba(255,255,255,0.05)",
											paddingBottom: 16,
											marginBottom: 16,
											flexWrap: "wrap",
											gap: 12,
										}}
									>
										<div>
											<div style={{ display: "flex", gap: 10, alignItems: "center" }}>
												<span style={{ fontSize: 12, color: "#64748B", fontFamily: "var(--font-mono)" }}>
													QUOTE ID: {quote.id}
												</span>
											</div>
											<span style={{ fontSize: 12, color: "#475569", marginTop: 4, display: "block" }}>
												Requested on {new Date(quote.createdAt).toLocaleDateString()}
											</span>
										</div>

										<span
											style={{
												fontSize: 10,
												fontWeight: 700,
												letterSpacing: "1px",
												color: colorMeta.text,
												background: colorMeta.bg,
												border: colorMeta.border,
												borderRadius: 100,
												padding: "4px 12px",
												fontFamily: "var(--font-mono)",
												textTransform: "uppercase",
											}}
										>
											{quote.status}
										</span>
									</div>

									{/* Quote Items List */}
									<div style={{ marginBottom: 20 }}>
										<div
											style={{
												fontSize: 11,
												fontWeight: 700,
												color: "#334155",
												textTransform: "uppercase",
												letterSpacing: "0.5px",
												marginBottom: 10,
											}}
										>
											Requested Coverage Items
										</div>
										<div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
											{quote.items.map((item, idx) => (
												<div
													key={idx}
													style={{
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
														background: "rgba(255,255,255,0.02)",
														border: "1px solid rgba(255,255,255,0.04)",
														borderRadius: 12,
														padding: "12px 16px",
													}}
												>
													<div style={{ display: "flex", alignItems: "center", gap: 10 }}>
														<div style={{ color: "#818CF8", display: "flex" }}>
															{Icons.doc}
														</div>
														<div>
															<div style={{ fontSize: 14, fontWeight: 600, color: "#F1F5F9" }}>
																{item.title}
															</div>
															<span style={{ fontSize: 11, color: "#475569" }}>
																Slug: {item.slug}
															</span>
														</div>
													</div>
													<div style={{ textAlign: "right" }}>
														<span style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9", fontFamily: "var(--font-mono)" }}>
															{item.pricePerMonth}
														</span>
														<span style={{ fontSize: 11, color: "#475569", display: "block" }}>
															× {item.months} {item.months === 1 ? "month" : "months"}
														</span>
													</div>
												</div>
											))}
										</div>
									</div>

									{/* Footer pricing totals */}
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											borderTop: "1px solid rgba(255,255,255,0.05)",
											paddingTop: 16,
											flexWrap: "wrap",
											gap: 12,
										}}
									>
										<div>
											{quote.notes && (
												<p style={{ fontSize: 12, color: "#94A3B8", fontStyle: "italic" }}>
													" {quote.notes} "
												</p>
											)}
										</div>

										<div style={{ textAlign: "right" }}>
											<span style={{ fontSize: 10, color: "#475569", display: "block" }}>
												ESTIMATED TOTAL COST
											</span>
											<span
												style={{
													fontSize: 18,
													fontWeight: 800,
													color: "#F1F5F9",
													fontFamily: "var(--font-mono)",
												}}
											>
												₹{quote.totalPrice.toLocaleString("en-IN")}
											</span>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</main>
	);
}
