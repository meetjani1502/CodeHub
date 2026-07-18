import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

function CreateRepository() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        description: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await API.post("/repositories/create", form);

            alert("Repository Created Successfully");

            navigate("/repositories");

        } catch (err) {

            console.log(err);

            alert("Failed to create repository");

        }
    };

    return (

        <div className="flex">

            <Sidebar />

            <div className="flex-1 bg-[#0d1117] min-h-screen text-white">

                <Navbar />

                <div className="max-w-2xl mx-auto mt-10">

                    <h1 className="text-3xl font-bold mb-8">
                        Create Repository
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <input
                            type="text"
                            name="name"
                            placeholder="Repository Name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full p-3 rounded bg-[#161b22] border border-gray-700"
                            required
                        />

                        <textarea
                            name="description"
                            placeholder="Description"
                            rows="4"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full p-3 rounded bg-[#161b22] border border-gray-700"
                        />

                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded"
                        >
                            Create Repository
                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default CreateRepository;