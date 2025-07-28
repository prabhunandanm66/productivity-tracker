import React, { useState } from "react";
import type { WeeklyGoal } from "../types";
import { getWeekStart, getWeekEnd } from "../utils/timer";
import { WeeklyGoalsForm } from "./WeeklyGoalsForm";

interface WeeklyGoalsProps {
  goals: WeeklyGoal[];
  completedPomodoros: number;
  onGoalUpdate?: (goal: WeeklyGoal) => void;
  onGoalReset?: () => void;
}

export const WeeklyGoals = ({
  goals,
  completedPomodoros,
  onGoalUpdate,
  onGoalReset,
}: WeeklyGoalsProps) => {
  const [showGoalsForm, setShowGoalsForm] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const currentWeekStart = getWeekStart();
  const currentWeekEnd = getWeekEnd(currentWeekStart);

  // Set time to midnight for accurate date comparison
  const normalizedWeekStart = new Date(currentWeekStart);
  normalizedWeekStart.setHours(0, 0, 0, 0);
  const normalizedWeekEnd = new Date(currentWeekEnd);
  normalizedWeekEnd.setHours(23, 59, 59, 999);

  const currentGoal = goals.find((goal) => {
    const goalStart = new Date(goal.weekStart);
    const goalEnd = new Date(goal.weekEnd);
    goalStart.setHours(0, 0, 0, 0);
    goalEnd.setHours(23, 59, 59, 999);

    return goalStart <= normalizedWeekStart && goalEnd >= normalizedWeekEnd;
  });

  const getProgressPercentage = (completed: number, target: number) => {
    return Math.min((completed / target) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleGoalSubmit = (goal: WeeklyGoal) => {
    if (onGoalUpdate) {
      onGoalUpdate(goal);
    }
  };

  const handleResetGoals = () => {
    if (onGoalReset) {
      onGoalReset();
    }
    setShowResetConfirmation(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Weekly Goals</h2>
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-500">
            {currentWeekStart.toLocaleDateString()} -{" "}
            {currentWeekEnd.toLocaleDateString()}
          </div>
          {currentGoal && (
            <button
              onClick={() => setShowResetConfirmation(true)}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reset
            </button>
          )}
          <button
            onClick={() => setShowGoalsForm(true)}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentGoal ? "Edit" : "Set Goals"}
          </button>
        </div>
      </div>

      {currentGoal ? (
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Pomodoro Progress
              </span>
              <span className="text-sm text-gray-600">
                {completedPomodoros}/{currentGoal.targetPomodoros}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(
                  getProgressPercentage(
                    completedPomodoros,
                    currentGoal.targetPomodoros
                  )
                )}`}
                style={{
                  width: `${getProgressPercentage(
                    completedPomodoros,
                    currentGoal.targetPomodoros
                  )}%`,
                }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              {completedPomodoros >= currentGoal.targetPomodoros
                ? "🎉 Weekly goal achieved!"
                : `${
                    currentGoal.targetPomodoros - completedPomodoros
                  } more pomodoros needed`}
            </div>
          </div>

          {currentGoal.focusedTopics.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Focused Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentGoal.focusedTopics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Weekly Goals Set
          </h3>
          <p className="text-gray-500 mb-4">
            Set your weekly goals to track your productivity progress
          </p>
          <button
            onClick={() => setShowGoalsForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Set Weekly Goals
          </button>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {completedPomodoros}
            </div>
            <div className="text-sm text-blue-600">Completed Today</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {currentGoal
                ? Math.max(0, currentGoal.targetPomodoros - completedPomodoros)
                : 0}
            </div>
            <div className="text-sm text-green-600">Remaining</div>
          </div>
        </div>
      </div>

      {showGoalsForm && (
        <WeeklyGoalsForm
          isOpen={showGoalsForm}
          onClose={() => setShowGoalsForm(false)}
          onSubmit={handleGoalSubmit}
          existingGoal={currentGoal}
        />
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Reset Weekly Goals
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to reset your weekly goals? This will
                clear your current progress and allow you to set new goals for
                this week.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowResetConfirmation(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetGoals}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reset Goals
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
