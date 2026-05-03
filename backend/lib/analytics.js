const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric"
});

const metricConfigs = {
  leadTime: {
    field: "avg_lead_time_days",
    label: "Lead Time",
    unit: "days",
    better: "lower",
    ideal: 2.5,
    acceptable: 4,
    targetLabel: "<= 2.5d ideal / <= 4.0d acceptable",
    positiveVerb: "faster",
    negativeVerb: "slower"
  },
  cycleTime: {
    field: "avg_cycle_time_days",
    label: "Cycle Time",
    unit: "days",
    better: "lower",
    ideal: 4,
    acceptable: 5.5,
    targetLabel: "<= 4.0d ideal / <= 5.5d acceptable",
    positiveVerb: "faster",
    negativeVerb: "slower"
  },
  prThroughput: {
    field: "merged_prs",
    label: "PR Throughput",
    unit: "count",
    better: "higher",
    ideal: 3,
    acceptable: 1,
    targetLabel: ">= 3 ideal / >= 1 acceptable",
    positiveVerb: "higher",
    negativeVerb: "lower"
  },
  deployments: {
    field: "prod_deployments",
    label: "Deployment Frequency",
    unit: "count",
    better: "higher",
    ideal: 3,
    acceptable: 1,
    targetLabel: ">= 3 ideal / >= 1 acceptable",
    positiveVerb: "higher",
    negativeVerb: "lower"
  },
  bugRate: {
    field: "bug_rate_pct",
    label: "Bug Rate",
    unit: "percent",
    better: "lower",
    ideal: 0,
    acceptable: 0.25,
    targetLabel: "0% ideal / <= 25% acceptable",
    positiveVerb: "lower",
    negativeVerb: "higher"
  }
};

const managerMetricConfigs = {
  leadTime: metricConfigs.leadTime,
  cycleTime: metricConfigs.cycleTime,
  bugRate: {
    field: "avg_bug_rate_pct",
    label: "Bug Rate",
    unit: "percent",
    better: "lower",
    ideal: 0,
    acceptable: 0.25,
    targetLabel: "0% ideal / <= 25% acceptable",
    positiveVerb: "lower",
    negativeVerb: "higher"
  }
};

const patternPriority = {
  "Needs review": 0,
  "Quality watch": 1,
  "Watch bottlenecks": 1,
  "Healthy flow": 2
};

function sortByMonth(left, right) {
  return left.month.localeCompare(right.month);
}

function monthToDate(month) {
  const [year, monthIndex] = month.split("-");
  return new Date(Number(year), Number(monthIndex) - 1, 1);
}

function formatMonth(month) {
  return month ? monthFormatter.format(monthToDate(month)) : "";
}

function round(value, decimals = 2) {
  return Number(value.toFixed(decimals));
}

function formatMetricValue(value, unit) {
  if (unit === "days") {
    return `${value.toFixed(2)}d`;
  }
  if (unit === "percent") {
    const percentValue = value * 100;
    const display =
      Math.abs(percentValue - Math.round(percentValue)) < 0.05
        ? Math.round(percentValue).toString()
        : percentValue.toFixed(1);

    return `${display}%`;
  }

  return `${value}`;
}

function formatDeltaMagnitude(value, unit) {
  if (unit === "days") {
    return `${Math.abs(value).toFixed(2)}d`;
  }
  if (unit === "percent") {
    const points = Math.abs(value) * 100;
    const display =
      Math.abs(points - Math.round(points)) < 0.05
        ? Math.round(points).toString()
        : points.toFixed(1);

    return `${display} pts`;
  }

  return `${Math.abs(Math.round(value))}`;
}

function findPreviousRecord(records, matcher, month) {
  return records
    .filter((entry) => matcher(entry) && entry.month < month)
    .sort(sortByMonth)
    .at(-1) || null;
}

