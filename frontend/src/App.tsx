import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Orders from "./pages/Orders";
import Auth from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import OrderForm from "./pages/OrderForm";
import { ToastProvider } from "./components/ui/ToastProvider";
import Dashboard from "./pages/Dashboard";
import Warehouses from "./pages/Warehouses";
import CreateWarehouse from "./pages/CreateWarehouse";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import Varieties from "./pages/Varities";
import CreateVariety from "./pages/CreateVariety";
import Lots from "./pages/Lots";
import LotForm from "./pages/LotForm";

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
              <Route path="/orders/form" element={<OrderForm />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/warehouses" element={<Warehouses />} />
              <Route path="/warehouses/create" element={<CreateWarehouse />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/create" element={<CreateUser />} />
              <Route path="/varieties" element={<Varieties />} />
              <Route path="/varieties/create" element={<CreateVariety />} />
              <Route path="/lots" element={<Lots />} />
              <Route path="/lots/form" element={<LotForm />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
