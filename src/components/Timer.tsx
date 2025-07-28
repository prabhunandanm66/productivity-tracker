import React, { useEffect, useState } from "react";
import type { Task, TimerState } from "../types";
import {
  POMODORO_DURATION,
  BREAK_DURATION,
  formatTime,
  createTimerState,
} from "../utils/timer";

interface TimerProps {
  task: Task;
  onFinish: (task: Task) => void;
  onCancel: () => void;
}

export const Timer = ({ task, onFinish, onCancel }: TimerProps) => {
  const [timerState, setTimerState] = useState<TimerState>(
    createTimerState(task)
  );
  const [intervalId, setIntervalId] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  const startTimer = () => {
    if (timerState.isRunning) return;

    const newIntervalId = setInterval(() => {
      setTimerState((prev) => {
        if (prev.timeLeft <= 1) {
          // Timer finished
          clearInterval(newIntervalId);

          if (prev.isBreak) {
            // Break finished, start next pomodoro or finish task
            const updatedTask = {
              ...task,
              completedSessions: task.completedSessions + 1,
              isActive: false,
              endTime: new Date(),
            };

            if (updatedTask.completedSessions >= updatedTask.pomodoroSessions) {
              // Task completed
              onFinish(updatedTask);
              return prev;
            } else {
              // Start next pomodoro
              return {
                ...prev,
                timeLeft: POMODORO_DURATION,
                isBreak: false,
                isRunning: false,
              };
            }
          } else {
            // Pomodoro finished, start break
            return {
              ...prev,
              timeLeft: BREAK_DURATION,
              isBreak: true,
              isRunning: true,
            };
          }
        }

        return {
          ...prev,
          timeLeft: prev.timeLeft - 1,
        };
      });
    }, 1000);

    setIntervalId(newIntervalId);
    setTimerState((prev) => ({
      ...prev,
      isRunning: true,
      startTime: new Date(),
    }));
  };

  const pauseTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setTimerState((prev) => ({
      ...prev,
      isRunning: false,
    }));
  };

  const handleFinish = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }

    const updatedTask = {
      ...task,
      completedSessions: task.completedSessions + 1,
      isActive: false,
      endTime: new Date(),
    };

    onFinish(updatedTask);
  };

  const getProgressPercentage = () => {
    const totalTime = timerState.isBreak ? BREAK_DURATION : POMODORO_DURATION;
    return ((totalTime - timerState.timeLeft) / totalTime) * 100;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {timerState.isBreak ? "Break Time" : task.title}
            </h2>
            <p className="text-gray-600">
              {timerState.isBreak
                ? "Take a short break and relax"
                : `Pomodoro ${task.completedSessions + 1} of ${
                    task.pomodoroSessions
                  }`}
            </p>
          </div>

          <div className="text-center mb-6">
            <div className="text-6xl font-mono font-bold text-blue-600 mb-4">
              {formatTime(timerState.timeLeft)}
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>

          <div className="flex space-x-3">
            {!timerState.isRunning ? (
              <button
                onClick={startTimer}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Start
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="flex-1 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
              >
                Pause
              </button>
            )}

            <button
              onClick={handleFinish}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Finish
            </button>

            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          {timerState.isBreak && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm text-center">
                Great job! Take a 10-minute break to refresh your mind.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
