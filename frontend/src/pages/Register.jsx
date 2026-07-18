import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import API from "../api/axios";
import AuthLayout from "../components/layout/AuthLayout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
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

            await API.post("/auth/register", formData);

            navigate("/login");

        } catch (err) {

            setError(

                err.response?.data?.message ||

                "Registration Failed"

            );

        }

        setLoading(false);

    };

    return (

        <AuthLayout>

            <h2 className="text-2xl font-bold text-center text-white">

                Create your CodeHub account

            </h2>

            <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-5"
            >

                <div>

                    <label className="text-gray-300 text-sm block mb-2">
                        Full Name
                    </label>

                    <Input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                </div>

                <div>

                    <label className="text-gray-300 text-sm block mb-2">
                        Email
                    </label>

                    <Input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                </div>

                <div>

                    <label className="text-gray-300 text-sm block mb-2">
                        Password
                    </label>

                    <Input
                        type="password"
                        name="password"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                </div>

                {error && (

                    <div className="bg-red-500/10 border border-red-500 rounded-md p-3 text-red-400">

                        {error}

                    </div>

                )}

                <Button disabled={loading}>

                    {

                        loading

                            ? "Creating Account..."

                            : "Create Account"

                    }

                </Button>

            </form>

            <p className="text-center text-gray-400 mt-6">

                Already have an account?

                <Link
                    to="/login"
                    className="ml-2 text-blue-400 hover:underline"
                >

                    Sign In

                </Link>

            </p>

        </AuthLayout>

    );

}

export default Register;