import React, { useState, useEffect } from "react";
import { auth, createUserDoc } from "../../firebase";

export default function SignUp({ setSignIn }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    window.addEventListener("keypress", handleEnter);
    function handleEnter(e) {
      if (e.keyCode === 13) handleSubmit();
    }
    return () => {
      window.removeEventListener("keypress", handleEnter);
    };
  });

  function handleSubmit() {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        createUserDoc(user, { name, username });
      })
      .catch(function (error) {
        alert(error);
      });
  }

  return (
    <div>
      <div className="AuthForm" onSubmit={handleSubmit}>
        <h1>Pet Feed</h1>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          required
        />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button className="AuthFormButton" type="submit" onClick={handleSubmit}>
          Sign Up
        </button>
      </div>
      <div className="AuthAlt">
        Already have an account?{" "}
        <button onClick={() => setSignIn(true)}>Sign In</button>
      </div>
    </div>
  );
}