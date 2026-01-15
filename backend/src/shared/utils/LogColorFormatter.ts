import chalk from "chalk";

export class LogColorFormatter {
  static HttpMethod(method: string) {
    switch (method) {
      case "GET":
        return chalk.green(method);
      case "POST":
        return chalk.yellow(method);
      case "PUT":
        return chalk.blue(method);
      case "DELETE":
        return chalk.red(method);
      case "PATCH":
        return chalk.cyan(method);
      default:
        return chalk.white(method);
    }
  }

  static StatusCode(statusCode: number) {
    if (statusCode >= 500) {
      return chalk.bgRedBright(statusCode);
    } else if (statusCode >= 400) {
      return chalk.red(statusCode);
    } else if (statusCode >= 300) {
      return chalk.cyan(statusCode);
    } else if (statusCode >= 200) {
      return chalk.green(statusCode);
    } else {
      return chalk.white(statusCode);
    }
  }

  static ResponseTime(responseTime: number) {
    if (responseTime > 1000) {
      return chalk.red(`${responseTime.toFixed(2)} ms`);
    } else if (responseTime > 300) {
      return chalk.yellow(`${responseTime.toFixed(2)} ms`);
    } else {
      return chalk.green(`${responseTime.toFixed(2)} ms`);
    }
  }
}
