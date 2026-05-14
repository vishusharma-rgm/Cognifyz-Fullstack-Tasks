const { redisClient, redisIsReady } = require("../config/redis");

const PROJECTS_CACHE_TTL = 60;

function projectsCacheKey(userId) {
  return `workspace:projects:${userId}`;
}

async function cacheProjects(req, res, next) {
  if (!redisIsReady()) {
    return next();
  }

  try {
    const cachedProjects = await redisClient.get(projectsCacheKey(req.user._id));

    if (cachedProjects) {
      return res.status(200).json({
        success: true,
        source: "cache",
        data: JSON.parse(cachedProjects)
      });
    }
  } catch (error) {
    console.error("Project cache read failed:", error.message);
  }

  next();
}

async function setProjectsCache(userId, projects) {
  if (!redisIsReady()) {
    return;
  }

  try {
    await redisClient.setEx(projectsCacheKey(userId), PROJECTS_CACHE_TTL, JSON.stringify(projects));
  } catch (error) {
    console.error("Project cache write failed:", error.message);
  }
}

async function invalidateProjectsCache(userId) {
  if (!redisIsReady()) {
    return;
  }

  try {
    await redisClient.del(projectsCacheKey(userId));
  } catch (error) {
    console.error("Project cache invalidation failed:", error.message);
  }
}

module.exports = {
  cacheProjects,
  invalidateProjectsCache,
  setProjectsCache
};