function buildComparisonEntry(currentValue, previousValue, previousMonth, config) {
  if (previousValue == null || !previousMonth) {
    return {
      hasPrevious: false,
      currentValue,
      previousValue: null,
      previousMonth: null,
      delta: null,
      direction: "flat",
      sentiment: "neutral",
      shortLabel: "Baseline",
      label: "Baseline month"
    };
  }

  const rawDelta = currentValue - previousValue;
  const delta =
    config.unit === "percent" ? round(rawDelta, 3) : round(rawDelta, 2);

  if (rawDelta === 0) {
    return {
      hasPrevious: true,
      currentValue,
      previousValue,
      previousMonth,
      delta,
      direction: "flat",
      sentiment: "neutral",
      shortLabel: "0",
      label: `No change vs ${formatMonth(previousMonth)}`
    };
  }

  const improved =
    config.better === "lower" ? rawDelta < 0 : rawDelta > 0;
  const sentiment = improved ? "positive" : "negative";
  const direction = rawDelta > 0 ? "up" : "down";
  const magnitude = formatDeltaMagnitude(rawDelta, config.unit);
  const verb = improved ? config.positiveVerb : config.negativeVerb;
  const sign = rawDelta > 0 ? "+" : "-";

  return {
    hasPrevious: true,
    currentValue,
    previousValue,
    previousMonth,
    delta,
    direction,
    sentiment,
    shortLabel: `${sign}${magnitude}`,
    label: `${magnitude} ${verb} vs ${formatMonth(previousMonth)}`
  };
}

function buildComparisons(record, previousRecord, configs) {
  return Object.entries(configs).reduce((result, [key, config]) => {
    result[key] = buildComparisonEntry(
      record[config.field],
      previousRecord?.[config.field] ?? null,
      previousRecord?.month ?? null,
      config
    );
    return result;
  }, {});
}

function getBenchmarkStatus(value, config) {
  if (config.better === "lower") {
    if (value <= config.ideal) {
      return "within target";
    }
    if (value <= config.acceptable) {
      return "watch";
    }
    return "needs attention";
  }

  if (value >= config.ideal) {
    return "within target";
  }
  if (value >= config.acceptable) {
    return "watch";
  }
  return "needs attention";
}

function buildBenchmarks(record, configs) {
  return Object.entries(configs).map(([key, config]) => ({
    key,
    label: config.label,
    status: getBenchmarkStatus(record[config.field], config),
    targetLabel: config.targetLabel,
    currentLabel: formatMetricValue(record[config.field], config.unit)
  }));
}

function buildDeveloperAnomalies(comparisons) {
  const anomalies = [];

  if (comparisons.leadTime.hasPrevious) {
    if (comparisons.leadTime.delta >= 0.75) {
      anomalies.push({
        tone: "negative",
        title: "Lead time spiked",
        detail: comparisons.leadTime.label
      });
    } else if (comparisons.leadTime.delta <= -0.75) {
      anomalies.push({
        tone: "positive",
        title: "Lead time improved",
        detail: comparisons.leadTime.label
      });
    }
  }

  if (comparisons.cycleTime.hasPrevious) {
    if (comparisons.cycleTime.delta >= 0.75) {
      anomalies.push({
        tone: "negative",
        title: "Cycle time stretched",
        detail: comparisons.cycleTime.label
      });
    } else if (comparisons.cycleTime.delta <= -0.75) {
      anomalies.push({
        tone: "positive",
        title: "Cycle time improved",
        detail: comparisons.cycleTime.label
      });
    }
  }

  if (comparisons.bugRate.hasPrevious && comparisons.bugRate.delta !== 0) {
    anomalies.push({
      tone: comparisons.bugRate.delta < 0 ? "positive" : "negative",
      title:
        comparisons.bugRate.delta < 0
          ? "Bug rate improved"
          : "Bug rate worsened",
      detail: comparisons.bugRate.label
    });
  }

  if (comparisons.deployments.hasPrevious && comparisons.deployments.delta !== 0) {
    anomalies.push({
      tone: comparisons.deployments.delta > 0 ? "positive" : "negative",
      title:
        comparisons.deployments.delta > 0
          ? "Release cadence accelerated"
          : "Release cadence slowed",
      detail: comparisons.deployments.label
    });
  }

  if (comparisons.prThroughput.hasPrevious && comparisons.prThroughput.delta !== 0) {
    anomalies.push({
      tone: comparisons.prThroughput.delta > 0 ? "positive" : "negative",
      title:
        comparisons.prThroughput.delta > 0
          ? "PR throughput climbed"
          : "PR throughput slipped",
      detail: comparisons.prThroughput.label
    });
  }

  return anomalies.length > 0
    ? anomalies.slice(0, 4)
    : [
        {
          tone: "neutral",
          title: "Stable month-over-month pattern",
          detail: "The main delivery metrics held steady compared with the prior month."
        }
      ];
}

