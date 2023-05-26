export enum UserSeriesStatus {
  Completed = 'Completed',
  InProgress = 'InProgress',
  OnHold = 'OnHold',
  PlanToWatch = 'PlanToWatch',
}

export const STATUSES_FOR_DB = {
  Completed: 'completed',
  InProgress: 'in_progress',
  OnHold: 'on_hold',
  PlanToWatch: 'plan_to_watch',
} as const
