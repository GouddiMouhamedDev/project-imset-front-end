import "@/app/globals.css";
import { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
   <>
   <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
    {children}
    </ThemeProvider>
    </>
    
    
  );
}
