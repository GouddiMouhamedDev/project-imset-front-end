  import "./globals.css";
  import type { Metadata } from "next";
  import { Inter } from "next/font/google";
  import { cn } from "../lib/utils";
  import { ThemeProvider } from "@/components/theme-provider"
  import { Toaster } from "@/components/ui/sonner"
export const metadata: Metadata = {
  title: "TradeFlow",
  description: "Generated by Gouddi Mouhamed & Râhma Ben Saoud",

};

  const inter = Inter({ subsets: ["latin"] });

  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en" suppressHydrationWarning>
     
        <body className={cn( inter.className,{
          "debug-screens": process.env.NODE_ENV === "development"})}>
             <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
           
            {children}
            <Toaster richColors/>
            </ThemeProvider>
        </body>
      </html>
    );
  }
