import { useDispatch } from "react-redux";
import "./App.css";
import { Header } from "./components/Header/Header";
import { AuthContext } from "./context/authContext";
import { useAuth } from "./hooks/authHook";
import { useRoutes } from "./routes";
import { useHttp } from "./hooks/httpHook";
import { useEffect } from "react";
import { addRequest } from "./redux/slices/requestsSlice";
import { backend_url } from "./consts";

function App() {
  const { token, login, logout, userId } = useAuth();
  const isAuthentificated = !!token;
  const routes = useRoutes(isAuthentificated);

  const { request, loading, error } = useHttp();

  const userStorageData = JSON.parse(localStorage.getItem("userData"));

  const dispatch = useDispatch();

  const fetchUserData = async () => {
    const userData = await request(
      `${backend_url}/api/user/${userStorageData.userId}`,
      "GET"
    );
    dispatch(addRequest(userData.requests));
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        login,
        logout,
        isAuthentificated,
      }}
    >
      <div className="app">
        <Header isAuthentificated={isAuthentificated} />
        {routes}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
