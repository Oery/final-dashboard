import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600"] });

export const metadata: Metadata = {
    title: "Final Dashboard",
    description: "A dashboard for personal goals",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
