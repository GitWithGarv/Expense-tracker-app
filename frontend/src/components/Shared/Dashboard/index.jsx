import React from "react";
import { Row, Col, Card, Statistic, Typography, Spin } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  TransactionOutlined,
  WalletOutlined,
  CalendarOutlined,
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
  
  return (
    <div className="p-2 md:p-6 bg-[#f0f2f5] min-h-screen">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-lg border-l-4 border-[#ff4d4f]">
            <Statistic
              title={<Text strong className="text-[#ff4d4f]"><TransactionOutlined /> Transaction</Text>}
              value={summary.totalTransactions}
              valueStyle={{ color: "#3f3f3f", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-lg border-l-4 border-[#52c41a]">
            <Statistic
              title={<Text strong className="text-[#52c41a]"><ArrowUpOutlined /> Total Credit</Text>}
              value={summary.totalCredit}
              prefix="₹"
              valueStyle={{ color: "#3f3f3f", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-lg border-l-4 border-[#fa8c16]">
            <Statistic
              title={<Text strong className="text-[#fa8c16]"><ArrowDownOutlined /> Total Debit</Text>}
              value={summary.totalDebit}
              prefix="₹"
              valueStyle={{ color: "#3f3f3f", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-lg border-l-4 border-[#1890ff]">
            <Statistic
              title={<Text strong className="text-[#1890ff]"><WalletOutlined /> Balance</Text>}
              value={summary.balance}
              prefix="₹"
              valueStyle={{ color: "#3f3f3f", fontWeight: "bold" }}
            />
          </Card>
        </Col>
      </Row>

      <Row className="mt-6">
        <Col span={24}>
          <Card 
            bordered={false} 
            className="shadow-sm rounded-lg"
            title={
              <div className="flex items-center gap-2 py-2">
                <CalendarOutlined className="text-blue-500" />
                <Title level={5} style={{ margin: 0 }}>Daily Transaction Summary (Last 30 Days)</Title>
              </div>
            }
          >
            <div style={{ width: "100%", height: 350 }}>
              <ResponsiveContainer>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1890ff" stopOpacity={0.1}/>
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
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#1890ff" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorAmt)" 
                    dot={{ r: 4, fill: "#fff", stroke: "#1890ff", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
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
