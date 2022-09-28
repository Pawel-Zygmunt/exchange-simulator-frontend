import { Button, Checkbox, Form, Input } from "antd";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { fetchApi } from "../utils/fetchApi";

const SignUpPage = () => {
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setIsSubmittingForm(true);
    const result = await fetchApi("POST", "/Auth/register", { body: values });

    if (result.ok) {
      toast.success("Zarejestrowano pomyślnie", {
        position: "top-center",
        duration: 2000,
      });

      navigate("/signin");
    }

    if (result.errors) {
      const errors = Object.entries(result.errors).map(([key, val], idx) => ({
        name: key,
        errors: val,
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
            Zarejestruj się
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
                message: "Wpisz hasło",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Powtórz hasło"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Potwierdź hasło",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              loading={isSubmittingForm}
              disabled={isSubmittingForm}
            >
              Zarejestruj
            </Button>
          </Form.Item>

          <div>
            <span>Masz konto?</span>
            <Link to="/signin" className="text-sky-blue ml-[10px]">
              Zarejestruj
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignUpPage;
