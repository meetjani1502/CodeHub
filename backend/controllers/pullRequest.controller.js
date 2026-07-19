import prisma from "../config/prisma.js";

// ===============================
// CREATE PULL REQUEST
// ===============================

export const createPullRequest = async (req, res) => {
  try {
    const { title, description, repositoryId, sourceBranchId, targetBranchId } =
      req.body;

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

    const pullRequest = await prisma.pullRequest.create({
      data: {
        title,
        description,

        repositoryId: Number(repositoryId),

        sourceBranchId: Number(sourceBranchId),

        targetBranchId: Number(targetBranchId),
      },
    });

    res.status(201).json({
      success: true,

      message: "Pull Request created successfully",

      data: pullRequest,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ===============================
// GET ALL PULL REQUESTS
// ===============================

export const getPullRequests = async (req, res) => {
  try {
    const repositoryId = Number(req.params.repositoryId);

    const pullRequests = await prisma.pullRequest.findMany({
      where: {
        OR: [
          {
            sourceBranch: {
              repositoryId,
            },
          },

          {
            targetBranch: {
              repositoryId,
            },
          },
        ],
      },

      include: {
        sourceBranch: true,

        targetBranch: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,

      data: pullRequests,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ===============================
// GET SINGLE PULL REQUEST
// ===============================

export const getPullRequestById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const pullRequest = await prisma.pullRequest.findUnique({
      where: {
        id,
      },

      include: {
        sourceBranch: true,

        targetBranch: true,
      },
    });

    if (!pullRequest) {
      return res.status(404).json({
        success: false,

        message: "Pull Request not found",
      });
    }

    res.json({
      success: true,

      data: pullRequest,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ===============================
// APPROVE PULL REQUEST
// ===============================

export const approvePullRequest = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const pullRequest = await prisma.pullRequest.findUnique({
      where: {
        id,
      },
    });

    if (!pullRequest) {
      return res.status(404).json({
        success: false,

        message: "Pull Request not found",
      });
    }

    const updatedPR = await prisma.pullRequest.update({
      where: {
        id,
      },

      data: {
        status: "APPROVED",
      },
    });

    res.json({
      success: true,

      message: "Pull Request Approved",

      data: updatedPR,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ===============================
// REJECT PULL REQUEST
// ===============================

export const rejectPullRequest = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const pullRequest = await prisma.pullRequest.findUnique({
      where: {
        id,
      },
    });

    if (!pullRequest) {
      return res.status(404).json({
        success: false,

        message: "Pull Request not found",
      });
    }

    const updatedPR = await prisma.pullRequest.update({
      where: {
        id,
      },

      data: {
        status: "REJECTED",
      },
    });

    res.json({
      success: true,

      message: "Pull Request rejected",

      data: updatedPR,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ===============================
// MERGE PULL REQUEST
// ===============================

export const mergePullRequest = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const pullRequest = await prisma.pullRequest.findUnique({
      where: {
        id,
      },
    });

    if (!pullRequest) {
      return res.status(404).json({
        success: false,

        message: "Pull Request not found",
      });
    }

    if (pullRequest.status !== "APPROVED") {
      return res.status(400).json({
        success: false,

        message: "Pull Request must be approved first",
      });
    }

    const sourceRepositoryId = await getRepositoryId(
      pullRequest.sourceBranchId,
    );

    const targetRepositoryId = await getRepositoryId(
      pullRequest.targetBranchId,
    );

    // Get source files

    const sourceFiles = await prisma.file.findMany({
      where: {
        repositoryId: sourceRepositoryId,
      },
    });

    // Copy source files into target repository

    for (const file of sourceFiles) {
      const existingFile = await prisma.file.findFirst({
        where: {
          repositoryId: targetRepositoryId,

          filename: file.filename,
        },
      });

      if (existingFile) {
        await prisma.file.update({
          where: {
            id: existingFile.id,
          },

          data: {
            content: file.content,
          },
        });
      } else {
        await prisma.file.create({
          data: {
            repositoryId: targetRepositoryId,

            filename: file.filename,

            content: file.content,
          },
        });
      }
    }

    // Create merge commit

    const mergeCommit = await prisma.commit.create({
      data: {
        repositoryId: targetRepositoryId,

        branchId: pullRequest.targetBranchId,

        message: `Merge PR #${id}: ${pullRequest.title}`,
      },
    });

    // Create File Versions

    const targetFiles = await prisma.file.findMany({
      where: {
        repositoryId: targetRepositoryId,
      },
    });

    for (const file of targetFiles) {
      await prisma.fileVersion.create({
        data: {
          fileId: file.id,

          commitId: mergeCommit.id,

          filename: file.filename,

          content: file.content,
        },
      });
    }

    // Update PR status

    const updatedPR = await prisma.pullRequest.update({
      where: {
        id,
      },

      data: {
        status: "MERGED",
      },
    });

    res.json({
      success: true,

      message: "Pull Request merged successfully",

      commit: mergeCommit,

      pullRequest: updatedPR,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// ===============================
// GET REPOSITORY ID USING BRANCH
// ===============================

const getRepositoryId = async (branchId) => {
  const branch = await prisma.branch.findUnique({
    where: {
      id: Number(branchId),
    },
  });

  if (!branch) {
    throw new Error("Branch not found");
  }

  return branch.repositoryId;
};

// ===============================
// GET PULL REQUEST DIFF
// ===============================

export const getPullRequestDiff = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const pullRequest = await prisma.pullRequest.findUnique({
      where: {
        id,
      },

      include: {
        sourceBranch: true,

        targetBranch: true,
      },
    });

    if (!pullRequest) {
      return res.status(404).json({
        success: false,

        message: "Pull Request not found",
      });
    }

    const sourceFiles = await prisma.file.findMany({
      where: {
        repositoryId: pullRequest.sourceBranch.repositoryId,
      },
    });

    const targetFiles = await prisma.file.findMany({
      where: {
        repositoryId: pullRequest.targetBranch.repositoryId,
      },
    });

    let changes = [];

    // Added and Modified Files

    sourceFiles.forEach((sourceFile) => {
      const targetFile = targetFiles.find(
        (file) => file.filename === sourceFile.filename,
      );

      // New file

      if (!targetFile) {
        changes.push({
          filename: sourceFile.filename,

          type: "ADDED",

          newContent: sourceFile.content,
        });
      }

      // Modified file
      else if (targetFile.content !== sourceFile.content) {
        changes.push({
          filename: sourceFile.filename,

          type: "MODIFIED",

          oldContent: targetFile.content,

          newContent: sourceFile.content,
        });
      }
    });

    // Deleted Files

    targetFiles.forEach((targetFile) => {
      const sourceFile = sourceFiles.find(
        (file) => file.filename === targetFile.filename,
      );

      if (!sourceFile) {
        changes.push({
          filename: targetFile.filename,

          type: "DELETED",

          oldContent: targetFile.content,
        });
      }
    });

    res.json({
      success: true,

      data: changes,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
