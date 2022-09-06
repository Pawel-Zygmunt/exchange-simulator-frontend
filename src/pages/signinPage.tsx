import { Button, Checkbox, Form, Input } from "antd";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAppContext } from "../AppContextProvider";
import { fetchApi } from "../utils/fetchApi";

const SignInPage = () => {
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { setUser, user } = useAppContext();

  const fetchUser = async () => {
    const res = await fetchApi("GET", "/Auth/user");

    if (res.ok) {
      setUser(res.data);
    }
  };

  useEffect(() => {
    if (!user) fetchUser();
    if (user) navigate("/", { replace: true });
  }, [user]);

  const onFinish = async (values: any) => {
    setIsSubmittingForm(true);

    const result = await fetchApi("POST", "/Auth/login", { body: values });

    if (result.ok) {
      setUser(result.data);

      toast.success("Zalogowano pomyślnie", {
        position: "top-center",
        duration: 2000,
      });
    }

    if (result.errors) {
      const errors = Object.entries(result.errors).map(([key, val], idx) => ({
        name: key,
        errors: !Array.isArray(val) ? [val] : val,
      }));

      form.setFields(errors);
    }
    setIsSubmittingForm(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-[300px] shadow-lg rounded-xl bg-white p-[20px]">
        <Form
          form={form}
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <h1 className="text-2xl font-bold text-center mb-[25px]">
            Zaloguj się
          </h1>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Podaj swój email",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Hasło"
            name="password"
            rules={[
              {
                required: true,
                message: "Podaj hasło",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="nonFieldErrors" className="input-hidden">
            <Input type="text" style={{ display: "none" }} />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              disabled={isSubmittingForm}
              loading={isSubmittingForm}
            >
              Zaloguj
            </Button>
          </Form.Item>
        </Form>

        <div>
          <span>Nie masz konta?</span>
          <Link to="/signup" className="text-sky-blue ml-[10px]">
            Zarejestruj
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
