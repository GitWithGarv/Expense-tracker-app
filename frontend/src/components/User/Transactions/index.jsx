import { Card, Button, Input, Table, Tag, Space, Tooltip, Select, Form, Modal, message, DatePicker } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";

const { Item } = Form;

const Transactions = () => {
    const [transactionForm] = Form.useForm();

    const [edit, setEdit] = useState(null);
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        setLoading(true);
        // Simulate an API call
        setTimeout(() => {
            message.success("Transaction added successfully!");
            setLoading(false);
            setModal(false);
            transactionForm.resetFields();
        }, 1000);
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
        },
        {
            title: 'Action',
            key: 'action',
            render: () => (
                <Space size="small">
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined style={{ color: '#52c41a' }} />}
                            className="bg-green-50 hover:bg-green-100"
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                            className="bg-red-50 hover:bg-red-100"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const data = [
        {
            key: '1',
            type: 'Debit',
            title: 'Lunch at Restaurant',
            amount: 1200,
            paymentMethod: 'Credit Card',
            notes: 'Business meeting with client',
            date: '2024-03-24',
        },
        {
            key: '2',
            type: 'Credit',
            title: 'Salary Deposit',
            amount: 75000,
            paymentMethod: 'Bank Transfer',
            notes: 'Monthly salary for March',
            date: '2024-03-01',
        },
        {
            key: '3',
            type: 'Debit',
            title: 'Groceries',
            amount: 3500,
            paymentMethod: 'UPI',
            notes: 'Monthly grocery shopping',
            date: '2024-03-20',
        },
        {
            key: '4',
            type: 'Debit',
            title: 'Netflix Subscription',
            amount: 649,
            paymentMethod: 'Debit Card',
            notes: 'Monthly subscription fee',
            date: '2024-03-15',
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
                                onClick={()=>setModal(true)}
                            >
                                Add new transaction
                            </Button>
                        </div>
                    }
                >
                    <div style={{ overflowX: 'auto' }}>
                        <Table
                            columns={columns}
                            dataSource={data}
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
                title="Add new transaction"
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
                            className="!font-semibold !text-white !bg-blue-500"
                        >
                            Submit
                        </Button>
                    </Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Transactions;