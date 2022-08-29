import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "./AppContextProvider";
import { fetchApi } from "./utils/fetchApi";

const Authorized = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser } = useAppContext();
  const [isFetchingUser, setIsFetchingUser] = useState(false);
  const [fetchingUserError, setFetchingUserError] = useState(false);
  const navigate = useNavigate();

  const fetchUser = async () => {
    setIsFetchingUser(true);
    const res = await fetchApi("GET", "/Auth/user");

    if (res.ok) {
      setUser(res.data);
    } else {
      setFetchingUserError(true);
    }

    setIsFetchingUser(false);
  };

  useEffect(() => {
    if (!user) fetchUser();
  }, [user]);

  useEffect(() => {
    if (!user && fetchingUserError) {
      navigate("/signin", { replace: true });
    }

    if (user && !fetchingUserError && !isFetchingUser) {
      navigate("/", { replace: true });
    }
  }, [user, isFetchingUser, fetchingUserError]);

  if (isFetchingUser) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return user && !isFetchingUser && !fetchingUserError ? (
    <>{children}</>
  ) : (
    <></>
  );
};

export default Authorized;
