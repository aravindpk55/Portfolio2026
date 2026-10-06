import type { Metadata } from "next";
import { Bricolage_Grotesque, Schibsted_Grotesk } from "next/font/google";
import { Providers } from "@/components/Providers";
import { Nav } from "@/components/Nav";
import { Chat } from "@/components/Chat";
import { profile } from "@/data/portfolio";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", weight: ["400", "600", "700"] });
const body = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  // Replace with your deployed URL so link previews work on LinkedIn.
  metadataBase: new URL("https://your-domain.dev"),
  title: `${profile.name} | Data Science Portfolio`,
  description: `${profile.role}. ${profile.intro}`,
  openGraph: {
    title: `${profile.name} | Data Science Portfolio`,
    description: profile.role,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <body>
        <Providers>
          <Nav />
          <main>{children}</main>
          <Chat />
        </Providers>
      </body>
    </html>
  );
}
