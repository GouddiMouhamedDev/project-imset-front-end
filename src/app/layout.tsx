
  import "./globals.css";
  import type { Metadata } from "next";
  import { Inter } from "next/font/google";
  import { cn } from "../lib/utils";
  export const metadata: Metadata = {
    title: " Counter-management",
    description: "Generated by Gouddi Mouhamed & Râhma Ben Saoud",
  };

  const inter = Inter({ subsets: ["latin"] });

  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        
        <body className={cn( inter.className,{
          "debug-screens": process.env.NODE_ENV === "development"})}>
         
            {children}
        
        </body>
      </html>
    );
  }
