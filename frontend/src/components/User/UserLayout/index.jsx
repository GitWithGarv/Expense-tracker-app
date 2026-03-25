import { Image, Layout, Menu, Button, Modal, Avatar, Typography } from "antd";
import {
  BarChartOutlined,
  MenuOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
  DashboardOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Loader from "../../Shared";
import { useAuth } from "../../../contexts/AuthContext";

const { Sider, Header, Content } = Layout;
const { confirm } = Modal;
const { Text } = Typography;

const items = [
  {
    key: "/app/user/dashboard",
    label: "Dashboard",
    icon: <DashboardOutlined />,
  },
  {
    key: "/app/user/report",
    label: "Reports",
    icon: <BarChartOutlined />,
  },
  {
    key: "/app/user/transactions",
    label: "Transactions",
    icon: <DollarOutlined />,
  },
];

const UserLayout = () => {
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
            <div className="text-center">
              <Text strong className="text-white block">{session?.fullname || "User"}</Text>
              <Text type="secondary" className="text-xs text-blue-300">{session?.role || "Member"}</Text>
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
            <Text type="secondary" className="hidden sm:inline">Welcome back, <strong>{session?.fullname}</strong></Text>
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

export default UserLayout;