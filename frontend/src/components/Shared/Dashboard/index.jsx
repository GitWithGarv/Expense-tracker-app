import React from "react";
import { Row, Col, Card, Statistic, Typography, Spin } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  TransactionOutlined,
  WalletOutlined,
  CalendarOutlined,
  DotChartOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import useSWR from "swr";
import { fetcher } from "../../../utils/fetcher";

const { Title, Text } = Typography;

const Dashboard = () => {
  const { data: report, error, isLoading } = useSWR("/api/dashboard/report", fetcher);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Text type="danger">Error loading dashboard data. Please try again later.</Text>
      </div>
    );
  }

  const { summary, chartData } = report || { summary: {}, chartData: [] };
  
  const StatCard = ({ title, value, estimate, icon, color, bgColor }) => (
    <Card bordered={false} className="shadow-sm rounded-xl overflow-hidden">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl ${bgColor}`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <Text strong className={`text-sm ${color}`}>{title}</Text>
            <Text className={`text-xl font-bold ${color}`}>{value}</Text>
          </div>
          <div className="flex items-center justify-between">
            <Text type="secondary" className="text-xs">{estimate} Estimate</Text>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="p-4 md:p-8 bg-[#f8f9fa] min-h-screen">
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard 
            title="Transaction"
            value={`${summary.totalTransactions} T`}
            estimate={`${summary.totalTransactions} T`}
            icon={<DotChartOutlined />}
            color="text-[#e91e63]"
            bgColor="bg-[#e91e63]"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard 
            title="Total Credit"
            value={`${summary.totalCredit} ₹`}
            estimate={`${summary.totalCredit} ₹`}
            icon={<PlusCircleOutlined />}
            color="text-[#28a745]"
            bgColor="bg-[#28a745]"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard 
            title="Total Debit"
            value={`${summary.totalDebit} ₹`}
            estimate={`${summary.totalDebit} ₹`}
            icon={<MinusCircleOutlined />}
            color="text-[#fd7e14]"
            bgColor="bg-[#fd7e14]"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard 
            title="Balance"
            value={`${summary.balance} ₹`}
            estimate={`${summary.balance} ₹`}
            icon={<WalletOutlined />}
            color="text-[#6f42c1]"
            bgColor="bg-[#6f42c1]"
          />
        </Col>
      </Row>

      <Row className="mt-8">
        <Col span={24}>
          <Card 
            bordered={false} 
            className="shadow-md rounded-xl"
            title={
              <div className="flex items-center gap-2 py-2">
                <CalendarOutlined className="text-blue-500" />
                <Title level={5} style={{ margin: 0 }}>Daily Transaction Summary (Last 30 Days)</Title>
              </div>
            }
          >
            <div style={{ width: "100%", height: 400 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1890ff" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#1890ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#8c8c8c' }}
                    minTickGap={30}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#8c8c8c' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#1890ff" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorAmt)" 
                    dot={{ r: 5, fill: "#fff", stroke: "#1890ff", strokeWidth: 3 }}
                    activeDot={{ r: 7 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
