import prisma from "../config/prisma.js";

// Create Commit
export const createCommit = async (req, res) => {
  try {
    const { repositoryId, branchId, message } = req.body;

    const repoId = Number(repositoryId);

    if (!repoId) {
      return res.status(400).json({
        success: false,
        message: "Repository ID is required",
      });
    }

    // Get repository
    const repository = await prisma.repository.findUnique({
      where: {
        id: repoId,
      },
    });

    if (!repository) {
      return res.status(404).json({
        success: false,
        message: "Repository not found",
      });
    }

    // Decide which branch to use
    let finalBranchId;

    if (branchId) {
      finalBranchId = Number(branchId);
    } else {
      finalBranchId = repository.currentBranchId;
    }

    if (!finalBranchId) {
      return res.status(400).json({
        success: false,
        message: "Repository has no active branch.",
      });
    }

    // Check branch exists
    const branchData = await prisma.branch.findUnique({
      where: {
        id: finalBranchId,
      },
    });

    if (!branchData) {
      return res.status(404).json({
        success: false,
        message: "Branch not found",
      });
    }

    // Get repository files
    const files = await prisma.file.findMany({
      where: {
        repositoryId: repoId,
      },
    });

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files found in this repository.",
      });
    }

    // Create commit + snapshot
    const commit = await prisma.$transaction(async (tx) => {
      const newCommit = await tx.commit.create({
        data: {
          repositoryId: Number(repositoryId),
          branchId: Number(branchId),
          message,
        },
      });

      for (const file of files) {
        await tx.fileVersion.create({
          data: {
            fileId: file.id,
            commitId: newCommit.id,
            filename: file.filename,
            content: file.content,
          },
        });
      }

      return newCommit;
    });

    res.status(201).json({
      success: true,
      message: "Commit created successfully",
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

// Get all commits of repository
export const getCommits = async (req, res) => {
  try {
    const repositoryId = Number(req.params.repositoryId);

    const commits = await prisma.commit.findMany({
      where: {
        repositoryId,
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

// Get single commit
export const getCommit = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const commit = await prisma.commit.findUnique({
      where: {
        id,
      },
    });

    if (!commit) {
      return res.status(404).json({
        success: false,

        message: "Commit not found",
      });
    }

    res.json({
      success: true,

      data: commit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// Get commit files
export const getCommitFiles = async (req, res) => {
  try {
    const commitId = Number(req.params.commitId);

    const files = await prisma.fileVersion.findMany({
      where: {
        commitId,
      },

      orderBy: {
        id: "asc",
      },
    });

    res.json({
      success: true,

      data: files,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// Restore Commit
export const restoreCommit = async (req, res) => {
  try {
    const commitId = Number(req.params.commitId);

    const files = await prisma.fileVersion.findMany({
      where: {
        commitId,
      },
    });

    if (files.length === 0) {
      return res.status(404).json({
        success: false,

        message: "No files found for this commit",
      });
    }

    for (const file of files) {
      await prisma.file.update({
        where: {
          id: file.fileId,
        },

        data: {
          filename: file.filename,

          content: file.content,
        },
      });
    }

    res.json({
      success: true,

      message: "Commit restored successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// Compare commits
export const getCommitDiff = async (req, res) => {
  try {
    const oldCommitId = Number(req.params.oldCommitId);

    const newCommitId = Number(req.params.newCommitId);

    const oldFiles = await prisma.fileVersion.findMany({
      where: {
        commitId: oldCommitId,
      },
    });

    const newFiles = await prisma.fileVersion.findMany({
      where: {
        commitId: newCommitId,
      },
    });

    const diff = newFiles.map((newFile) => {
      const oldFile = oldFiles.find((old) => old.filename === newFile.filename);

      return {
        filename: newFile.filename,

        oldContent: oldFile ? oldFile.content : null,

        newContent: newFile.content,
      };
    });

    res.json({
      success: true,

      data: diff,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

// Get commits by branch
export const getBranchCommits = async (req, res) => {
  try {
    const branchId = Number(req.params.branchId);

    const commits = await prisma.commit.findMany({
      where: {
        branchId: branchId,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,

      data: commits,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getCommitsByRepository = async (req, res) => {
  try {
    const { repositoryId } = req.params;

    const commits = await prisma.commit.findMany({
      where: {
        repositoryId: Number(repositoryId),
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
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCommitDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const commit = await prisma.commit.findUnique({
      where: {
        id: Number(id),
      },

      include: {
        fileVersions: true,
      },
    });

    if (!commit) {
      return res.status(404).json({
        success: false,
        message: "Commit not found",
      });
    }

    res.json({
      success: true,

      data: commit,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export default {
  createCommit,

  getCommits,

  getCommit,

  getCommitFiles,

  restoreCommit,

  getCommitDiff,

  getBranchCommits,

  getCommitsByRepository,
};
