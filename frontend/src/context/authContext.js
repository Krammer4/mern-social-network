import { createContext } from "react";

function placeholder() {}

export const AuthContext = createContext({
  token: null,
  userId: null,
  login: placeholder,
  logout: placeholder,
  isAuthenticated: false,
});
