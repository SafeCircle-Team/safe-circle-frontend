
const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center sm:flex-row sm:px-6 sm:text-left">
        <div>
          <p className="font-semibold text-gray-800">
            SafeCircle
          </p>

          <p className="text-sm text-gray-500">
            Your Community. Your Safety. Our Priority.
          </p>
        </div>

        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} SafeCircle. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
