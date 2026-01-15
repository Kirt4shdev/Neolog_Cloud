import { scheduleJob } from "node-schedule";
import { Debug } from "../../shared/utils/Debug";
import { PerformanceTimer } from "../../shared/utils/PerformanceTimer";
import { TaskService } from "./TaskService";

const timer = new PerformanceTimer();

export class Task {
  static async launch(task: TaskProps): Promise<void> {
    if (!task?.taskName || !task?.interval || !task?.task) {
      throw new Error(
        "Task Manager: Missing required task properties (taskName, interval, task)"
      );
    }
    if (typeof task?.taskName !== "string") {
      throw new Error("Task Manager: taskName must be a string");
    }
    if (typeof task?.interval !== "string") {
      throw new Error("Task Manager: interval must be a string");
    }
    if (typeof task?.task !== "function") {
      throw new Error("Task Manager: task must be a function");
    }

    scheduleJob(task?.taskName, task?.interval, async () => {
      let status = true;
      let error: string = "";

      timer.init();

      Debug.info(`Task Manager: Running scheduled task "${task?.taskName}"...`);

      await task
        .task()
        .catch((err) => {
          status = false;
          error = err?.message || String(err);
          Debug.error(
            `TaskManager: Error occurred while running task "${task?.taskName}": ${err}`
          );
        })
        .finally(async () => {
          const duration = timer.stop();

          Debug.info(
            `Task Manager: Task "${
              task?.taskName
            }" completed in ${duration.toFixed(2)}ms`
          );

          await TaskService.postTask({
            title: task?.taskName,
            interval: task?.interval,
            executeStatus: status,
            executedAt: new Date(),
            error: error || null,
          });
        });

      return;
    });
  }
}
