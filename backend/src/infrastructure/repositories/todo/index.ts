import "reflect-metadata";
import { container } from "tsyringe";
import { TodoRepository } from "./TodoRepository";

export function registerTodoDependencies() {
  container.registerSingleton("ITodoRepository", TodoRepository);
}
