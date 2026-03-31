import { Card, Button, Table, Tag, Space, Tooltip, Modal, message, Switch, Avatar, Typography } from "antd";
import { UserOutlined, DeleteOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import { http } from "../../../utils/http";
import useSWR from "swr";
import { fetcher } from "../../../utils/fetcher";

const { Text } = Typography;

const Users = () => {
    const { data: users, error, mutate } = useSWR("/api/user/all-users", fetcher);
    const [loading, setLoading] = useState(false);

    const toggleStatus = async (id) => {
        try {
            setLoading(true);
            const { data } = await http.patch(`/api/user/toggle-status/${id}`);
            message.success(data.message);
            mutate();
        } catch (error) {
            message.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: "Are you sure you want to delete this user?",
            content: "This will permanently remove the user and all their data.",
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: "No",
            onOk: async () => {
                try {
                    await http.delete(`/api/user/${id}`);
                    message.success("User deleted successfully!");
                    mutate();
                } catch (error) {
                    message.error(error?.response?.data?.message || "Something went wrong");
                }
            },
        });
    };

    const columns = [
        {
            title: 'User',
            dataIndex: 'fullname',
            key: 'fullname',
            render: (text, record) => (
                <Space>
                    <Avatar icon={<UserOutlined />} className="bg-blue-500" />
                    <div className="flex flex-col">
                        <Text strong className="capitalize">{text}</Text>
                        <Text type="secondary" className="text-xs">{record.email}</Text>
                    </div>
                </Space>
            )
        },
        {
            title: 'Mobile',
            dataIndex: 'mobile',
            key: 'mobile',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color={role === 'admin' ? 'purple' : 'blue'} className="uppercase font-bold">
                    {role}
                </Tag>
            )
        },
        {
            title: 'Joined On',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => dayjs(date).format('YYYY-MM-DD'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Tag color={status ? "green" : "red"}>
                    {status ? "ACTIVE" : "INACTIVE"}
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title={record.status ? "Hide Data / Deactivate" : "Show Data / Activate"}>
                        <Switch
                            checked={record.status}
                            onChange={() => toggleStatus(record._id)}
                            loading={loading}
                            checkedChildren={<EyeOutlined />}
                            unCheckedChildren={<EyeInvisibleOutlined />}
                        />
                    </Tooltip>
                    <Tooltip title="Delete User">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            className="bg-red-50 hover:bg-red-100"
                            onClick={() => handleDelete(record._id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-4 md:p-8">
            <Card
                title={<span className="text-xl font-bold">User Management</span>}
                className="shadow-md rounded-xl"
            >
                <div style={{ overflowX: 'auto' }}>
                    <Table
                        columns={columns}
                        dataSource={users || []}
                        rowKey="_id"
                        loading={!users && !error}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            position: ['bottomRight']
                        }}
                    />
                </div>
            </Card>
        </div>
    );
};

export default Users;