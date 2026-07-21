import prisma from "../config/prisma.js";

// ===============================
// GET FULL PROFILE (own profile)
// ===============================
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Repo count + total stars received across own repos
    const repositories = await prisma.repository.findMany({
      where: { ownerId: userId },
      include: {
        _count: {
          select: { stars: true },
        },
      },
    });

    const repoCount = repositories.length;
    const totalStars = repositories.reduce(
      (sum, repo) => sum + repo._count.stars,
      0,
    );

    const followersCount = await prisma.follow.count({
      where: { followingId: userId },
    });

    const followingCount = await prisma.follow.count({
      where: { followerId: userId },
    });

    // Popular repositories (top 4 by star count)
    const popularRepos = await prisma.repository.findMany({
      where: { ownerId: userId },
      include: {
        _count: {
          select: { stars: true },
        },
      },
      orderBy: {
        stars: {
          _count: "desc",
        },
      },
      take: 4,
    });

    // Contribution graph data (commits per day, last 365 days)
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);

    const commits = await prisma.commit.findMany({
      where: {
        repository: { ownerId: userId },
        createdAt: { gte: oneYearAgo },
      },
      select: { createdAt: true },
    });

    const contributionMap = {};
    commits.forEach((commit) => {
      const dateKey = commit.createdAt.toISOString().split("T")[0];
      contributionMap[dateKey] = (contributionMap[dateKey] || 0) + 1;
    });

    // Recent activity: created repos + commits, merged and sorted
    const recentRepos = await prisma.repository.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, createdAt: true },
    });

    const recentCommits = await prisma.commit.findMany({
      where: { repository: { ownerId: userId } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        repository: { select: { id: true, name: true } },
      },
    });

    const activity = [
      ...recentRepos.map((repo) => ({
        type: "REPO_CREATED",
        message: `Created repository ${repo.name}`,
        repositoryId: repo.id,
        createdAt: repo.createdAt,
      })),
      ...recentCommits.map((commit) => ({
        type: "COMMIT",
        message: commit.message,
        repositoryId: commit.repository.id,
        repositoryName: commit.repository.name,
        createdAt: commit.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    res.status(200).json({
      success: true,
      user,
      repoCount,
      totalStars,
      followersCount,
      followingCount,
      popularRepos,
      contributions: contributionMap,
      totalContributions: commits.length,
      activity,
    });
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ===============================
// GET ANY USER'S PUBLIC PROFILE (by id)
// ===============================
export const getUserProfileById = async (req, res) => {
  try {
    const targetUserId = Number(req.params.id);
    const currentUserId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const repositories = await prisma.repository.findMany({
      where: { ownerId: targetUserId },
      include: {
        _count: {
          select: { stars: true },
        },
      },
    });

    const repoCount = repositories.length;
    const totalStars = repositories.reduce(
      (sum, repo) => sum + repo._count.stars,
      0,
    );

    const followersCount = await prisma.follow.count({
      where: { followingId: targetUserId },
    });

    const followingCount = await prisma.follow.count({
      where: { followerId: targetUserId },
    });

    // Is current logged-in user following this profile?
    const isFollowing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });

    const popularRepos = await prisma.repository.findMany({
      where: { ownerId: targetUserId },
      include: {
        _count: {
          select: { stars: true },
        },
      },
      orderBy: {
        stars: {
          _count: "desc",
        },
      },
      take: 4,
    });

    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);

    const commits = await prisma.commit.findMany({
      where: {
        repository: { ownerId: targetUserId },
        createdAt: { gte: oneYearAgo },
      },
      select: { createdAt: true },
    });

    const contributionMap = {};
    commits.forEach((commit) => {
      const dateKey = commit.createdAt.toISOString().split("T")[0];
      contributionMap[dateKey] = (contributionMap[dateKey] || 0) + 1;
    });

    const recentRepos = await prisma.repository.findMany({
      where: { ownerId: targetUserId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, createdAt: true },
    });

    const recentCommits = await prisma.commit.findMany({
      where: { repository: { ownerId: targetUserId } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        repository: { select: { id: true, name: true } },
      },
    });

    const activity = [
      ...recentRepos.map((repo) => ({
        type: "REPO_CREATED",
        message: `Created repository ${repo.name}`,
        repositoryId: repo.id,
        createdAt: repo.createdAt,
      })),
      ...recentCommits.map((commit) => ({
        type: "COMMIT",
        message: commit.message,
        repositoryId: commit.repository.id,
        repositoryName: commit.repository.name,
        createdAt: commit.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    res.status(200).json({
      success: true,
      user,
      repoCount,
      totalStars,
      followersCount,
      followingCount,
      isFollowing: !!isFollowing,
      isOwnProfile: currentUserId === targetUserId,
      popularRepos,
      contributions: contributionMap,
      totalContributions: commits.length,
      activity,
    });
  } catch (error) {
    console.error("GET USER PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ===============================
// FOLLOW USER
// ===============================
export const followUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = Number(req.params.id);

    if (followerId === followingId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: followingId },
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already following this user",
      });
    }

    await prisma.follow.create({
      data: { followerId, followingId },
    });

    res.status(201).json({
      success: true,
      message: "User followed successfully",
    });
  } catch (error) {
    console.error("FOLLOW ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// UNFOLLOW USER
// ===============================
export const unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = Number(req.params.id);

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (!existing) {
      return res.status(400).json({
        success: false,
        message: "You are not following this user",
      });
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
    });
  } catch (error) {
    console.error("UNFOLLOW ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET FOLLOWERS LIST
// ===============================
export const getFollowers = async (req, res) => {
  try {
    const userId = req.user.id;

    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    res.json({
      success: true,
      data: followers.map((f) => f.follower),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET FOLLOWING LIST
// ===============================
export const getFollowing = async (req, res) => {
  try {
    const userId = req.user.id;

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: { id: true, username: true, email: true },
        },
      },
    });

    res.json({
      success: true,
      data: following.map((f) => f.following),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
