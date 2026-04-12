import React from "react";
import { Card, Row, Col, Typography, Spin, Empty } from "antd";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import useSWR from "swr";
import { fetcher } from "../../../utils/fetcher";

const { Title, Text } = Typography;

const COLORS = {
  "Credit (Cash)": "#28a745",
  "Credit (Online)": "#20c997",
  "Debit (Cash)": "#dc3545",
  "Debit (Online)": "#fd7e14",
};

const Report = () => {
  const { data: testData } = useSWR("/api/dashboard/test", fetcher);
  console.log("Test Data:", testData);
  const { data, error, isLoading } = useSWR("/api/dashboard/detailed-report", fetcher);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="Loading reports..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="shadow-md border-l-4 border-red-500">
          <div className="flex flex-col gap-2">
            <Text type="danger" strong className="text-lg">Failed to load report data.</Text>
            <Text type="secondary">{error?.response?.data?.message || error?.message || "Please try again later."}</Text>
          </div>
        </Card>
      </div>
    );
  }

  const chartConfigs = [
    { title: "Last 30 Days", data: data?.last30 || [] },
    { title: "Last 7 Days", data: data?.last7 || [] },
    { title: "Last 24 Hours", data: data?.last1 || [] },
  ];

  const renderChart = (config) => (
    <Col xs={24} lg={8} key={config.title}>
      <Card 
        title={<Title level={4} className="m-0 text-center">{config.title}</Title>}
        className="shadow-md rounded-xl hover:shadow-lg transition-shadow duration-300"
        style={{ height: "100%" }}
      >
        {config.data.length > 0 ? (
          <div style={{ width: "100%", height: 400 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={config.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {config.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || "#8884d8"} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `₹${value.toLocaleString()}`}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <Empty description="No data for this period" />
          </div>
        )}
      </Card>
    </Col>
  );

  return (
    <div className="p-4 md:p-8 bg-[#f8f9fa] min-h-screen">
      <div className="mb-8">
        <Title level={2} className="text-gray-800">Financial Insights</Title>
        <Text type="secondary">Detailed breakdown of your credit and debit flows</Text>
      </div>

      <Row gutter={[24, 24]}>
        {chartConfigs.map(renderChart)}
      </Row>

      <Row className="mt-12">
        <Col span={24}>
          <Card className="shadow-sm rounded-xl border-l-4 border-blue-500">
            <Title level={4}>Legend & Insights</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#28a745]" />
                  <Text>Credit (Cash)</Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#20c997]" />
                  <Text>Credit (Online)</Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#dc3545]" />
                  <Text>Debit (Cash)</Text>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#fd7e14]" />
                  <Text>Debit (Online)</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Report;