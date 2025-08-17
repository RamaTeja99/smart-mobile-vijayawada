import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./pages/AuthContext";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./pages/ProtectedRoute";
import CreateProduct from "./pages/CreateProduct ";
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import BrandsPage from "./pages/BrandsPage";
import EditProduct from "./pages/EditProduct";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
       <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin/>}/>
            <Route path="/admin/dashboard" element={
               <ProtectedRoute><AdminDashboard/></ProtectedRoute>}/>
             <Route
                path="/admin/products/new"
                element={
                  <ProtectedRoute>
                    <CreateProduct />
                  </ProtectedRoute>
                }
              />
               <Route
                path="/admin/products"
                element={
                  <ProtectedRoute>
                    <ProductsPage />
                  </ProtectedRoute>
                }
              />
               <Route
                path="/admin/categories"
                element={
                  <ProtectedRoute>
                    <CategoriesPage />
                  </ProtectedRoute>
                }
              />
               <Route
                path="/admin/brands"
                element={
                  <ProtectedRoute>
                    <BrandsPage />
                  </ProtectedRoute>
                }
                
              />
               <Route
                path="/admin/products/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditProduct />
                  </ProtectedRoute>
                }
              />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
