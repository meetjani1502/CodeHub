import prisma from "../config/prisma.js";

// ===============================
// Add Star
// ===============================
export const addStar = async (req, res) => {
  try {
    const { repositoryId } = req.body;
    const userId = req.user.id;

    // Check repository exists
    const repository = await prisma.repository.findUnique({
      where: {
        id: Number(repositoryId),
      },
    });

    if (!repository) {
      return res.status(404).json({
        success: false,
        message: "Repository not found",
      });
    }

    // Check already starred
    const existingStar = await prisma.star.findUnique({
      where: {
        userId_repositoryId: {
          userId,
          repositoryId: Number(repositoryId),
        },
      },
    });

    if (existingStar) {
      return res.status(400).json({
        success: false,
        message: "Repository already starred",
      });
    }

    const star = await prisma.star.create({
      data: {
        userId,
        repositoryId: Number(repositoryId),
      },
    });

    res.status(201).json({
      success: true,
      message: "Repository starred successfully",
      star,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Remove Star
// ===============================
export const removeStar = async (req, res) => {
  try {
    const { repositoryId } = req.body;
    const userId = req.user.id;

    await prisma.star.delete({
      where: {
        userId_repositoryId: {
          userId,
          repositoryId: Number(repositoryId),
        },
      },
    });

    res.json({
      success: true,
      message: "Star removed successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Get Star Count
// ===============================
export const getStarCount = async (req, res) => {
  try {
    const { repositoryId } = req.params;

    const totalStars = await prisma.star.count({
      where: {
        repositoryId: Number(repositoryId),
      },
    });

    res.json({
      success: true,
      totalStars,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// Check Star Status
// ===============================
export const isStarred = async (req, res) => {
  try {
    const { repositoryId } = req.params;
    const userId = req.user.id;

    const star = await prisma.star.findUnique({
      where: {
        userId_repositoryId: {
          userId,
          repositoryId: Number(repositoryId),
        },
      },
    });

    res.json({
      success: true,
      starred: !!star,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const starRepository = async (req, res) => {
  try {
    const { id } = req.params;

    const repository = await prisma.repository.update({
      where: {
        id: Number(id),
      },
      data: {
        stars: {
          increment: 1,
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
