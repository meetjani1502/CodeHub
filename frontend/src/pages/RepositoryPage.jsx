import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function RepositoryPage() {

    const { id } = useParams();

    const [repository, setRepository] = useState(null);


    useEffect(() => {

        fetchRepository();

    }, []);



    const fetchRepository = async () => {

        try {

            const token = localStorage.getItem("token");


            const response = await api.get(
                `/repositories/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            console.log(response.data);


            setRepository(response.data.repository);


        } catch (error) {

            console.log(error);

        }

    };



    if (!repository) {

        return (
            <div className="bg-[#0d1117] min-h-screen text-white p-8">
                Loading...
            </div>
        );

    }



    return (

        <div className="bg-[#0d1117] min-h-screen text-white p-8">


            {/* Repository Header */}

            <h1 className="text-3xl font-bold">
                {repository.name}
            </h1>


            <p className="text-gray-400 mt-2">
                {repository.description}
            </p>



            {/* Stats */}

            <div className="mt-8 flex gap-5">


                <div className="bg-[#161b22] p-5 rounded border border-[#30363d]">

                    <h3 className="text-xl">
                        Files
                    </h3>

                    <p className="text-gray-400 mt-2">
                        {repository.files?.length || 0}
                    </p>

                </div>




                <div className="bg-[#161b22] p-5 rounded border border-[#30363d]">

                    <h3 className="text-xl">
                        Commits
                    </h3>

                    <p className="text-gray-400 mt-2">
                        {repository.commits?.length || 0}
                    </p>

                </div>


            </div>




            {/* Files List */}

            <div className="mt-10">


                <h2 className="text-2xl font-bold">
                    Repository Files
                </h2>



                <div className="mt-5 space-y-3">


                    {
                        repository.files?.length > 0 ? (

                            repository.files.map((file) => (

                                <div
                                    key={file.id}
                                    className="bg-[#161b22] border border-[#30363d] rounded-lg p-4"
                                >


                                    <h3 className="text-blue-400 text-lg">
                                        📄 {file.filename}
                                    </h3>



                                    <p className="text-gray-400 mt-2">
                                        {file.content}
                                    </p>


                                </div>

                            ))

                        ) : (

                            <p className="text-gray-400">
                                No files found
                            </p>

                        )

                    }


                </div>


            </div>



        </div>

    );

}


export default RepositoryPage;