const express = require('express');
const cors = require('cors');
const UserModel = require('./models/UserSchema');
const ExerciseModel = require('./models/ExerciseSchema');
const LogModel = require('./models/LogSchema');
require('dotenv').config();
require('./config/db.config').connectDB();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Save a new user
app.post('/api/users', async (req, res) => {
  try {
    const user_obj = new UserModel({ username: req.body.username });
    const new_user = await user_obj.save();
    res.json(new_user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const all_users = await UserModel.find();
    res.json(all_users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save exercises for a specified user
app.post('/api/users/:_id/exercises', async (req, res) => {
  try {
    const user_id = req.params._id;
    const user = await UserModel.findById(user_id);

    if (!user) return res.status(404).send('User Not Found!');

    const date_input = req.body.date ? new Date(req.body.date) : new Date();
    const exercise_obj = new ExerciseModel({
      user_id: user._id,
      username: user.username,
      description: req.body.description,
      duration: req.body.duration,
      date: date_input,
    });

    const new_exercise = await exercise_obj.save();
    let log = await LogModel.findById(new_exercise.user_id);

    if (!log) {
      const log_obj = new LogModel({
        _id: new_exercise.user_id,
        username: new_exercise.username,
        count: 1,
        log: [
          {
            description: new_exercise.description,
            duration: new_exercise.duration,
            date: new_exercise.date,
          },
        ],
      });
      await log_obj.save();
    } else {
      const exercises = await ExerciseModel.find({ user_id: new_exercise.user_id });
      const log_arr = exercises.map((exercise) => ({
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date,
      }));
      await LogModel.findByIdAndUpdate(new_exercise.user_id, {
        count: log_arr.length,
        log: log_arr,
      });
    }

    res.json({
      _id: new_exercise.user_id,
      username: new_exercise.username,
      description: new_exercise.description,
      duration: new_exercise.duration,
      date: new Date(new_exercise.date).toDateString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Access logs of a user with optional filters: from, to, and limit
app.get('/api/users/:_id/logs', async (req, res) => {
    try {
      const { _id } = req.params;
      const { from, to, limit } = req.query;
  
      // Find the user log by ID
      const user_log = await LogModel.findById(_id);
      if (!user_log) return res.status(404).send('User Log Not Found!');
  
      // Filter logs based on from and to dates if provided
      let filtered_logs = user_log.log;
  
      if (from) {
        const fromDate = new Date(from);
        filtered_logs = filtered_logs.filter((log) => new Date(log.date) >= fromDate);
      }
      if (to) {
        const toDate = new Date(to);
        filtered_logs = filtered_logs.filter((log) => new Date(log.date) <= toDate);
      }
  
      // Apply the limit if provided
      if (limit) {
        const limitNumber = parseInt(limit);
        filtered_logs = filtered_logs.slice(0, limitNumber);
      }
  
      // Format the logs with proper date strings
      const log_obj = filtered_logs.map((log) => ({
        description: log.description,
        duration: log.duration,
        date: new Date(log.date).toDateString(),
      }));
  
      // Send the filtered logs as a response
      res.json({
        _id: user_log._id,
        username: user_log.username,
        count: log_obj.length,
        log: log_obj,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

const CONN_PORT = process.env.PORT || 4000;
app.listen(CONN_PORT, () =>
  console.log(`Your app is Listening at http://localhost:${CONN_PORT}`)
);
