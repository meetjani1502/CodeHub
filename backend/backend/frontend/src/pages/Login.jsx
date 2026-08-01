import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../api/axios";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({

        email: "",
        password: ""

    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");



    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };



    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setLoading(true);

        try {

            const res = await API.post("/auth/login", formData);

            localStorage.setItem("token", res.data.token);

            localStorage.setItem("user", JSON.stringify(res.data.user));

            navigate("/dashboard");

        } catch (err) {

            setError(

                err.response?.data?.message ||

                "Login Failed"

            );

        }

        setLoading(false);

    };



    return (

        <AuthLayout>

            <h2 className="text-2xl font-bold text-white text-center">

                Sign in to CodeHub

            </h2>

            <form

                onSubmit={handleSubmit}

                className="mt-6 space-y-5"
            >

                <div>

                    <label className="block text-sm mb-2 text-gray-300">

                        Email

                    </label>

                    <Input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                </div>

                <div>

                    <label className="block text-sm mb-2 text-gray-300">

                        Password

                    </label>

                    <Input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                </div>

                {

                    error && (

                        <div className="bg-red-500/10 border border-red-500 rounded-md p-3 text-red-400 text-sm">

                            {error}

                        </div>

                    )

                }

                <Button disabled={loading}>

                    {

                        loading

                            ? "Signing In..."

                            : "Sign In"

                    }

                </Button>

            </form>

            <p className="text-center text-gray-400 mt-6">

                New to CodeHub?

                <Link

                    to="/register"

                    className="text-blue-400 ml-2 hover:underline"

                >

                    Create account

                </Link>

            </p>

        </AuthLayout>

    );

}

export default Login;