import { exit } from "process";
import { prompt } from "inquirer";
import { describeLogGroups } from "./logs";

enum Service {
  Logs,
  Quit,
}

(async () => {
  let running = true;

  console.log('winning! 0.1.0');

  while (running) {
    const { service } = await prompt([
      {
        type: "list",
        name: "service",
        message: "Which AWS service would you like to see?",
        choices: [
          { name: "Cloudwatch Logs", value: Service.Logs },
          { name: "Quit", value: Service.Quit },
        ],
      },
    ]);

    try {
      switch (service) {
        case Service.Logs:
          await describeLogGroups();
          break;

        case Service.Quit:
          running = false;
          break;
      }
    } catch (error) {
      console.log(`ERROR: ${error.message}`);
      exit(-1);
    }
  }
  exit(0);
})();
