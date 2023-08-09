
'use client'
import "../app/styles/globals.css";
import Provider from "@components/oAuthProvider";
import Nav from "@components/Nav";
import SideNav from "@components/SideNav";
import { AuthProvider } from "@components/authProvider";
import { ClipProvider } from "@components/clipProvider";
import { Roboto } from "next/font/google";



const roboto = Roboto({ weight: ["300","500","700"], subsets: ["latin"] });



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={roboto.className}>
      <Provider>
        <AuthProvider>
          <ClipProvider>
            <Nav />
            <SideNav />
            <div className="pt-15">{children}</div>
          </ClipProvider>
        </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
