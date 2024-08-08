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
  description: "Onde seu próximo corte está à distância de um toque.",
  image: 
    "https://firebasestorage.googleapis.com/v0/b/cutzone-a95f2.appspot.com/o/cutzone.png?alt=media&token=9845f7dd-a2ae-42b0-9632-a82593f02a27"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
