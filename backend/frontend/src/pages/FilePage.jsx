import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";


function FilePage(){

    const { fileId } = useParams();

    const [file,setFile] = useState(null);



    useEffect(()=>{

        fetchFile();

    },[]);



    const fetchFile = async()=>{

        try{

            const token = localStorage.getItem("token");


            const response = await api.get(
                `/files/${fileId}`,
                {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                }
            );


            console.log(response.data);


            setFile(response.data.file);


        }
        catch(error){

            console.log(error);

        }

    };



    if(!file){

        return(
            <div className="bg-[#0d1117] min-h-screen text-white p-8">
                Loading...
            </div>
        )

    }



    return(

        <div className="bg-[#0d1117] min-h-screen text-white p-8">


            <h1 className="text-3xl font-bold">
                📄 {file.filename}
            </h1>


            <div className="mt-8 bg-[#161b22] border border-[#30363d] rounded-lg p-5">

                <pre className="text-gray-300">
                    {file.content}
                </pre>

            </div>


        </div>

    )

}


export default FilePage;