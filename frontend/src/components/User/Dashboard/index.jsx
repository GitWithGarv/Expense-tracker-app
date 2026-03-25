import React from "react";
import { Row, Col, Card, Statistic, Typography, Divider } from "antd";
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

const { Title, Text } = Typography;

const data = [
  { name: "2025-11-24", amount: 35000 },
  { name: "2025-11-26", amount: 75000 },
  { name: "2025-11-28", amount: 12000 },
  { name: "2025-11-30", amount: 3000 },
  { name: "2025-12-02", amount: 28000 },
  { name: "2025-12-04", amount: 15000 },
  { name: "2025-12-06", amount: 32000 },
  { name: "2025-12-08", amount: 18000 },
  { name: "2025-12-10", amount: 38000 },
  { name: "2025-12-12", amount: 15000 },
  { name: "2025-12-14", amount: 42000 },
  { name: "2025-12-16", amount: 28000 },
  { name: "2025-12-18", amount: 48000 },
  { name: "2025-12-20", amount: 32000 },
  { name: "2025-12-22", amount: 38000 },
  { name: "2025-12-23", amount: 12000 },
];

const Dashboard = () => {
  return (
    <div className="p-2 md:p-6 bg-[#f0f2f5] min-h-screen">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-lg border-l-4 border-[#ff4d4f]">
            <Statistic
              title={<Text strong className="text-[#ff4d4f]"><TransactionOutlined /> Transaction</Text>}
              value={100}
              suffix="T"
              valueStyle={{ color: "#3f3f3f", fontWeight: "bold" }}
            />
            <div className="mt-2 p-1 bg-[#ff4d4f10] inline-block rounded">
              <Text type="secondary" className="text-xs">200 Estimate</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-lg border-l-4 border-[#52c41a]">
            <Statistic
              title={<Text strong className="text-[#52c41a]"><ArrowUpOutlined /> Total Credit</Text>}
              value={100}
              suffix="T"
              valueStyle={{ color: "#3f3f3f", fontWeight: "bold" }}
            />
            <div className="mt-2 p-1 bg-[#52c41a10] inline-block rounded">
              <Text type="secondary" className="text-xs">200 Estimate</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-lg border-l-4 border-[#fa8c16]">
            <Statistic
              title={<Text strong className="text-[#fa8c16]"><ArrowDownOutlined /> Total Debit</Text>}
              value={100}
              suffix="T"
              valueStyle={{ color: "#3f3f3f", fontWeight: "bold" }}
            />
            <div className="mt-2 p-1 bg-[#fa8c1610] inline-block rounded">
              <Text type="secondary" className="text-xs">200 Estimate</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-lg border-l-4 border-[#1890ff]">
            <Statistic
              title={<Text strong className="text-[#1890ff]"><WalletOutlined /> Balance</Text>}
              value={100}
              suffix="T"
              valueStyle={{ color: "#3f3f3f", fontWeight: "bold" }}
            />
            <div className="mt-2 p-1 bg-[#1890ff10] inline-block rounded">
              <Text type="secondary" className="text-xs">200 Estimate</Text>
            </div>
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
                <AreaChart data={data}>
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
