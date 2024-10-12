import React from "react";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Link } from "react-router-dom";
import GoogleBtn from "../GoogleBtn";

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(email, password);
    //navigate('/home')
  };

  return (
    <form className="login" onSubmit={handleSubmit} action="">
      <h3>Login</h3>
      {error && <div className="error">{error}</div>}
      <label htmlFor="">Email</label>
      <input
        type="email"
        name=""
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <label htmlFor="">Password</label>
      <input
        type="password"
        name=""
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />
      <div style={{ display: "flex", alignItems: "center" }}>
        <button disabled={isLoading} style={{ margin: "10px" }}>
          Login
        </button>

        <GoogleBtn />
      </div>
      <br></br>
      <br></br>
      <div>
        <Link className="link" to="/signup">
          Don't have an account? <span>Sign Up</span>
        </Link>
      </div>
    </form>
  );
};

export default login;
