import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function CreateRepository() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const createRepository = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/repositories/create", form);

      console.log(response.data);

      navigate("/repositories");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex justify-center items-center">
      <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-xl w-[450px]">
        <h1 className="text-3xl font-bold mb-6">Create Repository</h1>

        <form onSubmit={createRepository}>
          <label>Repository Name</label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="my-project"
            className="w-full mt-2 mb-5 bg-[#0d1117] border border-[#30363d] p-3 rounded-lg"
          />

          <label>Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Project description"
            className="w-full mt-2 mb-5 bg-[#0d1117] border border-[#30363d] p-3 rounded-lg"
          />

          <button className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold">
            Create Repository
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRepository;
