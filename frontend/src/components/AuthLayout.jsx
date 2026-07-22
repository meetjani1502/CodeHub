function AuthLayout({ title, children }) {
  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">CodeHub</h1>

          <p className="text-gray-400 mt-2">GitHub Clone Platform</p>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-center mb-6">{title}</h2>

          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
