import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthContext";
import { CartProvider } from "@/components/CartContext";
import CartPanel from "@/components/CartPanel";
import NavigationWrapper from "@/components/NavigationWrapper";
import GlobalBackground from "@/components/GlobalBackground";
import { Providers } from "./providers";

const inter = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600"],
	display: "swap",
});

// Also map to legacy --font-space-grotesk so existing components keep working
const jetbrainsMono = JetBrains_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
	weight: ["400"],
	display: "swap",
});

export const metadata = {
	title: "Aritaro Pvt Limited | Enterprise Cybersecurity & AI Automation",
	description:
		"Military-grade threat detection, zero-trust architecture, and AI-driven automation — built for India's most critical businesses.",
	keywords:
		"cybersecurity, AI automation, penetration testing, SOC, MDR, cloud security, compliance, aritaro, India",
};

export default function RootLayout({ children }) {
	return (
		<html
			lang="en"
			data-theme="dark"
			className={`${inter.variable} ${jetbrainsMono.variable}`}
		>
			<body
				className="min-h-screen antialiased overflow-x-hidden"
				style={{
					fontFamily: "var(--font-sans)",
					background: "var(--bg-base)",
					color: "var(--text-primary)",
					transition: "background 0.3s ease, color 0.3s ease",
				}}
			>
				<Providers>
					<AuthProvider>
						<CartProvider>
							{/* <GlobalBackground /> */}
							<NavigationWrapper />
							{children}
							<CartPanel />
						</CartProvider>
					</AuthProvider>
				</Providers>
			</body>
		</html>
	);
}
