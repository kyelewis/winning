import { awsJsonQuery } from "./aws";

export const describeLogGroups = async () => {

  const { logGroups } = await awsJsonQuery(
    "logs",
    { Action: "DescribeLogGroups" },
    { "x-amz-target": "Logs_20140328.DescribeLogGroups" }
  );

  console.log(logGroups.map((group) => group.logGroupName).join("\n"));
};
