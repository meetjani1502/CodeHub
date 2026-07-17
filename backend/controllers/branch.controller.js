import prisma from "../config/prisma.js";


// Create Branch
export const createBranch = async (req, res) => {

    try {

        const { name, repositoryId } = req.body;


        const branch = await prisma.branch.create({

            data: {
                name,
                repositoryId: Number(repositoryId)
            }

        });


        res.status(201).json({

            success: true,

            message: "Branch created successfully",

            data: branch

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};




// Get all branches of repository
export const getBranches = async (req, res) => {

    try {

        const repositoryId = Number(req.params.repositoryId);


        const branches = await prisma.branch.findMany({

            where: {

                repositoryId

            },

            orderBy: {

                createdAt: "asc"

            }

        });


        res.status(200).json({

            success: true,

            data: branches

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};


export const getBranchCommits = async(req,res)=>{

    try{

        const branchId = Number(req.params.branchId);


        const commits = await prisma.commit.findMany({

            where:{
                branchId
            },

            orderBy:{
                createdAt:"desc"
            }

        });


        res.json({

            success:true,
            data:commits

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};

// Delete Branch
export const deleteBranch = async (req, res) => {

    try {

        const id = Number(req.params.id);


        const branch = await prisma.branch.findUnique({

            where:{
                id
            }

        });


        if(!branch){

            return res.status(404).json({

                success:false,

                message:"Branch not found"

            });

        }



        await prisma.branch.delete({

            where:{
                id
            }

        });



        res.status(200).json({

            success:true,

            message:"Branch deleted successfully"

        });



    } catch(error){


        console.error(error);


        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};