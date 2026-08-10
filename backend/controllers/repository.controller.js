import prisma from "../config/database.js";

export const createRepository = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Repository name is required",
      });
    }

    // Transaction
    const repository = await prisma.$transaction(async (tx) => {
      // Create Repository
      const repo = await tx.repository.create({
        data: {
          name,
          description,
          ownerId: req.user.id,
        },
      });

      // Create Main Branch
      const mainBranch = await tx.branch.create({
        data: {
          name: "main",
          repositoryId: repo.id,
        },
      });

      // Update Repository Current Branch
      const updatedRepo = await tx.repository.update({
        where: {
          id: repo.id,
        },
        data: {
          currentBranchId: mainBranch.id,
        },
      });

      return updatedRepo;
    });

    return res.status(201).json({
      success: true,
      message: "Repository created successfully",
      repository,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRepositories = async (req, res) => {
  try {
    const repositories = await prisma.repository.findMany({
      where: {
        ownerId: req.user.id,
      },
      include: {
        _count: {
          select: {
            stars: true,
            fork: true,
          },
        },
        stars: {
          where: {
            userId: req.user.id,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      repositories,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// ===============================
// Get ALL Repositories (Explore - all users, excluding own)
// ===============================
export const getAllRepositories = async (req, res) => {
  try {
    const repositories = await prisma.repository.findMany({
      where: {
        ownerId: {
          not: req.user.id,
        },
      },
      include: {
        owner: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        _count: {
          select: {
            stars: true,
            fork: true,
          },
        },
        stars: {
          where: {
            userId: req.user.id,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      repositories,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// Get Single Repository
export const getRepositoryById = async (req, res) => {
  console.log("REQ PARAMS =", req.params);

  const id = Number(req.params.id);

  console.log("ID =", id);

  try {
    const repository = await prisma.repository.findUnique({
      where: {
        id: id,
      },
      include: {
        files: true,
        commits: true,
        branches: true,
        currentBranch: true,
        _count: {
          select: {
            stars: true,
            fork: true,
          },
        },
        stars: {
          where: {
            userId: req.user.id,
          },
          select: {
            id: true,
          },
        },
      },
    });

    res.json({
      success: true,
      repository,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Repository
export const updateRepository = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const repository = await prisma.repository.findFirst({
      where: {
        id: Number(id),
        ownerId: req.user.id,
      },
    });

    if (!repository) {
      return res.status(404).json({
        success: false,
        message: "Repository not found",
      });
    }

    const updatedRepository = await prisma.repository.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        description,
      },
    });

    res.status(200).json({
      success: true,
      message: "Repository updated successfully",
      repository: updatedRepository,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete Repository
export const deleteRepository = async (req, res) => {
  try {
    const { id } = req.params;

    const repository = await prisma.repository.findFirst({
      where: {
        id: Number(id),
        ownerId: req.user.id,
      },
    });

    if (!repository) {
      return res.status(404).json({
        success: false,
        message: "Repository not found",
      });
    }

    await prisma.repository.delete({
      where: {
        id: Number(id),
      },
    });

    res.status(200).json({
      success: true,
      message: "Repository deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// Star Repository
export const starRepository = async (req, res) => {
  try {
    console.log("REQ USER =", req.user);
    console.log("REQ HEADERS =", req.headers.authorization);
    const repoId = Number(req.params.id);
    const userId = req.user.id;
    const { id } = req.params;

    const existingStar = await prisma.star.findFirst({
      where: {
        userId: req.user.id,
        repositoryId: Number(id),
      },
    });

    if (existingStar) {
      return res.status(400).json({
        success: false,
        message: "Already starred",
      });
    }

    const star = await prisma.star.create({
      data: {
        userId,
        repositoryId: repoId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Repository starred",
      star,
    });
  } catch (error) {
    console.log("STAR ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeStar = async (req, res) => {
  try {
    const repositoryId = Number(req.params.id);
    const userId = req.user.id;

    console.log("REMOVE STAR REPO ID =", repositoryId);
    console.log("REMOVE STAR USER ID =", userId);

    const existingStar = await prisma.star.findFirst({
      where: {
        userId: userId,
        repositoryId: repositoryId,
      },
    });

    if (!existingStar) {
      return res.status(400).json({
        success: false,
        message: "Star not found",
      });
    }

    await prisma.star.delete({
      where: {
        id: existingStar.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Star removed",
    });
  } catch (error) {
    console.log("REMOVE STAR ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ===============================
// Fork Repository
// ===============================
export const forkRepository = async (req, res) => {
  try {
    const repoId = Number(req.params.id);
    const userId = req.user.id;

    // Check original repository exists
    const originalRepo = await prisma.repository.findUnique({
      where: { id: repoId },
      include: {
        files: true,
        branches: true,
      },
    });

    if (!originalRepo) {
      return res.status(404).json({
        success: false,
        message: "Repository not found",
      });
    }

    // Prevent forking own repository
    if (originalRepo.ownerId === userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot fork your own repository",
      });
    }

    // Prevent duplicate fork by same user
    const existingFork = await prisma.fork.findFirst({
      where: {
        repositoryId: repoId,
        userId,
      },
    });

    if (existingFork) {
      return res.status(400).json({
        success: false,
        message: "You have already forked this repository",
      });
    }

    // Create forked repository + copy branches + files (transaction)
    const forkedRepo = await prisma.$transaction(async (tx) => {
      const newRepo = await tx.repository.create({
        data: {
          name: originalRepo.name,
          description: originalRepo.description,
          ownerId: userId,
        },
      });

      // Copy branches
      const branchIdMap = {};

      for (const branch of originalRepo.branches) {
        const newBranch = await tx.branch.create({
          data: {
            name: branch.name,
            repositoryId: newRepo.id,
          },
        });

        branchIdMap[branch.id] = newBranch.id;
      }

      // Copy files (map to corresponding new branch)
      for (const file of originalRepo.files) {
        await tx.file.create({
          data: {
            name: file.name,
            filename: file.filename,
            content: file.content,
            repositoryId: newRepo.id,
            branchId:
              branchIdMap[file.branchId] || Object.values(branchIdMap)[0],
          },
        });
      }

      // Set current branch (main, if exists)
      const mainBranch = originalRepo.branches.find((b) => b.name === "main");

      if (mainBranch && branchIdMap[mainBranch.id]) {
        await tx.repository.update({
          where: { id: newRepo.id },
          data: { currentBranchId: branchIdMap[mainBranch.id] },
        });
      }

      // Record the fork relationship
      await tx.fork.create({
        data: {
          repositoryId: repoId,
          userId,
        },
      });

      return newRepo;
    });

    res.status(201).json({
      success: true,
      message: "Repository forked successfully",
      repository: forkedRepo,
    });
  } catch (error) {
    console.error("FORK ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
