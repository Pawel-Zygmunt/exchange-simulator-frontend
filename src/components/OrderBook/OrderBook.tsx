import style from "./OrderBook.module.scss";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import toast from "react-hot-toast";
const baseUrl = process.env.REACT_APP_API_URL;

const items = Array(100)
  .fill(0)
  .map((_, i) => i);

type PriceLevel = {
  bidSide: {
    orders: {
      userId: string;
      quantity: number;
    }[];
    quantity: number;
  };

  askSide: {
    orders: {
      userId: string;
      quantity: number;
    }[];
    quantity: number;
  };
};

type PriceLevels = Record<number, PriceLevel>;

const OrderBook = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [priceLevelsState, setPriceLevelsState] = useState<PriceLevels | null>(
    null
  );

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl(`${baseUrl}/exchangeHub`)
      .withAutomaticReconnect()
      .build();

    setConnection(connect);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on("onOrderAccepted", (message) => {
            console.log("accepted", message);
            toast.success(message, { duration: 5000 });
          });

          connection.on(
            "onPriceLevelSideChange",
            (
              price: number,
              isBidSide: boolean,
              orders: { userId: string; quantity: number }[],
              quantity: number
            ) => {
              console.log(
                "onPriceLevelSideChange",
                price,
                isBidSide,
                orders,
                quantity
              );

              setPriceLevelsState((prev) => {
                const newState = { ...(prev || {}) };
                newState[price] = { ...(newState[price] || {}) };
                const side = isBidSide ? "bidSide" : "askSide";

                newState[price][side] = {
                  orders,
                  quantity,
                };

                return newState;
              });
            }
          );

          connection.on("onRemovePriceLevel", (price, isBidSide) => {
            console.log("onRemovePriceLevel", price, isBidSide);
          });

          connection.on("onCurrentPriceChange", (price) => {
            console.log("onCurrentPriceChange", price);
          });
        })
        .catch((error) => console.log(error));
    }
  }, [connection]);

  const sumOrders = (arr: { amount: number; userId: string }[]) =>
    arr.reduce((prev, curr) => prev + curr.amount, 0);

  return (
    <>
      {!priceLevelsState && (
        <span className="mt-[20px] text-[18px] block text-gray-300 absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%]">
          Książka zleceń jest pusta
        </span>
      )}
      <table className={clsx("w-full relative", style.table)}>
        <thead className="sticky top-0 bg-primary-color text-white z-[999]">
          <tr className="h-[37px]">
            <th style={{ width: "47.5%" }}>Strona BID</th>
            <th style={{ width: "2.5%" }}>Cena</th>
            <th style={{ width: "2.5%" }}>Cena</th>
            <th style={{ width: "47.5%" }}>Strona ASK</th>
          </tr>
        </thead>
        <tbody>
          {priceLevelsState && (
            <>
              {Object.entries(priceLevelsState).map(([key, val], idx) => (
                <tr className="relative" key={`row-${idx}`}>
                  <td>
                    <div className="absolute right-[50%] top-0 left-0 bottom-0 flex">
                      {val.bidSide.orders.map((order, orderIdx) => {
                        // console.log((50 / val.bidSide.quantity) * order.amount);
                        console.log(50 / val.bidSide.quantity);
                        return (
                          <div
                            className={style.order}
                            key={`order-${orderIdx}`}
                            style={{
                              width: `${
                                (100 / val.bidSide.quantity) * order.quantity
                              }%`,
                            }}
                          >
                            {order.quantity}
                          </div>
                        );
                      })}
                    </div>
                    {/* <div
                      className={style.bidIndicator}
                      style={{ width: "100%" }}
                    ></div> */}
                  </td>
                  <td>
                    <span className={style.priceCell}>{key}</span>
                  </td>
                  <td>
                    <span className={style.priceCell}>{key}</span>
                  </td>
                  <td>
                    <div className={style.askIndicator}>
                      {(val?.askSide?.orders || []).map((order, orderIdx) => (
                        <div
                          className="shadow-inner overflow-hidden"
                          key={`order-${orderIdx}`}
                          style={{
                            width: (50 / val.askSide.quantity) * order.quantity,
                          }}
                        >
                          {order.quantity}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </>
  );
};

export default OrderBook;

// w-[${Math.floor(
//   Math.random() * 50 + 1
// )}%]
