import prisma from "../config/database.js";

// Create File
export const createFile = async (req, res) => {
    try {
        const { filename, content, repositoryId } = req.body;

        if (!filename || !repositoryId) {
            return res.status(400).json({
                success: false,
                message: "Filename and repositoryId are required"
            });
        }

        // Check repository ownership
        const repository = await prisma.repository.findFirst({
            where: {
                id: Number(repositoryId),
                ownerId: req.user.id
            }
        });

        if (!repository) {
            return res.status(404).json({
                success: false,
                message: "Repository not found"
            });
        }

        const file = await prisma.file.create({
            data: {
                filename,
                content: content || "",
                repositoryId: Number(repositoryId)
            }
        });

        return res.status(201).json({
            success: true,
            message: "File created successfully",
            file
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get Files of Repository
export const getFiles = async (req, res) => {
    try {
        const { repositoryId } = req.params;

        const files = await prisma.file.findMany({
            where: {
                repositoryId: Number(repositoryId)
            }
        });

        return res.status(200).json({
            success: true,
            files
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Get Single File
export const getFile = async (req, res) => {
    try {
        const { id } = req.params;

        const file = await prisma.file.findUnique({
            where: {
                id: Number(id)
            }
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: "File not found"
            });
        }

        return res.status(200).json({
            success: true,
            file
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Update File
export const updateFile = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const updatedFile = await prisma.file.update({
            where: {
                id: Number(id)
            },
            data: {
                content
            }
        });

        return res.status(200).json({
            success: true,
            message: "File updated successfully",
            file: updatedFile
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Delete File
export const deleteFile = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.file.delete({
            where: {
                id: Number(id)
            }
        });

        return res.status(200).json({
            success: true,
            message: "File deleted successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};