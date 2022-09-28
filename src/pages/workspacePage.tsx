import { UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Collapse,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  Radio,
  Space,
  Table,
} from "antd";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../AppContextProvider";
import { fetchApi } from "../utils/fetchApi";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import clsx from "clsx";
import { isErrored } from "stream";
import OrderBook from "../components/OrderBook/OrderBook";
const baseUrl = process.env.REACT_APP_API_URL;

const WorkspacePage = () => {
  const { setUser, user } = useAppContext();
  const [orderType, setOrderType] = useState<"MarketOrder" | "LimitOrder">(
    "MarketOrder"
  );

  const [form] = Form.useForm();

  const onFormFinish = async (data: any) => {
    const { side, quantity, price } = data;

    const res = await fetchApi("POST", "/Orders", {
      body: {
        orderType,
        orderSide: side,
        quantity: quantity,
        price: price,
      },
    });

    if (!res.ok) {
      toast.error("błąd podczas składania zlecenia");
    }

    form.resetFields();
  };

  const menu = (
    <Menu
      items={[
        {
          label: user?.email ?? "",
          key: 0,
          disabled: true,
        },
        {
          type: "divider",
        },
        {
          label: "Wyloguj",
          key: 1,
          onClick: async (e) => {
            const res = await fetchApi("POST", "/Auth/logout");
            if (res.ok) {
              setUser(undefined);
            }
          },
        },
      ]}
    />
  );

  return (
    <div className="h-screen grid grid-rows-[70px_65%_auto] gap-y-[20px] ">
      <header className="flex justify-center items-center shadow-md relative">
        <h1 className="font-semibold text-[24px] leading-none">
          Exchange Market Simulator
        </h1>
        <div className="flex gap-[40px] absolute bottom-[50%] translate-y-[50%] right-[20px]">
          <div className="flex flex-col leading-none gap-[5px]">
            {/* <div className="flex items-center gap-[10px] text-[16px]">
              <span className="font-semibold">Stan konta:</span>
              <span
                className={clsx(
                  "font-bold",
                  user?.accountBalance && "text-green-400"
                )}
              >
                {user?.accountBalance} zł
              </span>
            </div>
            <div className="flex items-center gap-[10px] text-[16px]">
              <span className="font-semibold">
                Posiadane akcje: {user?.ownedStocksAmount}
              </span>
            </div> */}
          </div>
          <Dropdown overlay={menu} trigger={["click"]} arrow>
            <Avatar
              size={34}
              icon={<UserOutlined />}
              className="hover:cursor-pointer"
            />
          </Dropdown>
        </div>
      </header>
      <main className="mx-[20px] grid grid-cols-[20%_1fr] grid-rows-[1fr] gap-x-[20px] ">
        <div className="border border-gray-100">
          <div className="border-gray-200 border-b px-[10px] py-[5px]">
            <h5 className="text-[18px] m-0 font-semibold">Nowe zlecenie</h5>
          </div>
          <div className="flex items-center justify-center p-[20px]">
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              options={[
                { label: "Po cenie rynkowej", value: "MarketOrder" },
                { label: "Z limitem", value: "LimitOrder" },
              ]}
            />
          </div>
          <div className="px-[20px]">
            <Form
              form={form}
              name="basic"
              layout="vertical"
              onFinish={onFormFinish}
              labelCol={{
                span: 4,
              }}
              initialValues={{
                side: "buy",
              }}
            >
              {orderType === "LimitOrder" && (
                <Form.Item
                  label="Cena"
                  name="price"
                  rules={[
                    {
                      required: true,
                      message: "To pole jest wymagane",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Cena"
                    type="number"
                    min={0}
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>
              )}

              <Form.Item
                label="Ilość"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: "To pole jest wymagane",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Ilość"
                  type="number"
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>

              <Form.Item label="Typ:" name="side">
                <Radio.Group>
                  <Space direction="vertical">
                    <Radio value={"buy"}>Kup</Radio>
                    <Radio value={"sell"}>Sprzedaj</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>

              <Form.Item className="flex items-center justify-center">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="max-w-[300px] min-w-[200px]"
                >
                  Złóż zlecenie
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className="border border-gray-100 overflow-auto relative">
          <OrderBook />
        </div>
      </main>
      <div className="border-gray-100 border mx-[20px] mb-[20px]">
        <Table
          size="small"
          locale={{
            emptyText: (
              <span className="mt-[20px] block text-[18px] text-gray-300">
                Brak aktywnych zleceń
              </span>
            ),
          }}
          columns={[
            { title: "Zlecenie", dataIndex: "order", key: "order" },
            { title: "Typ", dataIndex: "type", key: "type" },
            { title: "Czas", dataIndex: "time", key: "time" },
            { title: "Ilość", dataIndex: "quantity", key: "quantity" },
            { title: "Cena", dataIndex: "price", key: "price" },
            { title: "Profit", dataIndex: "profit", key: "profit" },
          ]}
        />
      </div>
    </div>
  );
};

export default WorkspacePage;
