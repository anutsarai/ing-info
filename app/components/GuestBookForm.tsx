"use client";

import { useState } from "react";
import Link from "next/link";

type LoginResult = {
  success: boolean;
  message: string;
  user?: {
    id: number;
    username: string;
    role: string;
  };
};

type GuestBookFormProps = {
  addComment: (formData: FormData) => Promise<void>;
  login: (formData: FormData) => Promise<LoginResult>;
  currentUser: CurrentUser | null;
  logout: () => Promise<void>;
};
type CurrentUser = {
  username: string;
  role: string;
};

export default function GuestBookForm(props: GuestBookFormProps) {
  const [activeTab, setActiveTab] = useState("guest");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  function openGuestTab() {
    setActiveTab("guest");
  }

  function openLoginTab() {
    setActiveTab("login");
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const result = await props.login(formData);

    if (result.success === true && result.user !== undefined) {
      setLoginError("");
      setLoginUsername(result.user.username);
      setLoginPassword("");
      window.location.reload();
    } else {
      setLoginError(result.message);
    }
  }

  let guestTabClass = "tab";
  let loginTabClass = "tab";

  if (activeTab === "guest") {
    guestTabClass = "tab active";
  }

  if (activeTab === "login") {
    loginTabClass = "tab active";
  }

  let tabContent = null;

  if (activeTab === "guest") {
    tabContent = (
      <form className="guestbook-form" action={props.addComment}>
        <div className="input-group">
          <label>Your Name</label>

          <input
            name="username"
            type="text"
            placeholder="e.g. Gojo Satoru"
            defaultValue={props.currentUser?.username ?? ""}
            readOnly={props.currentUser !== null}
            required
          />
        </div>

        <div className="input-group">
          <label>Your Message</label>
          <textarea
            name="message"
            rows={5}
            maxLength={300}
            placeholder="Hi Ing! Keep learning!🚀"
            required
          />
        </div>

        <button className="submit-btn" type="submit">
          Leave a Note ✨
        </button>
      </form>
    );
  } else {
    if (props.currentUser !== null) {
      tabContent = (
        <div className="login-box ">
          <p className="login-note">
            You can now edit or delete your own comments.
          </p>

          {/* <form action={props.logout}>
            <button className="logout-btn" type="submit">
              Logout
            </button>
          </form> */}
        </div>
      );
    } else {
      tabContent = (
        <div className="login-box">
          <p className="login-note">
            Login to edit or delete your own comments.
          </p>

          <form className="mini-login-form" onSubmit={handleLogin}>
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={loginUsername}
              onChange={(event) => setLoginUsername(event.target.value)}
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
            />

            <button type="submit" className="edit-button">
              Login
            </button>
          </form>

          {loginError !== "" && <p className="error-message">{loginError}</p>}

          <div style={{ marginTop: "16px", textAlign: "center" }}>
            <span style={{ color: "#777", fontSize: "14px" }}>
              Don&apos;t have an account?
            </span>

            <Link
              href="/register"
              style={{
                marginLeft: "6px",
                color: "#8fb996",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "underline",
              }}
            >
              Register
            </Link>
          </div>
        </div>
      );
    }
  }

  return (
    <div>
      <div className="tab-container">
        <button type="button" className={guestTabClass} onClick={openGuestTab}>
          👤 Comment as Guest
        </button>

        <button type="button" className={loginTabClass} onClick={openLoginTab}>
          🔐 Login
        </button>
      </div>

      {tabContent}
    </div>
  );
}
