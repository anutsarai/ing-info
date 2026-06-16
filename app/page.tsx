import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <section className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
      {/* Decorative emojis */}
      <div className="absolute top-5 left-5 text-2xl animate-bounce">🌼</div>
      <div className="absolute top-8 right-6 text-xl">✨</div>
      <div className="absolute bottom-6 left-8 text-lg">☁️</div>
      <div className="absolute bottom-8 right-8 text-xl">🌷</div>
        
        {/* Profile picture */}
        <div className="relative">
        <div className="w-36 h-36 mx-auto rounded-full p-1 bg-gradient-to-r from-pink-200 via-yellow-300 to-blue-200">
          <img
            src="/ing-profile.jpg"
            alt="Profile"
            className="w-full h-full rounded-full object-cover border-4 border-white"
          />
        </div>
        </div>

            {/* Name and role */}
        <h1 className="mt-4 text-2xl font-bold text-gray-900">
          ING 🌻
        </h1>
        <h4 className="text-sm text-gray-500">Anutsara Intuprapha</h4>
        <p className="text-blue-600 font-medium">
          Software Developer 👩🏻‍💻
        </p>

        {/* About */}
        <p className="mt-4 text-gray-600 text-sm leading-relaxed">
        
        Halo🐱! I'm learning Next.js one step at a time. Feel free to explore and leave me some tips along the way. ♡
        </p>

        {/* Details */}
        <ul className="mt-6 text-left text-sm text-gray-700 space-y-2">
          <li>📍 Location: BKK, Thailand</li>
          <li>📧 Email: anutsara.atwork@gmail.com</li>
          <li>🎓 Education: KMUTNB / Mechanical Engineering</li>
          <li>💼 Skills: HTML, CSS, JavaScript, Robot Framework, C#</li>
        </ul>

        {/* Links */}
        <div className="mt-6 flex justify-center gap-4">
          <a
            href="https://github.com/anutsarai"
            className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-700"
          >
            🐈 GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/anutsara-intuprapha"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-500"
          >
           💼 LinkedIn
          </a>
        </div>
      </section>
    </main>
  );
}
