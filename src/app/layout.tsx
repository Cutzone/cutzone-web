import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { Inter } from "next/font/google";
import "@/config/firebase";
import AuthProvider from "@providers/Auth";
import UserProvider from "@providers/User";
import QueryClientProviderApp from "@providers/QueryClientApp";
import PaymentProvider from "@/store/providers/Payment";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cutzone",
  description: "Plataforma Cutzone"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html translate="no">
      <QueryClientProviderApp>
        <UserProvider>
          <AuthProvider>
            <PaymentProvider>
              <body className={inter.className}>
                <ToastContainer />
                {children}
              </body>
            </PaymentProvider>
          </AuthProvider>
        </UserProvider>
      </QueryClientProviderApp>
    </html>
  );
}
