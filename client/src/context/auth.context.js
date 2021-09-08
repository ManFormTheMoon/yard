import { createContext } from "react";

function empt() {}

export const AuthContext = createContext({
  token: null,
  userId: null,
  userRole: null,
  userName: null,
  userLastName: null,
  login: empt,
  logout: empt,
  isAuth: false,
});
