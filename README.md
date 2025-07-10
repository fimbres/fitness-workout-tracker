# fitness-workout-tracker

https://roadmap.sh/projects/fitness-workout-tracker

# DB Schema

- User
    - id
    - username
    - password
- Exercise
    - id
    - name
    - description
    - category
- WorkoutPlan
    - id
    - user (one-to-many relationship to User table)
    - exercises (many-to-many relationship to Exercise table) (with helper table)
    - comments (one-to-many relationship to Comment table)
    - schedule-datetime
    - status (pending, done)
- Comment
    - id
    - user (one-to-one relationship to User table)
    - workout-plan (one-to-one relationship to User table)

# Endpoints

- /auth
    - /login (POST)
    - /signup (POST)
- /workout-plan
    - PUT
    - POST
    - GET
    - DELETE
        - /schedule (POST)
- /report (GET)
