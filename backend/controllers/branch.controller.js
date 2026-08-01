import prisma from "../config/prisma.js";

// Create Branch
export const createBranch = async (req, res) => {
  try {
    const { name, repositoryId } = req.body;

    const branch = await prisma.branch.create({
      data: {
        name,
        repositoryId: Number(repositoryId),
      },
    });

    res.json({
      success: true,
      data: branch,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get ALL branches (all repositories)
export const getAllBranches = async (req, res) => {
  try {
    const branches = await prisma.branch.findMany({
      include: {
        repository: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).json({
      success: true,
      data: branches,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get all branches of repository
export const getBranches = async (req, res) => {
  try {
    const repositoryId = Number(req.params.repositoryId);

    const branches = await prisma.branch.findMany({
      where: {
        repositoryId,
      },

      orderBy: {
        createdAt: "asc",
      },
    });

    res.status(200).json({
      success: true,

      data: branches,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getBranchesByRepository = async (req, res) => {
  try {
    console.log("PARAMS:", req.params);

    const repositoryId = Number(req.params.repositoryId);

    const branches = await prisma.branch.findMany({
      where: {
        repositoryId: repositoryId,
      },
    });

    return res.status(200).json({
      success: true,
      data: branches,
    });
  } catch (error) {
    console.log("GET BRANCH ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getBranchCommits = async (req, res) => {
  try {
    const branchId = Number(req.params.branchId);

    const commits = await prisma.commit.findMany({
      where: {
        branchId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      data: commits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Branch
export const deleteBranch = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const branch = await prisma.branch.findUnique({
      where: {
        id,
      },
    });

    if (!branch) {
      return res.status(404).json({
        success: false,

        message: "Branch not found",
      });
    }

    await prisma.branch.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,

      message: "Branch deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// Checkout Branch
export const checkoutBranch = async (req, res) => {
  try {
    const branchId = Number(req.params.branchId);

    // Find branch
    const branch = await prisma.branch.findUnique({
      where: {
        id: branchId,
      },
    });

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    // Update repository current branch
    await prisma.repository.update({
      where: {
        id: branch.repositoryId,
      },
      data: {
        currentBranchId: branch.id,
      },
    });

    res.json({
      success: true,
      message: `Switched to '${branch.name}' branch`,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Merge Branch
export const mergeBranch = async (req, res) => {
  try {
    const { sourceBranchId, targetBranchId, message } = req.body;

    // Check source branch
    const sourceBranch = await prisma.branch.findUnique({
      where: {
        id: Number(sourceBranchId),
      },
    });

    if (!sourceBranch) {
      return res.status(404).json({
        success: false,
        message: "Source branch not found",
      });
    }

    // Check target branch
    const targetBranch = await prisma.branch.findUnique({
      where: {
        id: Number(targetBranchId),
      },
    });

    if (!targetBranch) {
      return res.status(404).json({
        success: false,
        message: "Target branch not found",
      });
    }

    // Create merge commit
    const commit = await prisma.commit.create({
      data: {
        repositoryId: targetBranch.repositoryId,
        branchId: targetBranch.id,
        message,
      },
    });

    res.status(201).json({
      success: true,
      message: "Branch merged successfully",
      data: commit,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Switch Branch
export const switchBranch = async (req, res) => {
  try {
    const branchId = Number(req.params.branchId);

    // Find branch
    const branch = await prisma.branch.findUnique({
      where: {
        id: branchId,
      },
    });

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    // Update repository current branch
    const updatedRepository = await prisma.repository.update({
      where: {
        id: branch.repositoryId,
      },
      data: {
        currentBranchId: branch.id,
      },
      include: {
        currentBranch: true,
      },
    });

    res.status(200).json({
      success: true,
      message: `Switched to '${branch.name}' branch`,
      repository: updatedRepository,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
