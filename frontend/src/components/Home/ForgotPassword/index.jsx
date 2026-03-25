import React, { useState } from "react";
import { Card, Form, Input, Button } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import Homelayout from "../../../layout/Homelayout";
import { useEffect } from "react";
import {http} from "../../../utils/http";

const { Item } = Form;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [forgotForm] = Form.useForm();
  const [rePasswordForm] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const tok = params.get("token");
    if (tok) {
      setToken(tok);
    } else {
      setToken(null);
    }
  }, [params]);

  const checkToken = async (tok) => {
    try {
      await http.post(
        "/api/user/verify-token",
        {},
        {
          headers: {
            Authorization: `Bearer ${tok}`,
          },
        },
      );
      setToken(tok);
    } catch {
      setToken(null);
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { email } = values;
      const { data } = await http.post("/api/user/forgot-password", {
        email,
      });
      toast.success(data.message || "Reset link sent to your email");
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

  const onChangePassword = async (values) => {
    try {
      if (values.password !== values.rePassword) {
        return toast.warning("Passwords do not match");
      }

      setLoading(true);

      await http.put(
        "/api/user/change-password",
        { password: values.password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Password changed successfully");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Homelayout>
      <div className="flex">
        <div className="w-1/2 hidden md:flex items-center justify-center">
          <img src="/exp-img.jpg" alt="Bank" className="w-4/5 object-contain" />
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center p-2 md:p-6 bg-white">
          <Card className="w-full max-w-sm shadow-xl">
            <h2 className="font-bold text-[#FF735C] text-2xl text-center mb-6">
              {token ? "Change Password" : "Forgot Password"}
            </h2>

            {token ? (
              <Form
                name="login-form"
                layout="vertical"
                onFinish={onChangePassword}
                form={rePasswordForm}
              >
                <Item
                  name="password"
                  label="Password"
                  rules={[{ required: true }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter your Password"
                  />
                </Item>

                <Item
                  name="rePassword"
                  label="Re Enter Password"
                  rules={[{ required: true }]}
                >
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
                    Change Password
                  </Button>
                </Item>
              </Form>
            ) : (
              <Form
                name="login-form"
                layout="vertical"
                onFinish={onFinish}
                form={forgotForm}
              >
                <Item name="email" label="Email" rules={[{ required: true }]}>
                  <Input prefix={<UserOutlined />} placeholder="Email" />
                </Item>

                <Item>
                  <Button
                    type="text"
                    htmlType="submit"
                    block
                    className="bg-[#FF735C]! text-white! font-bold!"
                    loading={loading}
                  >
                    Submit
                  </Button>
                </Item>
              </Form>
            )}

            <div className="flex items-center justify-center">
              <Link
                style={{ textDecoration: "underline" }}
                to="/"
                className="text-[#FF735C]! font-bold!"
              >
                Sign in
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
    </Homelayout>
  );
};

export default ForgotPassword;
