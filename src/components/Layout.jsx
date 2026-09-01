import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header className="bg-white border-b">
        <div className="px-6 py-4">
          <h1 className="text-xl font-bold text-gray-800">
            SafeCircle
          </h1>
        </div>
      </Header>

      <div className="flex">
        <Sidebar className="w-64 min-h-[calc(100vh-65px)] bg-white border-r">
          <div className="p-6">
            <p className="font-medium text-gray-700">
              Navigation
            </p>
          </div>
        </Sidebar>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;