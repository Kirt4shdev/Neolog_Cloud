import { database } from "../database/PostgresDatabase";

export class TaskService {
  static async postTask(props: PostTaskServiceProps): Promise<void> {
    const { executeStatus, executedAt, interval, title, error } = props;

    const { error: err, result } = await database.query({
      query:
        "INSERT INTO tasks(title, interval, execute_status, executed_at, error) VALUES($1, $2, $3, $4, $5) RETURNING *",
      params: [
        title,
        interval,
        executeStatus.toString(),
        executedAt.toISOString(),
        error ?? "",
      ],
      single: true,
      emptyResponseMessageError: "Failed to post task",
    });

    if (err) throw new Error(`TaskService: ${err}`);
    if (!result) throw new Error("Failed to post task");

    return;
  }
}
