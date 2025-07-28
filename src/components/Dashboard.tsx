import React, { useState, useEffect } from "react";
import type { User, Task, WeeklyGoal } from "../types";
import { storage } from "../utils/storage";
import { getWeekStart, getWeekEnd } from "../utils/timer";
import { UserNameForm } from "./UserNameForm";
import { TaskForm } from "./TaskForm";
import { TaskItem } from "./TaskItem";
import { Timer } from "./Timer";
import { WeeklyGoals } from "./WeeklyGoals";
import { ExportData } from "./ExportData";
import { ConfirmationModal } from "./ConfirmationModal";

export const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showTimer, setShowTimer] = useState(false);
  const [showClearConfirmation, setShowClearConfirmation] = useState(false);
  const [showUndoNotification, setShowUndoNotification] = useState(false);

  useEffect(() => {
    // Load user data
    const savedUser = storage.getUser();
    if (savedUser) {
      setUser(savedUser);
    }

    // Load tasks
    const savedTasks = storage.getTasks();
    setTasks(savedTasks);

    // Load goals
    const savedGoals = storage.getWeeklyGoals();
    setGoals(savedGoals);
  }, []);

  const handleUserSubmit = (newUser: User) => {
    storage.saveUser(newUser);
    setUser(newUser);
  };

  const handleAddTask = (
    taskData: Omit<Task, "id" | "completedSessions" | "isActive" | "createdAt">
  ) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      completedSessions: 0,
      isActive: false,
      createdAt: new Date(),
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    setShowTaskForm(false);
  };

  const handleStartTask = (task: Task) => {
    const updatedTasks = tasks.map((t) => ({
      ...t,
      isActive: t.id === task.id,
    }));

    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    setActiveTask(task);
    setShowTimer(true);
  };

  const handleFinishTask = (task: Task) => {
    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, isActive: false } : t
    );

    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    setActiveTask(null);
    setShowTimer(false);
  };

  const handleTimerFinish = (task: Task) => {
    const updatedTasks = tasks.map((t) => (t.id === task.id ? task : t));

    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
    setActiveTask(null);
    setShowTimer(false);

    // Update weekly goals
    const today = new Date();
    const weekStart = getWeekStart(today);
    const weekEnd = getWeekEnd(weekStart);

    // Set time to midnight for accurate date comparison
    const normalizedWeekStart = new Date(weekStart);
    normalizedWeekStart.setHours(0, 0, 0, 0);
    const normalizedWeekEnd = new Date(weekEnd);
    normalizedWeekEnd.setHours(23, 59, 59, 999);

    let currentGoal = goals.find((g) => {
      const goalStart = new Date(g.weekStart);
      const goalEnd = new Date(g.weekEnd);
      goalStart.setHours(0, 0, 0, 0);
      goalEnd.setHours(23, 59, 59, 999);

      return goalStart <= normalizedWeekStart && goalEnd >= normalizedWeekEnd;
    });

    if (!currentGoal) {
      currentGoal = {
        id: Date.now().toString(),
        targetPomodoros: 20, // Default goal
        focusedTopics: [],
        completedPomodoros: 0,
        weekStart,
        weekEnd,
      };
      // Add the new goal to the goals array
      const updatedGoals = [...goals, currentGoal];
      setGoals(updatedGoals);
      storage.saveWeeklyGoals(updatedGoals);
    }

    const updatedGoal = {
      ...currentGoal,
      completedPomodoros: currentGoal.completedPomodoros + 1,
    };

    const updatedGoals = goals.filter((g) => g.id !== currentGoal!.id);
    updatedGoals.push(updatedGoal);

    setGoals(updatedGoals);
    storage.saveWeeklyGoals(updatedGoals);
  };

  const handleTimerCancel = () => {
    setActiveTask(null);
    setShowTimer(false);
  };

  const handleGoalUpdate = (updatedGoal: WeeklyGoal) => {
    // Remove any existing goal for the same week
    const updatedGoals = goals.filter((g) => g.id !== updatedGoal.id);
    updatedGoals.push(updatedGoal);
    setGoals(updatedGoals);
    storage.saveWeeklyGoals(updatedGoals);
  };

  const handleGoalReset = () => {
    const today = new Date();
    const weekStart = getWeekStart(today);
    const weekEnd = getWeekEnd(weekStart);

    // Set time to midnight for accurate date comparison
    const normalizedWeekStart = new Date(weekStart);
    normalizedWeekStart.setHours(0, 0, 0, 0);
    const normalizedWeekEnd = new Date(weekEnd);
    normalizedWeekEnd.setHours(23, 59, 59, 999);

    // Remove the current week's goal
    const updatedGoals = goals.filter((g) => {
      const goalStart = new Date(g.weekStart);
      const goalEnd = new Date(g.weekEnd);
      goalStart.setHours(0, 0, 0, 0);
      goalEnd.setHours(23, 59, 59, 999);

      return !(
        goalStart <= normalizedWeekStart && goalEnd >= normalizedWeekEnd
      );
    });

    setGoals(updatedGoals);
    storage.saveWeeklyGoals(updatedGoals);
  };

  const handleClearData = () => {
    // Create backup before clearing
    storage.createBackup();

    // Clear all data
    storage.clearAll();

    // Reset state
    setUser(null);
    setTasks([]);
    setGoals([]);
    setActiveTask(null);
    setShowTimer(false);
    setShowTaskForm(false);
    setShowExport(false);
    setShowClearConfirmation(false);

    // Show undo notification
    setShowUndoNotification(true);
    setTimeout(() => setShowUndoNotification(false), 5000);
  };

  const handleUndoClear = () => {
    // Restore from backup
    storage.restoreFromBackup();

    // Reload data
    const savedUser = storage.getUser();
    const savedTasks = storage.getTasks();
    const savedGoals = storage.getWeeklyGoals();

    if (savedUser) setUser(savedUser);
    setTasks(savedTasks);
    setGoals(savedGoals);

    // Clear backup
    storage.clearBackup();
    setShowUndoNotification(false);
  };

  const getCompletedPomodorosToday = () => {
    const today = new Date();
    return tasks.reduce((sum, task) => {
      if (
        task.endTime &&
        task.endTime.toDateString() === today.toDateString()
      ) {
        return sum + task.completedSessions;
      }
      return sum;
    }, 0);
  };

  if (!user) {
    return <UserNameForm onUserSubmit={handleUserSubmit} />;
  }

  const completedTasks = tasks.filter(
    (task) => task.completedSessions >= task.pomodoroSessions
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Weekly Productivity Tracker
              </h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowClearConfirmation(true)}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear All Data
              </button>
              <button
                onClick={() => setShowExport(true)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Export Data
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Welcome to Weekly Productivity Tracker
            </h2>
            <p className="text-xl opacity-90">
              Track your tasks, manage your time, and achieve your weekly goals
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weekly Goals */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <WeeklyGoals
                goals={goals}
                completedPomodoros={getCompletedPomodorosToday()}
                onGoalUpdate={handleGoalUpdate}
                onGoalReset={handleGoalReset}
              />
            </div>
          </div>

          {/* Tasks Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  My Productivity List
                </h2>
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Add Task</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {tasks.length}
                  </div>
                  <div className="text-sm text-blue-600">Total Tasks</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {completedTasks.length}
                  </div>
                  <div className="text-sm text-green-600">Completed</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {tasks.reduce(
                      (sum, task) => sum + task.completedSessions,
                      0
                    )}
                  </div>
                  <div className="text-sm text-purple-600">Pomodoros</div>
                </div>
              </div>

              {/* Tasks List */}
              {tasks.length === 0 ? (
                <div className="text-center py-12">
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
                    No tasks yet
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Start by adding your first task to begin tracking your
                    productivity
                  </p>
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Your First Task
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onStart={handleStartTask}
                      onFinish={handleFinishTask}
                      isActive={task.isActive}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTaskForm && (
        <TaskForm
          onSubmit={handleAddTask}
          onCancel={() => setShowTaskForm(false)}
        />
      )}

      {showTimer && activeTask && (
        <Timer
          task={activeTask}
          onFinish={handleTimerFinish}
          onCancel={handleTimerCancel}
        />
      )}

      {showExport && (
        <ExportData
          tasks={tasks}
          goals={goals}
          onClose={() => setShowExport(false)}
        />
      )}

      {/* Clear Data Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearConfirmation}
        title="Clear All Data"
        message="Are you sure you want to clear all your data? This action cannot be undone. All tasks, goals, and user information will be permanently deleted."
        confirmText="Clear All Data"
        cancelText="Cancel"
        onConfirm={handleClearData}
        onCancel={() => setShowClearConfirmation(false)}
        type="danger"
      />

      {/* Undo Notification */}
      {showUndoNotification && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-3">
          <span>Data cleared successfully!</span>
          <button
            onClick={handleUndoClear}
            className="bg-white text-green-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Undo
          </button>
          <button
            onClick={() => setShowUndoNotification(false)}
            className="text-white hover:text-gray-200 transition-colors"
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
        </div>
      )}
    </div>
  );
};
