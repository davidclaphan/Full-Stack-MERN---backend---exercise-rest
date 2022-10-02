import 'dotenv/config';
import express from 'express';
import * as exercises from './exercise_model.mjs';
  

const app = express();
app.use(express.json())

const PORT = process.env.PORT;

/*
* --------------------------- CREATE: Controller -------------------------------
*/

app.post('/exercises', (req,res) => { 
    exercises.createExercise(req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(exercise => {
            // confirm the creation
            res.status(201).json(exercise);
        })
        .catch(error => {
            console.error(error);
            // send a messed if an error occurs
            res.status(400).json({ Error: 'Request failed' });
        });
});

/*
* --------------------------- RETRIEVE: Controller -------------------------------
*/

// Retrieve from ID
app.get('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    exercises.findById(exerciseId)
        .then(exercise => {
            if (exercise !== null) {
                res.json(exercise)
            } else {
                res.status(404).json({ Error: "ID not found" });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request failed' });
        })
})

// Retrieve from property
app.get ('/exercises', (req,res) => { 
    let filter = {};

    if (req.query._id !== undefined) {
        filter = { _id: req.query._id };

    } if (req.query.name !== undefined) {
        filter = { name: req.query.name };

    } if (req.query.reps !== undefined) {
        filter = { reps: req.query.reps };

    } if (req.query.weight !== undefined) {
        filter = { weight: req.query.weight };

    } if (req.query.unit !== undefined){
        filter = { unit: req.query.unit };

    } if (req.query.date !== undefined){
        filter = { date: req.query.date };
    }
    
    exercises.findExercise(filter)
        .then(exercises => {
            res.send(exercises);
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request failed' });
        });
});


/*
* --------------------------- DELETE: Controller -------------------------------
*/

app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
                console.log("Item deleted successfully")
            } else {
                res.status(404).json({ Error: "Resource not found" })
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request failed' });
        });
});


/*
* --------------------------- UPDATE: Controller -------------------------------
*/

app.put('/exercises/:_id', (req, res) => {
    exercises.updateExercise(req.params._id, req.body.name, req.body.reps, req.body.weight, req.body.unit, req.body.date)
        .then(modifiedCount => {
            if (modifiedCount === 1) {
                res.json({ 
                    _id: req.params._id, 
                    name: req.body.name, 
                    reps: req.body.reps, 
                    weight: req.body.weight, 
                    unit: req.body.unit, 
                    date: req.body.date 
                })
            } else {
                res.status(404).json({ Error: 'Exercise not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: "Request failed" });
        });
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});