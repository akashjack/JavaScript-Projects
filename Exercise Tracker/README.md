# freeCodeCamp's Exercise Tracker Project

This is a solution to the [Exercise Tracker](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/exercise-tracker) backend certification project from [freeCodeCamp](https://www.freecodecamp.org/).

## Contents

- [Overview](#overview)
  - [The Challenge](#the-challenge)
  - [Links](#links)
- [My Process](#my-process)
  - [Tech Stack and Packages Used](#tech-stack-and-packages-used)
  - [What I Learned](#what-i-learned)
- [Environment File Specifications](#environment-file-specifications)
- [Resources and Acknowledgements](#resources-and-acknowledgements)

## Overview

- ### The Challenge

  - **User Stories**

    - You can ```POST``` to ```/api/users``` with form data ```username``` to create a new user.
    - The returned response from ```POST /api/users``` with form data ```username``` will be an object with ```username``` and ```_id``` properties.
    - You can make a ```GET``` request to ```/api/users``` to get a list of all users.
    - The ```GET``` request to ```/api/users``` returns an array.
    - Each element in the array returned from ```GET /api/users``` is an object literal containing a user's ```username``` and ```_id```.
    - You can ```POST``` to ```/api/users/:_id/exercises``` with form data ```description```, ```duration```, and optionally ```date```. If no date is supplied, the current date will be used.
    - The response returned from ```POST /api/users/:_id/exercises``` will be the user object with the exercise fields added.
    - You can make a ```GET``` request to ```/api/users/:_id/logs``` to retrieve a full exercise log of any user.
    - A request to a user's log ```GET /api/users/:_id/logs``` returns a user object with a ```count``` property representing the number of exercises that belong to that user.
    - A ```GET``` request to ```/api/users/:_id/logs``` will return the user object with a ```log``` array of all the exercises added.
    - Each item in the ```log``` array that is returned from ```GET /api/users/:_id/logs``` is an object that should have a ```description```, ```duration```, and ```date``` properties.
    - The ```description``` property of any object in the ```log``` array that is returned from ```GET /api/users/:_id/logs``` should be a string.
    - The ```duration``` property of any object in the ```log``` array that is returned from ```GET /api/users/:_id/logs``` should be a number.
    - The ```date``` property of any object in the ```log``` array that is returned from ```GET /api/users/:_id/logs``` should be a string. Use the ```dateString``` format of the ```Date``` API.
    - You can add ```from```, ```to``` and ```limit``` parameters to a ```GET /api/users/:_id/logs``` request to retrieve part of the log of any user. ```from``` and ```to``` are dates in ```yyyy-mm-dd``` format. ```limit``` is an integer of how many logs to send back.

- ### Links

  - freeCodeCamp's Solution: [https://exercise-tracker.freecodecamp.rocks/](https://exercise-tracker.freecodecamp.rocks/)
  - Live Solution: [https://fcc--exercise-tracker.herokuapp.com/](https://fcc--exercise-tracker.herokuapp.com/)
  - Boilerplate Code: [https://github.com/freeCodeCamp/boilerplate-project-exercisetracker/](https://github.com/freeCodeCamp/boilerplate-project-exercisetracker/)

## My Process

- ### Tech Stack and Packages Used

  - [NodeJS](https://www.nodejs.org/)
  - [Express](https://www.expressjs.com/)
  - [Mongoose](https://www.mongoosejs.com/)
  - [CORS](https://www.npmjs.com/package/cors)
  - [Nodemon](https://www.npmjs.com/package/nodemon)

- ### What I Learned

  - Working on this project helped me to learn more about function callbacks and promises.
  - Learned about working with dates.
  - Saving and accessing data from mongodb database.
  - Understood the working of various mongoose functions such as save(), findById(), find(), findByIdandUpdate().
  - How to manage default values when no input is provided for a field.

## Environment File Specifications

- ```NODE_ENV```: Node environment configuration.
- ```PORT```: Connection port of the server.
- ```DB_URI```: Database connection string for db connection.

## Resources and Acknowledgements

- [freeCodeCamp](https://www.freecodecamp.org/)
- [MDN Web Docs](https://developer.mozilla.org)