import prisma from "../config/prisma.js";


// Create Pull Request
export const createPullRequest = async (req, res) => {

    try {

        const {
            title,
            description,
            sourceBranchId,
            targetBranchId
        } = req.body;


        // Check source branch
        const sourceBranch = await prisma.branch.findUnique({
            where: {
                id: Number(sourceBranchId)
            }
        });


        if (!sourceBranch) {

            return res.status(404).json({
                success: false,
                message: "Source branch not found"
            });

        }


        // Check target branch
        const targetBranch = await prisma.branch.findUnique({
            where: {
                id: Number(targetBranchId)
            }
        });


        if (!targetBranch) {

            return res.status(404).json({
                success: false,
                message: "Target branch not found"
            });

        }



        const pullRequest = await prisma.pullRequest.create({

            data: {

                title,

                description,

                sourceBranchId: Number(sourceBranchId),

                targetBranchId: Number(targetBranchId)

            }

        });



        res.status(201).json({

            success: true,

            message: "Pull Request created successfully",

            data: pullRequest

        });



    } catch(error) {


        console.error(error);


        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};




// Get all Pull Requests
export const getPullRequests = async (req,res)=>{

    try{

        const pullRequests = await prisma.pullRequest.findMany({

            orderBy:{
                createdAt:"desc"
            }

        });


        res.json({

            success:true,

            data:pullRequests

        });


    }catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

// Approve Pull Request
export const approvePullRequest = async (req,res)=>{

    try{

        const id = Number(req.params.id);


        const pullRequest = await prisma.pullRequest.findUnique({
            where:{
                id
            }
        });


        if(!pullRequest){

            return res.status(404).json({
                success:false,
                message:"Pull Request not found"
            });

        }


        const updatedPR = await prisma.pullRequest.update({

            where:{
                id
            },

            data:{
                status:"APPROVED"
            }

        });


        res.json({

            success:true,

            message:"Pull Request approved",

            data:updatedPR

        });


    }catch(error){

        console.error(error);

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};





// Reject Pull Request
export const rejectPullRequest = async(req,res)=>{

    try{


        const id = Number(req.params.id);


        const pullRequest = await prisma.pullRequest.findUnique({

            where:{
                id
            }

        });


        if(!pullRequest){

            return res.status(404).json({

                success:false,

                message:"Pull Request not found"

            });

        }



        const updatedPR = await prisma.pullRequest.update({

            where:{
                id
            },

            data:{
                status:"REJECTED"
            }

        });



        res.json({

            success:true,

            message:"Pull Request rejected",

            data:updatedPR

        });


    }catch(error){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

export const mergePullRequest = async (req,res)=>{

    try{

        const id = Number(req.params.id);


        const pullRequest = await prisma.pullRequest.findUnique({

            where:{
                id
            }

        });


        if(!pullRequest){

            return res.status(404).json({
                success:false,
                message:"Pull Request not found"
            });

        }



        if(pullRequest.status !== "APPROVED"){

            return res.status(400).json({
                success:false,
                message:"Pull Request must be approved first"
            });

        }



        const sourceRepositoryId = await getRepositoryId(
            pullRequest.sourceBranchId
        );


        const targetRepositoryId = await getRepositoryId(
            pullRequest.targetBranchId
        );



        const sourceFiles = await prisma.file.findMany({

            where:{
                repositoryId:sourceRepositoryId
            }

        });



        // Update target files
        for(const file of sourceFiles){


            await prisma.file.updateMany({

                where:{
                    repositoryId:targetRepositoryId,
                    filename:file.filename
                },

                data:{
                    content:file.content
                }

            });

        }



        // Create Merge Commit

        const mergeCommit = await prisma.commit.create({

            data:{

                repositoryId:targetRepositoryId,

                branchId:pullRequest.targetBranchId,

                message:`Merge PR #${id}: ${pullRequest.title}`

            }

        });



        // Create File Version Snapshot

        const targetFiles = await prisma.file.findMany({

            where:{
                repositoryId:targetRepositoryId
            }

        });



        for(const file of targetFiles){

            await prisma.fileVersion.create({

                data:{

                    fileId:file.id,

                    commitId:mergeCommit.id,

                    filename:file.filename,

                    content:file.content

                }

            });

        }



        // Update PR status

        const updatedPR = await prisma.pullRequest.update({

            where:{
                id
            },

            data:{
                status:"MERGED"
            }

        });



        res.json({

            success:true,

            message:"Pull Request merged with commit created",

            commit:mergeCommit,

            pullRequest:updatedPR

        });



    }catch(error){

        console.error(error);


        res.status(500).json({

            success:false,

            message:error.message

        });

    }

};

// Get Repository ID from Branch ID
const getRepositoryId = async (branchId) => {

    const branch = await prisma.branch.findUnique({

        where: {
            id: Number(branchId)
        }

    });


    if (!branch) {
        throw new Error("Branch not found");
    }


    return branch.repositoryId;

};