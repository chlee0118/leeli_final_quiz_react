import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "./client";
import * as client from "./client";
export default function Signin() {
  const [credentials, setCredentials] = useState<User>({ _id: "",
    username: "", password: "", firstName: "", lastName: "", role: "USER"
  });
  const navigate = useNavigate();
  const signin = async () => {
    await client.signin(credentials);
    navigate("/Kanbas/Account/Profile");
  };
  const signup = async () => {navigate("/Kanbas/Account/Signup");};
  return (
    <div>
      <h1>Signin</h1>
      <input style={{marginBottom:10}} value={credentials.username} onChange={(e) =>
        setCredentials({ ...credentials, username: e.target.value })} placeholder="username"/>
    <br />
      <input style={{marginBottom:10}} type="password" value={credentials.password} onChange={(e) =>
        setCredentials({ ...credentials, password: e.target.value })} placeholder="password"/>
    <br />
      <button style={{marginBottom:10}} className="btn btn-primary" onClick={signin}> Signin </button>
    <br />
      <button className="btn btn-primary" onClick={signup}> Go to Signup </button>
    </div>
  );
}

