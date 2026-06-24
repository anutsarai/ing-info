import Image from "next/image";
import { revalidatePath } from "next/cache";
import { sql } from "./lib/db";
import "./globals.css";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import GuestBookForm from "./components/GuestBookForm";

// variable
type GuestbookMessage = {
  id: number;
  username: string;
  message: string;
  created_at: string;
};
type CurrentUser = {
  username: string;
  role: string;
};

export default async function Home() {
  const cookieStore = await cookies();

  const usernameCookie = cookieStore.get("username")?.value;
  const roleCookie = cookieStore.get("role")?.value;
  let currentUser: CurrentUser | null = null;
  if (usernameCookie && roleCookie) {
    currentUser = {
      username: usernameCookie,
      role: roleCookie,
    };
  }
  const messages = (await sql`
                                                  SELECT id, username, message, created_at
                                                      FROM guestbook
                                                          ORDER BY created_at DESC
                                                            `) as GuestbookMessage[];

  // comment btn action
  async function addComment(formData: FormData) {
    "use server";
    const username = formData.get("username")?.toString().trim();
    const message = formData.get("message")?.toString().trim();
    if (!username || !message) {
      return;
    }
    if (message.length > 300) {
      return;
    }
    await sql`
                                                                                                                  INSERT INTO guestbook (username, message)
                                                                                                                        VALUES (${username}, ${message})
                                                                                                                            `;

    revalidatePath("/");
  }

  async function login(formData: FormData) {
    "use server";

    const username = formData.get("username")?.toString().trim();
    const password = formData.get("password")?.toString().trim();

    if (!username || !password) {
      return {
        success: false,
        message: "Please enter username and password.",
      };
    }

    const users = (await sql`
                                                                                                                                                                                            SELECT id, username, role
                                                                                                                                                                                                FROM guestbook_users
                                                                                                                                                                                                    WHERE username = ${username}
                                                                                                                                                                                                          AND password = ${password}
                                                                                                                                                                                                              LIMIT 1
                                                                                                                                                                                                                `) as {
      id: number;
      username: string;
      role: string;
    }[];

    if (users.length === 0) {
      return {
        success: false,
        message: "Username or password is incorrect.",
      };
    }

    // set cookies
    const cookieStore = await cookies();
    cookieStore.set("username", users[0].username);
    cookieStore.set("role", users[0].role);

    return {
      success: true,
      message: "Login successful.",
      user: users[0],
    };
  }

  // delete comment
  async function deleteComment(formData: FormData) {
    "use server";

    const commentId = formData.get("commentId")?.toString();

    if (!commentId) {
      return;
    }

    await sql`
                                                                                                                                                                                                                                                                                                                            DELETE FROM guestbook
                                                                                                                                                                                                                                                                                                                                WHERE id = ${commentId}
                                                                                                                                                                                                                                                                                                                                  `;

    revalidatePath("/");
  }

  //edit comment
  async function editComment(formData: FormData) {
    "use server";

    const commentId = formData.get("commentId")?.toString();
    const message = formData.get("message")?.toString().trim();

    if (!commentId || !message) {
      return;
    }

    if (message.length > 300) {
      return;
    }

    await sql`
                                                                                                                                                                                                                                                                                                                                                                                          UPDATE guestbook
                                                                                                                                                                                                                                                                                                                                                                                              SET message = ${message}
                                                                                                                                                                                                                                                                                                                                                                                                  WHERE id = ${commentId}
                                                                                                                                                                                                                                                                                                                                                                                                    `;

    revalidatePath("/");
  }

  // logout
  async function logout() {
    "use server";

    const cookieStore = await cookies();

    cookieStore.delete("username");
    cookieStore.delete("role");

    redirect("/");
  }

  // main return
  return (
    <main className="page">
      <header className="site-header">
        <div>
          <h2>Ing’s Little Space</h2>
        </div>
        {currentUser !== null ? (
          <p>
            Welcome, {currentUser.role}: {currentUser.username}
          </p>
        ) : (
          <p>Welcome, Guest🌷</p>
        )}

        <nav className="header-nav">
          <a
            style={{ margin: "0 0 0 10px" }}
            href="/register"
          >
            Register
          </a>
          {currentUser !== null && (
            <form action={logout}>
              <button className="header-logout-btn" type="submit">
                Logout
              </button>
            </form>
          )}
        </nav>
      </header>
      <section className="profile-card">
        <div className="profile-image-ring">
          <Image
            src="/ing-profile.jpg"
            alt="Profile"
            width={144}
            height={144}
            className="profile-image"
          />
        </div>

        <h1>ING 🌻</h1>
        <h4>Anutsara Intuprapha</h4>
        <p className="role">Software Developer 👩🏻‍💻</p>

        <p className="about">
          Halo🐱! I&apos;m learning Next.js one step at a time. Feel free to explore
          and leave me some tips along the way. ♡
        </p>
        <p className="about"></p>

        <ul className="profile-details">
          <li>📍 Location: BKK, Thailand</li>
          <li>📧 Email: anutsara.atwork@gmail.com</li>
          <li>🎓 Education: KMUTNB / Mechanical Engineering</li>
          <li>💼 Skills: HTML, CSS, JavaScript, Robot Framework, C#</li>
        </ul>

        <div className="profile-links">
          <a href="https://github.com/anutsarai" className="profile-link dark">
            🐈 GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/anutsara-intuprapha"
            className="profile-link green"
          >
            💼 LinkedIn
          </a>
        </div>
      </section>

      {/* guest book */}
      <section className="guestbook-wrapper">
        <section className="guestbook-list-card">
          <div className="section-heading">
            <h2 style={{ color: "#8B4513" }}>💌 Guest Book</h2>
            <p>Recent notes from visitors</p>
          </div>

          <div className="message-list">
            {messages.map((item) => {
              let canManageComment = false;

              if (currentUser !== null) {
                if (currentUser.role === "ADMIN") {
                  canManageComment = true;
                } else {
                  if (currentUser.username === item.username) {
                    canManageComment = true;
                  }
                }
              }
              return (
                <div key={item.id} className="message-card">
                  <div className="message-avatar">🌻</div>

                  <div className="message-body">
                    <div className="message-top">
                      <p className="message-name">{item.username}</p>
                      <p className="message-date">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>

                    <p className="message-text">{item.message}</p>

                    {canManageComment && (
                      <div className="message-actions">
                        <form action={editComment} className="edit-form ">
                          <input
                            type="hidden"
                            name="commentId"
                            value={item.id}
                          />

                          <input
                            name="message"
                            defaultValue={item.message}
                            maxLength={300}
                          />

                          <button type="submit" className="edit-button">
                            Save
                          </button>
                        </form>{" "}
                        <form action={deleteComment}>
                          <input
                            type="hidden"
                            name="commentId"
                            value={item.id}
                          />
                          <button type="submit" className="delete-button">
                            Delete
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* comment section */}
        <section className="guestbook-form-card">
          <h2 style={{ color: "#8B4513" }}>🌻 Say hi before you go</h2>
          <p className="form-desc">
            You can comment as anonymous by typing your name or login to edit
            and delete your own comments later.
          </p>
          {/* {currentUser !== null && (
            <div>
              <h3 style={{ margin: 0 }} className="name-display">
                👋 Welcome, {currentUser.role}: {currentUser.username}
              </h3>
            </div>
            
          )} */}
          <GuestBookForm
            addComment={addComment}
            login={login}
            currentUser={currentUser}
            logout={logout}
          />{" "}
        </section>
      </section>

      {/* footer */}
      <footer className="site-footer">
        <p>Made with ☕ - 🌻</p>
        <p>© 2026 Guest book, ING</p>
      </footer>
    </main>
  );
}