function buildManagerAnomalies(comparisons, signal) {
  const anomalies = [];

  if (comparisons.leadTime.hasPrevious && comparisons.leadTime.delta !== 0) {
    anomalies.push({
      tone: comparisons.leadTime.delta < 0 ? "positive" : "negative",
      title:
        comparisons.leadTime.delta < 0
          ? "Lead time improved"
          : "Lead time expanded",
      detail: comparisons.leadTime.label
    });
  }

  if (comparisons.cycleTime.hasPrevious && comparisons.cycleTime.delta !== 0) {
    anomalies.push({
      tone: comparisons.cycleTime.delta < 0 ? "positive" : "negative",
      title:
        comparisons.cycleTime.delta < 0
          ? "Cycle time tightened"
          : "Cycle time slowed",
      detail: comparisons.cycleTime.label
    });
  }

  if (comparisons.bugRate.hasPrevious && comparisons.bugRate.delta !== 0) {
    anomalies.push({
      tone: comparisons.bugRate.delta < 0 ? "positive" : "negative",
      title:
        comparisons.bugRate.delta < 0
          ? "Bug rate improved"
          : "Bug rate worsened",
      detail: comparisons.bugRate.label
    });
  }

  if (anomalies.length === 0) {
    anomalies.push({
      tone: "neutral",
      title: signal === "Healthy flow" ? "Signal stayed healthy" : "Signal held steady",
      detail: "Manager-level delivery patterns were broadly consistent with the prior month."
    });
  }

  return anomalies.slice(0, 4);
}

function buildDeveloperTimeline(record, developer) {
  const seed = Number(developer.developer_id.replace(/\D/g, ""));
  const [year, monthIndex] = record.month.split("-");
  const daysInMonth = new Date(Number(year), Number(monthIndex), 0).getDate();
  const toDate = (day) =>
    `${record.month}-${String(Math.min(day, daysInMonth)).padStart(2, "0")}`;

  const baseOffset = seed % 4;
  const events = [
    {
      date: toDate(3 + baseOffset),
      type: "issue",
      title: `${record.issues_done} tickets moved into active delivery`,
      detail: `${developer.developer_name} took scoped work into execution early in the month.`
    },
    {
      date: toDate(8 + baseOffset),
      type: "pr",
      title: `${record.merged_prs} PRs merged`,
      detail: "Review flow converted in-flight work into merge-ready code."
    },
    {
      date: toDate(14 + baseOffset),
      type: "deploy",
      title: `${record.prod_deployments} production deployments shipped`,
      detail: "Merged changes progressed through release and reached production."
    }
  ];

  if (record.escaped_bugs > 0) {
    events.push({
      date: toDate(21 + baseOffset),
      type: "bug",
      title: `${record.escaped_bugs} escaped bug${record.escaped_bugs > 1 ? "s" : ""} found`,
      detail: "A production issue triggered follow-up review and remediation."
    });
  } else {
    events.push({
      date: toDate(22 + baseOffset),
      type: "quality",
      title: "No escaped bugs reported",
      detail: "Production quality held clean through the rest of the month."
    });
  }

  return events.sort((left, right) => left.date.localeCompare(right.date));
}

