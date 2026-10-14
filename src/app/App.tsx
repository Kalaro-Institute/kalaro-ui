import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "@/app/components/ui/sonner";

export default function App() {
  return (
    <AuthProvider>
      {/* Inside AuthProvider so the cart is available to every route
          and to the header badge. */}
      <CartProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </CartProvider>
    </AuthProvider>
  );
}
