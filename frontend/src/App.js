import "./App.css";
import { Header } from "./components/Header/Header";
import { AuthContext } from "./context/authContext";
import { useAuth } from "./hooks/authHook";
import { useRoutes } from "./routes";

function App() {
  const { token, login, logout, userId } = useAuth();
  const isAuthentificated = !!token;
  const routes = useRoutes(isAuthentificated);
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
