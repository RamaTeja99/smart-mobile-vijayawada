import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { AuthProvider } from "../../lib/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default Layout;
