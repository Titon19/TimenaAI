import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Timena AI",
  description: "AI Chat Mini App",
};

import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={"/timena-ai-icon.png"} type="image/png" />
        <title>TimenaAI</title>
      </head>
      <body
        className={`${poppins.variable} antialiased dark:bg-neutral-950 bg-neutral-100`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
