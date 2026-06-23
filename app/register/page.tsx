import { sql } from "../lib/db";
import { redirect } from "next/navigation";

export default function RegisterPage() {
  async function registerUser(formData: FormData): Promise<void> {
    "use server";

    const username = formData.get("username")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString().trim();
    const role = formData.get("role")?.toString();

    if (!username || !email || !password || !role) {
      return;
    }

    // Check username
    const existingUser = await sql`
    SELECT id
    FROM guestbook_users
    WHERE username = ${username}
  `;

    if (existingUser.length > 0) {
      return;
    }

    // Check email
    const existingEmail = await sql`
    SELECT id
    FROM guestbook_users
    WHERE email = ${email}
  `;

    if (existingEmail.length > 0) {
      return;
    }

    await sql`
    INSERT INTO guestbook_users
    (username, email, password, role)
    VALUES
    (${username}, ${email}, ${password}, ${role})
  `;
    redirect("/");
    return;
  }

  return (
    <main className="page">
      <section className="guestbook-form-card">
        <h1>Create Account 🌻</h1>


        <form className="guestbook-form" action={registerUser}>
          <div className="input-group">
            <label>Username</label>
            <input name="username" type="text" required placeholder="user01" />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="user@example.com"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              required
              placeholder="••••••••"
            />
          </div>

          <div className="input-group">
            <label>Role</label>

            <select name="role" required>
              <option value="">Select Role</option>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button className="submit-btn" type="submit">
            Register
          </button>
        </form>
      </section>
    </main>
  );
}
