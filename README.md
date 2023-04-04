# Blog Site Application

A simple blog site application built using Angular, Spring Boot, Hibernate, and PostgreSQL.

## Features

- Authentication (register, login, logout)
- CRUD operations for blog posts
- View count for each blog post
- Blog search functionalities


## User Authorization

- Only authenticated users can create blog posts.
- Users can only update or delete their own blog posts.
- All users can view all blog posts.
## Technologies Used

- Angular
- Spring Boot
- Hibernate
- PostgreSQL

## Getting Started

To get started with the application, you will need to have the following installed:

- Node.js
- Angular CLI
- Java 17+
- PostgreSQL

Clone the repository and navigate to the root directory. See the deployment process below.
## Deployment

To run the angular frontend part of project

```bash
  ng serve -o
```

To run the spring boot backend part of project: Just go to your preferred Java editor and run the main class. Your backend application will be running at [8080 port of the Localhost](localhost:8080).

The project will be running at [4200 port of the Localhost](http:localhost:4200).


## Usage

To use the application, start by registering for an account. Once logged in, you can create blog posts, view your own blog posts, and view other users' blog posts. You can update and delete your own blog posts as well.