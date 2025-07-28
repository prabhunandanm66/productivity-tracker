import React, { useState } from "react";
import type { Task, WeeklyGoal } from "../types";

interface ExportDataProps {
  tasks: Task[];
  goals: WeeklyGoal[];
  onClose: () => void;
}

export const ExportData = ({ tasks, goals, onClose }: ExportDataProps) => {
  const [exportFormat, setExportFormat] = useState<"readme" | "csv" | "json">(
    "readme"
  );

  const generateReadme = () => {
    const completedTasks = tasks.filter(
      (task) => task.completedSessions >= task.pomodoroSessions
    );
    const totalPomodoros = tasks.reduce(
      (sum, task) => sum + task.completedSessions,
      0
    );

    const currentWeekStart = new Date();
    currentWeekStart.setDate(
      currentWeekStart.getDate() - currentWeekStart.getDay()
    );
    const currentWeekEnd = new Date(currentWeekStart);
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6);

    return `# Weekly Productivity Report

## Summary
- **Period**: ${currentWeekStart.toLocaleDateString()} - ${currentWeekEnd.toLocaleDateString()}
- **Total Tasks Completed**: ${completedTasks.length}
- **Total Pomodoros Completed**: ${totalPomodoros}
- **Completion Rate**: ${
      tasks.length > 0
        ? Math.round((completedTasks.length / tasks.length) * 100)
        : 0
    }%

## Completed Tasks
${completedTasks
  .map(
    (task) =>
      `- **${task.title}** (${task.category}) - ${task.completedSessions}/${task.pomodoroSessions} sessions`
  )
  .join("\n")}

## Weekly Goals
${goals
  .map(
    (goal) =>
      `- Target: ${goal.targetPomodoros} pomodoros, Completed: ${goal.completedPomodoros}`
  )
  .join("\n")}

## Categories Breakdown
${Object.entries(
  tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + task.completedSessions;
    return acc;
  }, {} as Record<string, number>)
)
  .map(([category, sessions]) => `- ${category}: ${sessions} sessions`)
  .join("\n")}

---
*Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}*
`;
  };

  const generateCSV = () => {
    const headers = [
      "Title",
      "Description",
      "Category",
      "Priority",
      "Pomodoro Sessions",
      "Completed Sessions",
      "Created Date",
      "Status",
    ];
    const rows = tasks.map((task) => [
      task.title,
      task.description,
      task.category,
      task.priority,
      task.pomodoroSessions,
      task.completedSessions,
      task.createdAt.toLocaleDateString(),
      task.completedSessions >= task.pomodoroSessions
        ? "Completed"
        : "In Progress",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    return `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`;
  };

  const generateJSON = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      tasks: tasks.map((task) => ({
        ...task,
        createdAt: task.createdAt.toISOString(),
        startTime: task.startTime?.toISOString(),
        endTime: task.endTime?.toISOString(),
      })),
      goals: goals.map((goal) => ({
        ...goal,
        weekStart: goal.weekStart.toISOString(),
        weekEnd: goal.weekEnd.toISOString(),
      })),
      summary: {
        totalTasks: tasks.length,
        completedTasks: tasks.filter(
          (t) => t.completedSessions >= t.pomodoroSessions
        ).length,
        totalPomodoros: tasks.reduce(
          (sum, task) => sum + task.completedSessions,
          0
        ),
      },
    };

    return `data:application/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(exportData, null, 2)
    )}`;
  };

  const handleExport = () => {
    let content: string;
    let filename: string;

    switch (exportFormat) {
      case "readme":
        content = generateReadme();
        filename = "productivity-report.md";
        break;
      case "csv":
        content = generateCSV();
        filename = "productivity-data.csv";
        break;
      case "json":
        content = generateJSON();
        filename = "productivity-data.json";
        break;
    }

    const link = document.createElement("a");
    link.href = content;
    link.download = filename;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Export Data</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Export Format
              </label>
              <div className="space-y-2">
                {[
                  {
                    value: "readme",
                    label: "README (Markdown)",
                    desc: "Human-readable report",
                  },
                  {
                    value: "csv",
                    label: "CSV",
                    desc: "Spreadsheet compatible",
                  },
                  { value: "json", label: "JSON", desc: "Raw data format" },
                ].map((format) => (
                  <label key={format.value} className="flex items-center">
                    <input
                      type="radio"
                      name="exportFormat"
                      value={format.value}
                      checked={exportFormat === format.value}
                      onChange={(e) =>
                        setExportFormat(
                          e.target.value as "readme" | "csv" | "json"
                        )
                      }
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-800">
                        {format.label}
                      </div>
                      <div className="text-sm text-gray-500">{format.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-800 mb-2">Export Summary</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Total Tasks: {tasks.length}</div>
                <div>
                  Completed Tasks:{" "}
                  {
                    tasks.filter(
                      (t) => t.completedSessions >= t.pomodoroSessions
                    ).length
                  }
                </div>
                <div>
                  Total Pomodoros:{" "}
                  {tasks.reduce((sum, task) => sum + task.completedSessions, 0)}
                </div>
                <div>Weekly Goals: {goals.length}</div>
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