function buildManagerTimeline(teamMembers) {
  return teamMembers
    .flatMap((member) =>
      member.activityTimeline.map((event) => ({
        ...event,
        title: `${member.developer_name}: ${event.title}`
      }))
    )
    .sort((left, right) => left.date.localeCompare(right.date))
    .slice(0, 10);
}

function buildSignalBreakdown(teamMembers) {
  const counts = teamMembers.reduce((result, member) => {
    result[member.pattern_hint] = (result[member.pattern_hint] || 0) + 1;
    return result;
  }, {});

  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((left, right) => (patternPriority[left.label] ?? 99) - (patternPriority[right.label] ?? 99));
}

function buildDeveloperNarrative(record, anomalies) {
  const primaryAnomaly = anomalies.find((entry) => entry.tone !== "neutral");

  if (primaryAnomaly) {
    return `${record.pattern_hint} this month. ${primaryAnomaly.title} and the delivery story shifted compared with the prior month.`;
  }

  return `${record.pattern_hint} this month. Delivery pace, release cadence, and quality all stayed broadly steady from the previous period.`;
}

function buildManagerNarrative(managerRecord, anomalies, signalBreakdown) {
  const prominent = anomalies.find((entry) => entry.tone !== "neutral");
  const mix =
    signalBreakdown.length > 0
      ? signalBreakdown.map((entry) => `${entry.count} ${entry.label.toLowerCase()}`).join(", ")
      : "a balanced team signal mix";

  if (prominent) {
    return `${managerRecord.signal} right now, with ${mix} across the team. ${prominent.title} is the clearest month-over-month shift.`;
  }

  return `${managerRecord.signal} right now, with ${mix} across the team. The overall manager story remained stable versus the previous month.`;
}

function buildManagerActions(managerRecord, teamMembers) {
  const actions = [];
  const membersWithBugRisk = teamMembers.filter((member) => member.bug_rate_pct > 0);
  const membersWithCycleRisk = teamMembers.filter(
    (member) => member.avg_cycle_time_days > 5
  );
  const membersWithLeadRisk = teamMembers.filter(
    (member) => member.avg_lead_time_days > 4
  );

  if (membersWithBugRisk.length > 0) {
    actions.push(
      `Run a quick quality review with ${membersWithBugRisk
        .map((member) => member.developer_name)
        .join(", ")} and add one targeted pre-release safeguard for the repeated failure mode.`
    );
  }

  if (managerRecord.avg_cycle_time_days > 5 || membersWithCycleRisk.length > 0) {
    actions.push(
      "Break larger work items into thinner slices and review where tickets are waiting in review or blocked mid-flight."
    );
  }

  if (managerRecord.avg_lead_time_days > 4 || membersWithLeadRisk.length > 0) {
    actions.push(
      "Inspect the path from merge to production for slow handoffs, manual approvals, or pipeline stages that are extending lead time."
    );
  }

  if (actions.length === 0) {
    actions.push(
      "Capture the practices behind the current healthy flow and share them as a repeatable team pattern."
    );
    actions.push(
      "Use the stable delivery window to pay down one risky area of technical debt before it shows up in cycle time or bug rate."
    );
  }

  return actions.slice(0, 3);
}

export function buildInterpretation(metrics) {
  const lines = [];

  if (metrics.avg_lead_time_days <= 2.5) {
    lines.push(
      "Lead time is excellent — work is reaching production quickly after the PR opens."
    );
  } else if (metrics.avg_lead_time_days <= 4.0) {
    lines.push(
      "Lead time is moderate. There may be a small delay between PR approval and deployment."
    );
  } else {
    lines.push(
      "Lead time is high, suggesting a bottleneck between PR merge and production deployment."
    );
  }

  if (metrics.avg_cycle_time_days <= 4.0) {
    lines.push(
      "Cycle time is healthy — issues are moving through In Progress to Done efficiently."
    );
  } else if (metrics.avg_cycle_time_days <= 5.5) {
    lines.push(
      "Cycle time is slightly elevated. Tickets may be sitting in review or blocked mid-sprint."
    );
  } else {
    lines.push(
      "Cycle time is high. Work is taking longer than expected from start to done — worth investigating blockers."
    );
  }

  if (metrics.bug_rate_pct === 0) {
    lines.push("No escaped production bugs this month — quality looks solid.");
  } else if (metrics.bug_rate_pct <= 0.25) {
    lines.push(
      "A small number of bugs escaped to production. Review the root cause before it becomes a pattern."
    );
  } else {
    lines.push(
      "Bug rate is notable this month. This is a signal to strengthen pre-release testing or review process."
    );
  }

  lines.push(
    `Deployment frequency of ${metrics.prod_deployments} successful prod deployments indicates a ${
      metrics.prod_deployments >= 3 ? "strong" : "steady"
    } release cadence.`
  );

  return lines;
}

