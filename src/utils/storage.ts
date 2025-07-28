import type { User, Task, WeeklyGoal } from "../types";

const STORAGE_KEYS = {
  USER: "productivity_tracker_user",
  TASKS: "productivity_tracker_tasks",
  WEEKLY_GOALS: "productivity_tracker_weekly_goals",
  BACKUP_USER: "productivity_tracker_backup_user",
  BACKUP_TASKS: "productivity_tracker_backup_tasks",
  BACKUP_WEEKLY_GOALS: "productivity_tracker_backup_weekly_goals",
} as const;

export const storage = {
  // User management
  getUser: (): User | null => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  },

  saveUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  // Tasks management
  getTasks: (): Task[] => {
    const tasksData = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!tasksData) return [];

    const tasks = JSON.parse(tasksData) as Array<
      Omit<Task, "createdAt" | "startTime" | "endTime"> & {
        createdAt: string;
        startTime?: string;
        endTime?: string;
      }
    >;

    return tasks.map((task) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      startTime: task.startTime ? new Date(task.startTime) : undefined,
      endTime: task.endTime ? new Date(task.endTime) : undefined,
    }));
  },

  saveTasks: (tasks: Task[]): void => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  // Weekly goals management
  getWeeklyGoals: (): WeeklyGoal[] => {
    const goalsData = localStorage.getItem(STORAGE_KEYS.WEEKLY_GOALS);
    if (!goalsData) return [];

    const goals = JSON.parse(goalsData) as Array<
      Omit<WeeklyGoal, "weekStart" | "weekEnd"> & {
        weekStart: string;
        weekEnd: string;
      }
    >;

    return goals.map((goal) => ({
      ...goal,
      weekStart: new Date(goal.weekStart),
      weekEnd: new Date(goal.weekEnd),
    }));
  },

  saveWeeklyGoals: (goals: WeeklyGoal[]): void => {
    localStorage.setItem(STORAGE_KEYS.WEEKLY_GOALS, JSON.stringify(goals));
  },

  // Backup functionality for undo
  createBackup: (): void => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    const tasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    const goals = localStorage.getItem(STORAGE_KEYS.WEEKLY_GOALS);

    if (user) localStorage.setItem(STORAGE_KEYS.BACKUP_USER, user);
    if (tasks) localStorage.setItem(STORAGE_KEYS.BACKUP_TASKS, tasks);
    if (goals) localStorage.setItem(STORAGE_KEYS.BACKUP_WEEKLY_GOALS, goals);
  },

  restoreFromBackup: (): void => {
    const backupUser = localStorage.getItem(STORAGE_KEYS.BACKUP_USER);
    const backupTasks = localStorage.getItem(STORAGE_KEYS.BACKUP_TASKS);
    const backupGoals = localStorage.getItem(STORAGE_KEYS.BACKUP_WEEKLY_GOALS);

    if (backupUser) localStorage.setItem(STORAGE_KEYS.USER, backupUser);
    if (backupTasks) localStorage.setItem(STORAGE_KEYS.TASKS, backupTasks);
    if (backupGoals)
      localStorage.setItem(STORAGE_KEYS.WEEKLY_GOALS, backupGoals);
  },

  hasBackup: (): boolean => {
    return !!(
      localStorage.getItem(STORAGE_KEYS.BACKUP_USER) ||
      localStorage.getItem(STORAGE_KEYS.BACKUP_TASKS) ||
      localStorage.getItem(STORAGE_KEYS.BACKUP_WEEKLY_GOALS)
    );
  },

  clearBackup: (): void => {
    localStorage.removeItem(STORAGE_KEYS.BACKUP_USER);
    localStorage.removeItem(STORAGE_KEYS.BACKUP_TASKS);
    localStorage.removeItem(STORAGE_KEYS.BACKUP_WEEKLY_GOALS);
  },

  // Clear all data
  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      if (!key.includes("BACKUP")) {
        localStorage.removeItem(key);
      }
    });
  },
};
