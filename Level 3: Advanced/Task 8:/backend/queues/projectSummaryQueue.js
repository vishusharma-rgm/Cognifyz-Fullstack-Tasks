const Queue = require("bull");

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const projectSummaryQueue = new Queue("weekly-project-summary", redisUrl, {
  defaultJobOptions: {
    attempts: 2,
    removeOnComplete: true,
    removeOnFail: 25
  }
});

projectSummaryQueue.process(async (job) => {
  const { generatedAt } = job.data;
  console.log(`Weekly Project Summary email simulated at ${generatedAt}`);
  return { delivered: true, generatedAt };
});

projectSummaryQueue.on("failed", (job, error) => {
  console.error(`Weekly summary job ${job.id} failed:`, error.message);
});

async function scheduleWeeklyProjectSummary() {
  try {
    await projectSummaryQueue.add(
      { generatedAt: new Date().toISOString() },
      {
        repeat: { cron: "0 9 * * 1" },
        jobId: "weekly-project-summary"
      }
    );
    console.log("Weekly Project Summary queue scheduled");
  } catch (error) {
    console.error("Weekly Project Summary queue skipped:", error.message);
  }
}

module.exports = {
  projectSummaryQueue,
  scheduleWeeklyProjectSummary
};
