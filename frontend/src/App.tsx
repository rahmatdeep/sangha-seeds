import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Orders from "./pages/Orders";
import Auth from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import CreateOrder from "./pages/CreateOrder";
import { ToastProvider } from "./components/ui/ToastProvider";
import Dashboard from "./pages/Dashboard";

// Dummy pages for demonstration


function OrderDetails() {
  return <div>Order Details Page</div>;
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/create" element={<CreateOrder />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
