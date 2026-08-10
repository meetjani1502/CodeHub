import prisma from "../config/prisma.js";

export const createFile = async (req, res) => {
  try {
    const { name, filename, content, repositoryId, branchId } = req.body;

    const file = await prisma.file.create({
      data: {
        name,
        filename,
        content,
        repositoryId: Number(repositoryId),
        branchId: Number(branchId),
      },
    });

    res.json({
      success: true,
      data: file,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFiles = async (req, res) => {
  try {
    const repositoryId = Number(req.params.repositoryId);

    const files = await prisma.file.findMany({
      where: {
        repositoryId: Number(repositoryId),
      },
    });

    res.status(200).json({
      success: true,
      data: files,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFile = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const file = await prisma.file.findUnique({
      where: {
        id,
      },
    });
    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.status(200).json({
      success: true,
      data: file,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateFile = async (req, res) => {
  try {
    const { id } = req.params;

    const { content, message } = req.body;

    // old file find
    const oldFile = await prisma.file.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!oldFile) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    // update file

    const updatedFile = await prisma.file.update({
      where: {
        id: Number(id),
      },

      data: {
        content,
      },
    });

    // create commit

    const commit = await prisma.commit.create({
      data: {
        repositoryId: oldFile.repositoryId,

        message: message || `Updated ${oldFile.filename}`,
      },
    });

    // create file version

    await prisma.fileVersion.create({
      data: {
        fileId: oldFile.id,

        commitId: commit.id,

        filename: oldFile.filename,

        content: oldFile.content,
      },
    });

    res.json({
      success: true,

      message: "File updated and version saved",

      data: updatedFile,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await prisma.file.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      success: true,
      message: "File deleted successfully",
      file,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFileById = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await prisma.file.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    res.json({
      success: true,
      file,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFilesByBranch = async (req, res) => {
  try {
    const { repositoryId, branch } = req.params;

    const files = await prisma.file.findMany({
      where: {
        repositoryId: Number(repositoryId),
      },
    });

    res.json({
      success: true,
      branch,
      data: files,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
