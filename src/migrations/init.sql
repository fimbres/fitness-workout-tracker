CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(250) UNIQUE NOT NULL,
    password VARCHAR(45) NOT NULL
);

CREATE TABLE IF NOT EXISTS Exercises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(250),
    category VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS WorkoutPlans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user INT NOT NULL,
    schedule_time DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (user) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content VARCHAR(250) NOT NULL,
    user INT NOT NULL,
    workout_plan INT NOT NULL,
    FOREIGN KEY (user) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (workout_plan) REFERENCES WorkoutPlans(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS WorkoutPlansExercises (
    workout_plan_id INT,
    exercise_id INT,
    PRIMARY KEY (workout_plan_id, exercise_id),
    FOREIGN KEY (workout_plan_id) REFERENCES WorkoutPlans(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES Exercises(id) ON DELETE CASCADE
);
