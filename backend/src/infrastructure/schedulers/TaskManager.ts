import { Task } from "./Task";
import { tarea1 } from "./tasks/tarea1";
import { tarea2 } from "./tasks/tarea2";

export class TaskManager {
  static async init() {
    await Task.launch({
      taskName: "tarea1",
      interval: "*/3 * * * * *",
      task: tarea1,
    });

    await Task.launch({
      taskName: "tarea2",
      interval: "*/5 * * * * *",
      task: tarea2,
    });
  }
}