export function buildNextSteps(metrics) {
  const steps = [];

  if (metrics.avg_lead_time_days > 4.0) {
    steps.push(
      "Investigate what happens between PR merge and production deployment — is there a manual gate or a slow pipeline stage?"
    );
  }
  if (metrics.avg_cycle_time_days > 5.0) {
    steps.push(
      "Break large tickets into smaller sub-tasks. Tickets with long cycle times often have unclear scope or mid-flight blockers."
    );
  }
  if (metrics.bug_rate_pct > 0) {
    steps.push(
      "Identify the root cause of escaped bugs — was it a test gap, a missed edge case, or a release config issue? Add one targeted safeguard."
    );
  }
  if (metrics.merged_prs <= 1) {
    steps.push(
      "Low PR throughput this month — check if work is being held in large PRs. Smaller PRs get reviewed and merged faster."
    );
  }
  if (steps.length === 0) {
    steps.push(
      "Metrics look healthy. Consider sharing what's working with the team as a pattern to replicate."
    );
    steps.push(
      "Use this momentum to tackle a piece of technical debt or invest in a quality safeguard before the next sprint."
    );
  }

  return steps.slice(0, 3);
}

export function buildDeveloperTrend(devMetrics, developerId) {
  return devMetrics
    .filter((entry) => entry.developer_id === developerId)
    .sort(sortByMonth)
    .map((entry) => ({
      month: entry.month,
      lead_time: entry.avg_lead_time_days,
      cycle_time: entry.avg_cycle_time_days,
      bug_rate: entry.bug_rate_pct,
      deployments: entry.prod_deployments,
      pr_throughput: entry.merged_prs
    }));
}

export function buildManagerTrend(managerMetrics, managerId) {
  return managerMetrics
    .filter((entry) => entry.manager_id === managerId)
    .sort(sortByMonth)
    .map((entry) => ({
      month: entry.month,
      lead_time: entry.avg_lead_time_days,
      cycle_time: entry.avg_cycle_time_days,
      bug_rate: entry.avg_bug_rate_pct
    }));
}

export function buildDeveloperSnapshot({ developerId, month, developers, devMetrics }) {
  const record = devMetrics.find(
    (entry) => entry.developer_id === developerId && entry.month === month
  );

  if (!record) {
    return null;
  }

  const developer = developers.find((entry) => entry.developer_id === developerId);
  const previousRecord = findPreviousRecord(
    devMetrics,
    (entry) => entry.developer_id === developerId,
    month
  );
  const comparisons = buildComparisons(record, previousRecord, metricConfigs);
  const anomalies = buildDeveloperAnomalies(comparisons);
  const benchmarks = buildBenchmarks(record, metricConfigs);
  const activityTimeline = buildDeveloperTimeline(record, developer);

  return {
    ...record,
    ...developer,
    interpretation: buildInterpretation(record),
    nextSteps: buildNextSteps(record),
    trendData: buildDeveloperTrend(devMetrics, developerId),
    comparisons,
    anomalies,
    benchmarks,
    activityTimeline,
    summaryNarrative: buildDeveloperNarrative(record, anomalies)
  };
}

