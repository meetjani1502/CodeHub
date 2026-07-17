import prisma from "../config/prisma.js";

export const createFile = async (req,res)=>{

    try{

        const {
            repositoryId,
            filename,
            content
        } = req.body;


        const file = await prisma.file.create({

            data:{
                repositoryId:Number(repositoryId),
                filename,
                content
            }

        });


        res.status(201).json({

            success:true,
            message:"File created successfully",
            data:file

        });


    }catch(error){

        console.log(error);

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};

export const getFiles = async (req, res) => {
    try {

        const repositoryId = Number(req.params.repositoryId);

        const files = await prisma.file.findMany({
            where: {
                repositoryId
            }
        });

        res.status(200).json({
            success: true,
            data: files
        });
    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getFile = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const file = await prisma.file.findUnique({
            where: {
                id
            }
        });
        if (!file) {

            return res.status(404).json({
                success: false,
                message: "File not found"
            });

        }

        res.status(200).json({
            success: true,
            data: file
        });

         } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }

};

export const updateFile = async (req, res) => {
    try {

        const id = Number(req.params.id);

        const { filename, content } = req.body;

        const file = await prisma.file.update({
            where: {
                id
            },
            data: {
                filename,
                content
            }
        });

        res.status(200).json({
            success: true,
            message: "File updated successfully",
            data: file
        });

        } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteFile = async (req, res) => {
    try {

        const id = Number(req.params.id);

        await prisma.file.delete({
            where: {
                id
            }
        });

        res.status(200).json({
            success: true,
            message: "File deleted successfully"
        });

         } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
