# Simple-Task-Manager-Api

This is a backend service for a really simple task manager api. 

# Dependencies
* NodeJS
* Express
* MongoDB

# How to Run
1. Add a config folder to root directory.
2. In config folder, add a dev.env environment file to run development script. Also, add 'test.env' file to run test suite.
3. make sure Env files specify PORT, SENDGRID_API_KEY, JWT_SECRET (json webtoken secret string), MONGODB_URL items
4. Once environment files are set up, run 'npm i' in new terminal shell to install dependencies.
5. Once all packages and dependencies are installed, run 'npm run dev' to run development server.

# Endpoints
## User
* /users to create account
* /users/login to log in to existing account
* /users/logout to log out of existing account
* /users/logoutAll - POST - log out of all instances
* /users/me -PATCH - to update profile information
* /users/delete - DELETE - to delete account
* /users/me/avatar - POST - add a profile avatar/image to profile
* /users/me/avatar - DELETE - to delete a profile image/avatar
* /users/:id/avatar - GET - to read/see avatar image of a given profile


## Task
* /tasks - POST - to add new task
* /tasks - GET - to see all tasks for given user
* /tasks/:id - GET - to read task with supplied task ID
* /tasks/:id - PATCH - to update task with supplied task ID
* /tasks/:id - DELETE - to delete task with supplied task ID
