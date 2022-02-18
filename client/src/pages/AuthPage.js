import React, { useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { AuthContext } from "../context/auth.context";
import { useHttp } from "../hooks/useHttp";
import { useMessage } from "../hooks/useMessage";
import logo from "../img/logo.png"
import element from "../img/element.png"
import element2 from "../img/element2.png"
import backAuth from "../img/backAuth4.png"
import { dictinary } from "../dictinary/dictinary";
import '../index.css'
import './auth.css'

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
    {/* <img src={backAuth}
      style={{
        position: "absolute",
        height: "60vh",
        top: "50vh",
        left: "50vw",
        transform: "translate(-50%,-50%)"
      }}
    /> */}
    <img src ={element2} 
      style={{ 
        //height: "10vh",
        width: "100vw",
        position: "absolute",
        left: "50vw",
        top: "50vh",
        transform: "translate(-50%,-50%)"
     }}/>
    <img src={logo}
      style={{
       height:"20vh",
       position: "absolute",
       right: "2vw",
       top: "10vh"
    }}/>
    <div style={{
      height: "100vh", 
      width: "100vw", 
      display: "flex",
      justifyContent: "center",
     // alignItems: "center",
      backgroundColor: "rgb(20,83,83)"   //20, 110,110 
    }}> 
      <div className="main-box">
        <div style={{
          width: "100%",
          height: "30%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <h1 className="title">
              {dictinary.enterLoginPass.ru}
          </h1>
        </div>
        <div className= "style-input">
          <input
            className="input-text"
            placeholder={dictinary.enterLogin.ru}
            type="login"
          // id="login"
            value={form.login}
            onChange={changeHandler}
            name="login"
            
            style={{
           }}/>         
          <input
            className="input-text"
            placeholder={dictinary.enterPass.ru}
            type="password"
            value={form.password}
            onChange={changeHandler}
            name="password"
            style={{
              marginTop:"5%",
             }}/>
        </div>
        <div style={{
          width: "100%",
          height: "20%",
          display: "flex",
          justifyContent: "right"
        }}>  
        <button onClick={logInHandler} disabled={loading} className="button">
          {dictinary.enter.ru}
        </button> 
        </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
