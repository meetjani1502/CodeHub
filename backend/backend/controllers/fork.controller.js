import prisma from "../config/prisma.js";

// ===============================
// Fork Repository
// ===============================
export const forkRepository = async (req, res) => {
  try {
    const { repositoryId } = req.body;
    const userId = req.user.id;

    // Check repository exists
    const repository = await prisma.repository.findUnique({
      where: {
        id: Number(repositoryId),
      },
      include: {
        files: true,
        branches: true,
      },
    });

    if (!repository) {
      return res.status(404).json({
        success: false,
        message: "Repository not found",
      });
    }

    // Check if already forked
    const existingFork = await prisma.fork.findUnique({
      where: {
        repositoryId_userId: {
          repositoryId: Number(repositoryId),
          userId,
        },
      },
    });

    if (existingFork) {
      return res.status(400).json({
        success: false,
        message: "Repository already forked",
      });
    }

    // Create new repository
    const newRepository = await prisma.repository.create({
      data: {
        name: repository.name,
        description: repository.description,
        ownerId: userId,
      },
    });

    // Copy files
    for (const file of repository.files) {
      await prisma.file.create({
        data: {
          filename: file.filename,
          content: file.content,
          repositoryId: newRepository.id,
        },
      });
    }

    // Copy branches
    for (const branch of repository.branches) {
      await prisma.branch.create({
        data: {
          name: branch.name,
          repositoryId: newRepository.id,
        },
      });
    }

    // Save fork record
    await prisma.fork.create({
      data: {
        repositoryId: Number(repositoryId),
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Repository forked successfully",
      repository: newRepository,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
