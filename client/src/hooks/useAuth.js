import { useCallback, useState, useEffect } from "react";
const storageName = "userData";

export const useAuth = () => {
  // const history = useHistory();
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [userLastName, setUserLastName] = useState("");

  const login = useCallback((jwtToken, id, role, name, last_name) => {
    setToken(jwtToken);
    setUserId(id);
    setUserRole(role);
    setUserName(name);
    setUserLastName(last_name);
    console.log(jwtToken, id, role, name, last_name);
    localStorage.setItem(
      storageName,
      JSON.stringify({
        userId: id,
        userRole: role,
        token: jwtToken,
        userName: name,
        userLastName: last_name,
      })
    );
    // history.push("/data");
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setUserRole(null);
    setUserName(null);
    setUserLastName(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));
    console.log(data);
    if (data && data.token) {
      login(
        data.token,
        data.userId,
        data.userRole,
        data.userName,
        data.userLastName
      );
    }
  }, [login]);

  return { login, logout, token, userId, userRole, userName, userLastName };
};
