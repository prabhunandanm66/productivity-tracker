import type { Task, TimerState } from "../types";

export const POMODORO_DURATION = 25 * 60; // 25 minutes in seconds
export const BREAK_DURATION = 10 * 60; // 10 minutes in seconds

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

export const createTimerState = (task?: Task): TimerState => ({
  isRunning: false,
  timeLeft: POMODORO_DURATION,
  currentTask: task,
  isBreak: false,
});

export const getWeekStart = (date: Date = new Date()): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  return new Date(d.setDate(diff));
};

export const getWeekEnd = (weekStart: Date): Date => {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  return weekEnd;
};

export const isCurrentWeek = (date: Date): boolean => {
  const now = new Date();
  const weekStart = getWeekStart(now);
  const weekEnd = getWeekEnd(weekStart);

  return date >= weekStart && date <= weekEnd;
};
