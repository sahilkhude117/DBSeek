import "./globals.css"
import { GeistMono } from "geist/font/mono"
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import { TableProvider } from "@/contexts/TableContext";
import Navbar from "@/components/navbar";

export const metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Talk to Postgres",
  description:
    "Chat with a Postgres database using natural language."
};

export default function RootLayout({
  children,
}:{
  children: React.ReactNode;
}){
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistMono.className} ${GeistSans.className}`}>
      <TableProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Navbar />
            {children}   
        </ThemeProvider>
      </TableProvider>
      </body>
    </html>
  )
}