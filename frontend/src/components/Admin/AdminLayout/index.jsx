import { Image, Layout, Menu, Button, Modal, Avatar, Typography } from "antd";
import {
  BarChartOutlined,
  MenuOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
  DashboardOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Loader from "../../Shared/index.jsx";
import { useAuth } from "../../../contexts/AuthContext";

const { Sider, Header, Content } = Layout;
const { confirm } = Modal;
const { Text } = Typography;

const items = [
  {
    key: "/app/admin/dashboard",
    label: "Dashboard",
    icon: <DashboardOutlined />,
  },
  {
    key: "/app/admin/report",
    label: "Reports",
    icon: <BarChartOutlined />,
  },
  {
    key: "/app/admin/users",
    label: "Users",
    icon: <UserOutlined />,
  },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const handleNavigate = (menu) => {
    navigate(menu.key);
  };

  const { session, logout, isLoading } = useAuth();

  const showLogoutConfirm = () => {
    confirm({
      title: "Are you sure you want to logout?",
      icon: <ExclamationCircleOutlined />,
      content: "You will be redirected to the login page.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        logout();
      },
    });
  };

  if (isLoading || !session) return <Loader />;

  return (
    <Layout className="!min-h-screen">
      <Sider 
        trigger={null} 
        collapsible 
        collapsed={collapsed}
        theme="dark"
        className="shadow-lg"
      >
        <div className="flex flex-col items-center justify-center my-8 transition-all duration-300">
          <Avatar 
            size={collapsed ? 40 : 80} 
            src="/exp-img.jpg" 
            className="border-2 border-blue-500 shadow-md mb-4"
          />
          {!collapsed && (
            <div className="text-center px-4">
              <div className="!text-white !font-bold block capitalize text-base truncate w-full">
                {session?.fullname || "User"}
              </div>
              <div className="!text-white !font-bold text-xs uppercase tracking-widest mt-1">
                {session?.role || "Member"}
              </div>
            </div>
          )}
        </div>

        <Menu
          selectedKeys={[pathname]}
          theme="dark"
          items={items}
          onClick={handleNavigate}
          className="mt-4 border-none"
        />
      </Sider>

      <Layout className="bg-[#f0f2f5]">
        <Header className="flex items-center justify-between !px-6 !bg-white !shadow-sm !h-16">
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            icon={<MenuOutlined />}
            className="text-lg hover:text-blue-500 transition-colors"
          />
          <div className="flex items-center gap-4">
            <div className="hidden sm:inline text-gray-500">
              Welcome back, <span className="!font-bold !text-gray-800 capitalize">{session?.fullname}</span>
            </div>
            <Button 
              type="text"
              danger
              icon={<LogoutOutlined />} 
              onClick={showLogoutConfirm}
              className="hover:bg-red-50"
            >
              Logout
            </Button>
          </div>
        </Header>

        <Content className="overflow-auto">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;