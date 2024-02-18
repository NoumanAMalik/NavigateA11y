import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "NavigateA11y",
    description:
        "NavigateA11y is a tool that analyzes website's to rate their accessibility and then offers ai assisted feedback on how to improve",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" data-theme="dark">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
