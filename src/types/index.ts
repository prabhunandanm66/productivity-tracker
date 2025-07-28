export interface User {
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  pomodoroSessions: number;
  priority: "low" | "medium" | "high";
  completedSessions: number;
  isActive: boolean;
  startTime?: Date;
  endTime?: Date;
  createdAt: Date;
}

export interface WeeklyGoal {
  id: string;
  targetPomodoros: number;
  focusedTopics: string[];
  completedPomodoros: number;
  weekStart: Date;
  weekEnd: Date;
}

export interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  currentTask?: Task;
  isBreak: boolean;
}