export function buildManagerSummaryRows({
  month,
  managerMetrics,
  devMetrics,
  developers
}) {
  const filtered = month
    ? managerMetrics.filter((entry) => entry.month === month)
    : managerMetrics;

  return filtered.map((record) => {
    const previousRecord = findPreviousRecord(
      managerMetrics,
      (entry) => entry.manager_id === record.manager_id,
      record.month
    );
    const comparisons = buildComparisons(
      record,
      previousRecord,
      managerMetricConfigs
    );
    const anomalies = buildManagerAnomalies(comparisons, record.signal);
    const benchmarks = buildBenchmarks(record, managerMetricConfigs);
    const teamMembers = developers
      .filter((developer) => developer.manager_id === record.manager_id)
      .map((developer) =>
        devMetrics.find(
          (metric) =>
            metric.developer_id === developer.developer_id &&
            metric.month === record.month
        )
      )
      .filter(Boolean);
    const teamBreakdown = buildSignalBreakdown(teamMembers);
    const teamName =
      developers.find((developer) => developer.manager_id === record.manager_id)
        ?.team_name || "Team";

    return {
      ...record,
      team_name: teamName,
      comparisons,
      anomalies,
      benchmarks,
      trendData: buildManagerTrend(managerMetrics, record.manager_id),
      teamBreakdown,
      summaryNarrative: buildManagerNarrative(record, anomalies, teamBreakdown)
    };
  });
}

export function buildManagerSnapshot({
  managerId,
  month,
  managerMetrics,
  devMetrics,
  developers
}) {
  const managerRecord = managerMetrics.find(
    (entry) => entry.manager_id === managerId && entry.month === month
  );

  if (!managerRecord) {
    return null;
  }

  const previousRecord = findPreviousRecord(
    managerMetrics,
    (entry) => entry.manager_id === managerId,
    month
  );
  const comparisons = buildComparisons(
    managerRecord,
    previousRecord,
    managerMetricConfigs
  );
  const anomalies = buildManagerAnomalies(comparisons, managerRecord.signal);
  const benchmarks = buildBenchmarks(managerRecord, managerMetricConfigs);

  const teamMembers = developers
    .filter((developer) => developer.manager_id === managerId)
    .map((developer) => {
      const currentRecord = devMetrics.find(
        (entry) =>
          entry.developer_id === developer.developer_id && entry.month === month
      );

      if (!currentRecord) {
        return null;
      }

      const previousDeveloperRecord = findPreviousRecord(
        devMetrics,
        (entry) => entry.developer_id === developer.developer_id,
        month
      );
      const memberComparisons = buildComparisons(
        currentRecord,
        previousDeveloperRecord,
        metricConfigs
      );
      const memberAnomalies = buildDeveloperAnomalies(memberComparisons);
      const memberBenchmarks = buildBenchmarks(currentRecord, metricConfigs);
      const activityTimeline = buildDeveloperTimeline(currentRecord, developer);

      return {
        ...developer,
        ...currentRecord,
        comparisons: memberComparisons,
        anomalies: memberAnomalies,
        benchmarks: memberBenchmarks,
        activityTimeline,
        summaryNarrative: buildDeveloperNarrative(currentRecord, memberAnomalies)
      };
    })
    .filter(Boolean)
    .sort((left, right) => {
      const leftPriority = patternPriority[left.pattern_hint] ?? 99;
      const rightPriority = patternPriority[right.pattern_hint] ?? 99;

      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }

      return left.developer_name.localeCompare(right.developer_name);
    });

  const signalBreakdown = buildSignalBreakdown(teamMembers);
  const teamName = teamMembers[0]?.team_name || "Team";

  return {
    manager: {
      ...managerRecord,
      team_name: teamName,
      comparisons,
      anomalies,
      benchmarks,
      trendData: buildManagerTrend(managerMetrics, managerId),
      signalBreakdown,
      summaryNarrative: buildManagerNarrative(
        managerRecord,
        anomalies,
        signalBreakdown
      )
    },
    teamMembers,
    recommendedActions: buildManagerActions(managerRecord, teamMembers),
    activityTimeline: buildManagerTimeline(teamMembers)
  };
}
