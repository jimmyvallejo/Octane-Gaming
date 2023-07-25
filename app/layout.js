
import "../app/styles/globals.css";
import { Inter } from "next/font/google";
import Nav from "@components/Nav";
import { AuthProvider } from "@components/authProvider";
import { ClipProvider } from "@components/clipProvider";
const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ClipProvider>
            <Nav />
            <div className="pt-15">{children}</div>
          </ClipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
