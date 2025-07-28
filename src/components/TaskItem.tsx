import React from "react";
import type { Task } from "../types";

interface TaskItemProps {
  task: Task;
  onStart: (task: Task) => void;
  onFinish: (task: Task) => void;
  isActive: boolean;
}

const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getCategoryColor = (category: string) => {
  const colors = {
    Work: "bg-blue-100 text-blue-800",
    Study: "bg-purple-100 text-purple-800",
    Personal: "bg-pink-100 text-pink-800",
    Health: "bg-green-100 text-green-800",
    Finance: "bg-yellow-100 text-yellow-800",
    Creative: "bg-indigo-100 text-indigo-800",
    Other: "bg-gray-100 text-gray-800",
  };
  return colors[category as keyof typeof colors] || colors.Other;
};

export const TaskItem = ({
  task,
  onStart,
  onFinish,
  isActive,
}: TaskItemProps) => {
  const isCompleted = task.completedSessions >= task.pomodoroSessions;
  const progress = (task.completedSessions / task.pomodoroSessions) * 100;

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-2 p-4 transition-all ${
        isActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3
            className={`font-semibold text-lg ${
              isCompleted ? "line-through text-gray-500" : "text-gray-800"
            }`}
          >
            {task.title}
          </h3>
          <p
            className={`text-sm mt-1 ${
              isCompleted ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {task.description}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
              task.category
            )}`}
          >
            {task.category}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>
            {task.completedSessions}/{task.pomodoroSessions} sessions
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          <div>Created: {task.createdAt.toLocaleDateString()}</div>
          {task.startTime && (
            <div>Started: {task.startTime.toLocaleTimeString()}</div>
          )}
        </div>

        <div className="flex space-x-2">
          {!isCompleted && !isActive && (
            <button
              onClick={() => onStart(task)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Start
            </button>
          )}

          {isActive && (
            <button
              onClick={() => onFinish(task)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Finish
            </button>
          )}

          {isCompleted && (
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
              Completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
