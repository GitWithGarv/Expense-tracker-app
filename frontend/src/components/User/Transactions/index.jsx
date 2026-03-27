import { Card, Button, Input, Table, Tag, Space, Tooltip, Select, Form, Modal, message, DatePicker } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import { http } from "../../../utils/http";
import useSWR from "swr";
import { fetcher } from "../../../utils/fetcher";

const { Item } = Form;

const Transactions = () => {
    const [transactionForm] = Form.useForm();
    const { data: transactions, error, mutate } = useSWR("/api/transactions", fetcher);

    const [edit, setEdit] = useState(null);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            if (edit) {
                await http.put(`/api/transactions/${edit._id}`, values);
                message.success("Transaction updated successfully!");
            } else {
                await http.post("/api/transactions", values);
                message.success("Transaction added successfully!");
            }
            mutate();
            setModal(false);
            transactionForm.resetFields();
        } catch (error) {
            message.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (record) => {
        setEdit(record);
        transactionForm.setFieldsValue({
            ...record,
            date: dayjs(record.date),
        });
        setModal(true);
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: "Do you want to delete the transaction?",
            content: "This action cannot be undone.",
            okText: "Yes, Delete",
            okType: "danger",
            cancelText: "No",
            onOk: async () => {
                try {
                    await http.delete(`/api/transactions/${id}`);
                    message.success("Transaction deleted successfully!");
                    mutate();
                } catch (error) {
                    message.error(error?.response?.data?.message || "Something went wrong");
                }
            },
        });
    };


    const columns = [
        {
            title: 'Transaction Type',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (
                <Tag color={type === 'Credit' ? 'green' : 'red'}>
                    {type}
                </Tag>
            )
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => <span className="font-bold">₹{amount}</span>
        },
        {
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
        },
        {
            title: 'Notes',
            dataIndex: 'notes',
            key: 'notes',
            ellipsis: true,
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => dayjs(date).format('YYYY-MM-DD'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined style={{ color: '#52c41a' }} />}
                            className="bg-green-50 hover:bg-green-100"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                            className="bg-red-50 hover:bg-red-100"
                            onClick={() => handleDelete(record._id)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className="p-4 md:p-6">
                <Card
                    title={<span className="text-lg font-bold">Transaction List</span>}
                    className="shadow-sm rounded-lg"
                    extra={
                        <div className="flex flex-col md:flex-row gap-3">
                            <Input
                                placeholder="Search by all"
                                prefix={<SearchOutlined />}
                                className="w-full md:w-64"
                            />
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                className="!font-bold bg-blue-600 hover:bg-blue-700 border-none h-10 px-6 rounded-md"
                                onClick={() => {
                                    setEdit(null);
                                    transactionForm.resetFields();
                                    setModal(true);
                                }}
                            >
                                Add new transaction
                            </Button>
                        </div>
                    }
                >
                    <div style={{ overflowX: 'auto' }}>
                        <Table
                            columns={columns}
                            dataSource={transactions || []}
                            rowKey="_id"
                            loading={!transactions && !error}
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                position: ['bottomRight']
                            }}
                            className="mt-2"
                        />
                    </div>
                </Card>
            </div>
            <Modal
                open={modal}
                onCancel={() => setModal(false)}
                title={edit ? "Edit transaction" : "Add new transaction"}
                footer={null}
            >
                <Form
                    layout="vertical"
                    form={transactionForm}
                    onFinish={onFinish}
                >
                    <div className="grid md:grid-cols-2 gap-x-3">
                        <Item
                            label="Transaction Type"
                            name="type"
                            rules={[{ required: true }]}
                        >
                            <Select
                                placeholder="Transaction Type"
                                options={[
                                    { label: "Credit", value: "Credit" },
                                    { label: "Debit", value: "Debit" },
                                ]}
                            />
                        </Item>
                        <Item
                            label="Amount"
                            name="amount"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="Enter amount" type="number" prefix="₹" />
                        </Item>
                        <Item
                            label="Title"
                            name="title"
                            rules={[{ required: true }]}
                        >
                            <Input placeholder="Enter title" />
                        </Item>
                        <Item
                            label="Payment Method"
                            name="paymentMethod"
                            rules={[{ required: true }]}
                        >
                            <Select
                                placeholder="Payment Method"
                                options={[
                                    { label: "Cash", value: "Cash" },
                                    { label: "Online (UPI/Card)", value: "Online" },
                                    { label: "Bank Transfer", value: "Bank Transfer" },
                                ]}
                            />
                        </Item>
                        <Item
                            label="Transaction Date"
                            name="date"
                            initialValue={dayjs()}
                            rules={[{ required: true }]}
                        >
                            <DatePicker className="w-full" />
                        </Item>
                    </div>
                    <Item
                        label="Notes"
                        name="notes"
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea placeholder="potato, tomato, etc" />
                    </Item>
                    <Item className="flex justify-end items-center">
                        <Button
                            loading={loading}
                            type="text"
                            htmlType="submit"
                            className={`!font-semibold !text-white ${edit ? "!bg-red-500 hover:!bg-red-600" : "!bg-blue-500 hover:!bg-blue-600"}`}
                        >
                            {edit ? "Update" : "Submit"}
                        </Button>
                    </Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Transactions;