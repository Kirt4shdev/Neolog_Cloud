import chalk from "chalk";
import debugLib from "debug";

const debug = debugLib("backend:dev");

export class Debug {
  public static info(message: string | object, isJSON: boolean = false): void {
    debug(
      chalk.underline.cyan("INFO"),
      isJSON ? JSON.stringify(message, null, 2) : message
    );
  }

  public static success(
    message: string | object,
    isJSON: boolean = false
  ): void {
    debug(
      chalk.underline.greenBright("SUCCESS"),
      isJSON ? JSON.stringify(message, null, 2) : message
    );
  }

  public static warning(
    message: string | object,
    isJSON: boolean = false
  ): void {
    debug(
      chalk.underline.yellow("WARNING"),
      isJSON ? JSON.stringify(message, null, 2) : message
    );
  }

  public static error(message: string | object, isJSON: boolean = false): void {
    debug(
      chalk.bgRed("ERROR"),
      isJSON ? JSON.stringify(message, null, 2) : message
    );
  }
}
