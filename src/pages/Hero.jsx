
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-5 md:px-12 lg:px-20">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-900">
          SafeCircle
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="font-medium text-gray-700 hover:text-blue-700"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-blue-900 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Main Hero Section */}
      <section className="grid min-h-[500px] items-center gap-10 px-6 py-8 md:grid-cols-2 md:px-12 md:py-10 lg:px-20">
        {/* Left: Hero Text */}
        <div className="max-w-xl">
          <span className="inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-800">
            Safer Communities, Stronger Connections
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
            Your Community.
            <span className="block text-blue-900">Your Safety.</span>
            Our Priority.
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            Connecting residents, security teams and emergency responders to
            protect lives, safeguard properties and build safer communities.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="rounded-lg bg-blue-900 px-7 py-3.5 font-semibold text-white shadow-md transition hover:bg-blue-800"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="rounded-lg border border-blue-900 px-7 py-3.5 font-semibold text-blue-900 transition hover:bg-blue-50"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Right: Hero Image */}
        <div className="relative">
          <img
            src="https://yzhwcrhklmjggnofsxet.supabase.co/storage/v1/object/public/safecircle-assets/safecircle-hero.png"
            alt="Security personnel and residents working together for a safer community"
            className="w-full aspect-video rounded-2xl object-contain shadow-xl"
          />
        </div>
      </section>
    </div>
  );
}

export default Hero;
