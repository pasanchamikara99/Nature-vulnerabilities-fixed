import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const GoogleBtn = () => {
  const navigate = useNavigate();
  return (
    <div>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          //   console.log(credentialResponse);
          var credentialResponseDecode = jwtDecode(
            credentialResponse.credential
          );

          const email = credentialResponseDecode.email;

          console.log(credentialResponseDecode);

          if (email) {
            const user = {
              user: {
                email: email,
                type: "buyer",
              },
            };

            localStorage.setItem("user", JSON.stringify(user));

            navigate("/");
          }
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </div>
  );
};

export default GoogleBtn;
