import React from "react";
import  { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Link } from "react-router-dom";

import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "../services/api";

const login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login,error,isLoading} = useLogin()

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(email,password)
    //navigate('/home')
  };


  const responseGoogle = async (authResult) => {
		try {
			if (authResult["code"]) {
				console.log(authResult.code);
				const result = await googleAuth(authResult.code);
				props.setUser(result.data.data.user);
				alert("successfuly logged in");
			} else {
				console.log(authResult);
				throw new Error(authResult);
			}
		} catch (e) {
			console.log(e);
		}
	};

  const googleLogin = useGoogleLogin({
		onSuccess: responseGoogle,
		onError: responseGoogle,
		flow: "auth-code",
	});
  

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

      <button
            style={{
              padding: "10px 20px",
            }}
            onClick={googleLogin}
          >
            Sign in with Google
          </button>

      <button disabled={isLoading}>Login</button>

      <br></br>
      <br></br>

      <div>  
            <Link className="link" to="/signup">Don't have an account? <span>Sign Up</span></Link>
      </div>
    </form>
  );
};

export default login;
