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
import { useContext, useState } from "react";
import { useAppContext } from "../AppContextProvider";
import { fetchApi } from "../utils/fetchApi";

const WorkspacePage = () => {
  const [orderType, setOrderType] = useState<"MarketOrder" | "LimitOrder">(
    "MarketOrder"
  );

  const { setUser, user } = useAppContext();

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
    <div className="h-full flex flex-col bg-red">
      <header className="h-[70px] flex justify-center items-center shadow-md relative">
        <h1 className="font-semibold text-[24px] leading-none">
          Exchange Market Simulator
        </h1>
        <Dropdown overlay={menu} trigger={["click"]} arrow>
          <Avatar
            size={34}
            icon={<UserOutlined />}
            className="!absolute bottom-[50%] translate-y-[50%] right-[20px] hover:cursor-pointer"
          />
        </Dropdown>
      </header>
      <main className="flex-1 grid grid-cols-[300px_1fr] xl:grid-cols-[20%_1fr] grid-rows-[70%_1fr] p-[20px] gap-[20px]">
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
              name="basic"
              layout="vertical"
              onFinish={(e) => {}}
              labelCol={{
                span: 4,
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
                  min={0}
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>

              <Form.Item label="Typ:" name="type">
                <Radio.Group defaultValue={"buy"}>
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
        <div className="border border-gray-100">asds</div>
        <div className="col-span-2 border-gray-100 border">
          <Table
            size="small"
            locale={{
              emptyText: (
                <span className="mt-[20px] block">Brak aktywnych zleceń</span>
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
      </main>
    </div>
  );
};

export default WorkspacePage;
