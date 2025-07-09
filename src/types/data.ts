export type User = {
  id: string;
  username: string;
  password: string;
};

export type Exercise = {
  id: number;
  name: string;
  description: string | null;
  category: string;
};

export type WorkoutPlan = {
  id: number;
  user: number;
  schedule_time: string;
  status: string;
};

export type Comment = {
  id: number;
  content: string;
  user: number;
  workout_plan: number;
};

export type WorkoutPlanExercise = {
  workout_plan_id: number;
  exercise_id: number;
};
