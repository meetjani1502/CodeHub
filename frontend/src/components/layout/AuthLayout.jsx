import Logo from "../common/Logo";

function AuthLayout({ children }) {

    return (

        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">

            <div className="w-full max-w-md px-6">

                <Logo />

                <div className="mt-8 bg-[#161b22] border border-[#30363d] rounded-xl p-8 shadow-2xl">

                    {children}

                </div>

            </div>

        </div>

    );

}

export default AuthLayout;