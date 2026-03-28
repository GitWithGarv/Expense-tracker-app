import React, { useState } from "react";
import { Card, Form, Input, Button } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { http } from "../../../utils/http";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect } from "react";
import { mutate } from "swr";

const { Item } = Form;

const Login = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      if (session.role === "admin") {
        navigate("/app/admin", { replace: true });
      } else {
        navigate("/app/user", { replace: true });
      }
    }
  }, [session, navigate]);

  const [loginForm] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { email, password } = values;
      const { data } = await http.post("/api/user/login", { email, password });
      const { role } = data;
      
      await mutate("/api/user/session");

      if (role === "admin") {
        toast.success("Admin successfully logged in");
        return navigate("/app/admin", { replace: true });
      }
      
      if (role === "user") {
        toast.success(data.message || "User successfully logged in");
        return navigate("/app/user", { replace: true });
      }
      
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
      // message.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <div className="w-1/2 hidden md:flex items-center justify-center">
        <img src="/expense-tracker-logo.png" alt="Bank" className="w-4/5 object-contain" />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-2 md:p-6 bg-white">
        <Card className="w-full max-w-sm shadow-xl">
          <h2 className="font-bold text-[#FF735C] text-2xl text-center mb-6">
            Track Your Expense
          </h2>
          <Form
            name="login-form"
            layout="vertical"
            onFinish={onFinish}
            form={loginForm}
          >
            <Item name="email" label="Username" rules={[{ required: true }]}>
              <Input prefix={<UserOutlined />} placeholder="Username" />
            </Item>

            <Item name="password" label="Password" rules={[{ required: true }]}>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Item>

            <Item>
              <Button
                type="text"
                htmlType="submit"
                block
                className="bg-[#FF735C]! text-white! font-bold!"
                loading={loading}
              >
                Login
              </Button>
            </Item>
          </Form>

          <div className="flex items-center justify-center">
            <Link
              style={{ textDecoration: "underline" }}
              to="/forgot-password"
              className="text-[#FF735C]! font-bold!"
            >
              Forgot Password
            </Link>
            <pre> </pre>

            <Link
              style={{ textDecoration: "underline" }}
              to="/signup"
              className="text-[#FF735C]! font-bold!"
            >
              Don't have an account?
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
