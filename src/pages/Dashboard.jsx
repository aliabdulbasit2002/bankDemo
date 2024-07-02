// components
import SideBar from "../components/SideBar";
import TransAndWallet from "../components/TransAndWallet";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <div className="shadow-sm z-10">
        <Navbar />
      </div>
      <div className="grid grid-cols-12 min-h-[calc(100vh-64px)]">
        <div className="col-span-2">
          <SideBar />
        </div>
        <div className="col-span-7 bg-slate-100">
          <Outlet />
        </div>
        <div className="col-span-3">
          <TransAndWallet />
        </div>
      </div>
    </>
  );
};
export default Dashboard;
