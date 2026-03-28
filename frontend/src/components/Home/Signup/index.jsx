import React, { useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import { LockOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import Homelayout from "../../../layout/Homelayout";
import {toast} from "react-toastify";
import { http } from "../../../utils/http";
import { useAuth } from "../../../contexts/AuthContext";
import { useEffect } from "react";


const { Item } = Form;

const Signup = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [otp, setOtp] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      const { email } = values;
      const { data } = await http.post("/api/user/send-mail", { email });

      message.success(
        data.message || "OTP sent successfully"
      );
      console.log("send-mail response", data);
      setOtp(data.otp);
      setFormData(values);
    } catch (error) {
      console.error(error);
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      message.error(errMsg);
      setOtp(null);
      setFormData(null);
    } finally {
      setLoading(false);
    }
  };

  const onSignup = async (values) => {
    try {
      setLoading(true);

      // call the signupWithOTP endpoint
      const { data } = await http.post("/api/user/signUp", {
        ...formData, // fullname, mobile, email, password from first form
        otp: values.otp, // OTP from second form
      });

      message.success(data.message || "Signup successful!");
      console.log("signupWithOTP response", data);

      // clear form and OTP
      setOtp(null);
      setFormData(null);

      // redirect to login
      navigate("/");
    } catch (error) {
      console.error(error);
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
      message.error(errMsg);
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
              Track Your Expense
            </h2>
            {otp ? (
              <Form name="login-form" layout="vertical" onFinish={onSignup}>
                <Item
                  name="otp"
                  label="OTP"
                  rules={[{ required: true }]}
                >
                  <Input.OTP />
                </Item>

                <Item>
                  <Button
                    loading={loading}
                    type="text"
                    htmlType="submit"
                    block
                    className="bg-[#FF735C]! text-white! font-bold!"
                  >
                    Verify now
                  </Button>
                </Item>
              </Form>
            ) : (
              <Form name="login-form" layout="vertical" onFinish={onFinish}>
                <Item
                  name="fullname"
                  label="Full Name"
                  rules={[{ required: true }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Full Name" />
                </Item>

                <Item
                  name="mobile"
                  label="Mobile Number"
                  rules={[{ required: true }]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Mobile Number"
                  />
                </Item>

                <Item
                  name="email"
                  label="Username"
                  rules={[{ required: true }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Username" />
                </Item>

                <Item
                  name="password"
                  label="Password"
                  rules={[{ required: true }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Password"
                  />
                </Item>

                <Item>
                  <Button
                    loading={loading}
                    type="text"
                    htmlType="submit"
                    block
                    className="bg-[#FF735C]! text-white! font-bold!"
                  >
                    SignUp
                  </Button>
                </Item>
              </Form>
            )}

            <div className="flex items-center justify-center">
              <div></div>

              <Link
                style={{ textDecoration: "underline" }}
                to="/"
                className="text-[#FF735C]! font-bold!"
              >
                Already have an account?
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </Homelayout>
  );
};

export default Signup;
