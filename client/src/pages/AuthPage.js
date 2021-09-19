import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth.context";
import { useHttp } from "../hooks/useHttp";
import { useMessage } from "../hooks/useMessage";

const AuthPage = () => {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const { loading, error, request, clearError } = useHttp();
  const [form, setForm] = useState({ login: "", password: "" });

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const logInHandler = () => {
    try {
      const data = request("/api/auth/login", "POST", { ...form });
      console.log(data);
      auth.login(
        data.token,
        data.userId,
        data.userRole,
        data.userName,
        data.userLastName
      );
    } catch (e) {}
  };
  return (
    <>
      <h1>Auth Page</h1>
      <input
        placeholder="Enter login"
        type="login"
        // id="login"
        value={form.login}
        onChange={changeHandler}
        name="login"
      />
      <input
        className="browser-default"
        placeholder="Enter password"
        type="password"
        value={form.password}
        onChange={changeHandler}
        name="password"
      />
      <button onClick={logInHandler} disabled={loading}>
        GOGOGO
      </button>
    </>
  );
};

export default AuthPage;
