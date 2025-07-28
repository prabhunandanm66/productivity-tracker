import React, { useState, useEffect } from "react";
import type { WeeklyGoal } from "../types";
import { getWeekStart, getWeekEnd } from "../utils/timer";

interface WeeklyGoalsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: WeeklyGoal) => void;
  existingGoal?: WeeklyGoal;
}

export const WeeklyGoalsForm = ({
  isOpen,
  onClose,
  onSubmit,
  existingGoal,
}: WeeklyGoalsFormProps) => {
  const [targetPomodoros, setTargetPomodoros] = useState(
    existingGoal?.targetPomodoros || 20
  );
  const [focusedTopics, setFocusedTopics] = useState<string[]>(
    existingGoal?.focusedTopics || []
  );
  const [newTopic, setNewTopic] = useState("");

  useEffect(() => {
    if (existingGoal) {
      setTargetPomodoros(existingGoal.targetPomodoros);
      setFocusedTopics(existingGoal.focusedTopics);
    }
  }, [existingGoal]);

  const handleAddTopic = () => {
    if (newTopic.trim() && !focusedTopics.includes(newTopic.trim())) {
      setFocusedTopics([...focusedTopics, newTopic.trim()]);
      setNewTopic("");
    }
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    setFocusedTopics(focusedTopics.filter((topic) => topic !== topicToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const weekStart = getWeekStart();
    const weekEnd = getWeekEnd(weekStart);

    const goal: WeeklyGoal = {
      id: existingGoal?.id || Date.now().toString(),
      targetPomodoros,
      focusedTopics,
      completedPomodoros: existingGoal?.completedPomodoros || 0,
      weekStart,
      weekEnd,
    };

    onSubmit(goal);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTopic();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {existingGoal ? "Edit Weekly Goals" : "Set Weekly Goals"}
            </h3>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Pomodoros for This Week
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={targetPomodoros}
                onChange={(e) =>
                  setTargetPomodoros(parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter target pomodoros"
              />
              <p className="mt-1 text-sm text-gray-500">
                How many pomodoros do you want to complete this week?
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Focused Topics (Optional)
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a focused topic"
                />
                <button
                  type="button"
                  onClick={handleAddTopic}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>

              {focusedTopics.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Focused topics:</p>
                  <div className="flex flex-wrap gap-2">
                    {focusedTopics.map((topic, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {topic}
                        <button
                          type="button"
                          onClick={() => handleRemoveTopic(topic)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <svg
                            className="w-4 h-4"
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
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {existingGoal ? "Update Goals" : "Set Goals"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
