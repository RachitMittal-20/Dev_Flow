export const metricDefinitions = {
  leadTime: "Avg days from PR opened to successful production deployment",
  cycleTime: "Avg days from issue moved to In Progress to marked Done",
  prThroughput: "Count of merged pull requests in the month",
  deployments: "Count of successful production deployments in the month",
  bugRate: "Escaped production bugs found ÷ issues completed (this month)"
};

export function getLeadThreshold(value) {
  if (value <= 2.5) {
    return "green";
  }
  if (value <= 4) {
    return "amber";
  }
  return "red";
}

export function getCycleThreshold(value) {
  if (value <= 4) {
    return "green";
  }
  if (value <= 5.5) {
    return "amber";
  }
  return "red";
}

export function getBugThreshold(value) {
  if (value === 0) {
    return "green";
  }
  if (value <= 0.25) {
    return "amber";
  }
  return "red";
}

export function getThroughputThreshold(value) {
  if (value >= 3) {
    return "green";
  }
  if (value >= 1) {
    return "amber";
  }
  return "red";
}
