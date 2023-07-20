
import "../app/styles/globals.css";
import { Inter } from "next/font/google";
import Nav from "@components/Nav";
import { AuthProvider } from "@components/authProvider";
const inter = Inter({ subsets: ["latin"] });



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
         
            <Nav />
            {children}
        
        </AuthProvider>
      </body>
    </html>
  );
}
