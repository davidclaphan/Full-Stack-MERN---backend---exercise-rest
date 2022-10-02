// Import dependencies.
import mongoose from 'mongoose';
import 'dotenv/config';

// Connect to the Atlas cluster MongoDB.
mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);
const db = mongoose.connection;

// Confirm that the database has connected by printing a message in the console.
db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});


/* 
* Define the collection's schema (how the collection is going to look)
* Pass mongoose.Schema an object, specifying properties and identifying if that property should be required.
* Properties have type specified: property: { type: x, required: bool }
* Optional: specify default value for property in schema
*/ 
const exerciseSchema = mongoose.Schema({
	name: { type: String, required: true },
	reps: { type: Number, required: true },
	weight: { type: Number, required: true },
    unit: { type: String, required: true},
    date: { type: Date, required: true}
});


/* 
* Below compiles the model from the schema.
* mongoose.model two arguments
*  1. Name of class we want mongoose to create
*  2. Schema (argument can be object defined above w/ mongoose.Schema)
*/
const Exercise = mongoose.model("Exercise", exerciseSchema);


/* 
* --------------------------- CREATE model -------------------------------
* Constructor consists of the details of the exercise (properties) 
*/
const createExercise = async (name, reps, weight, unit, date) => {
    const exercise = new Exercise({ 
        name: name, 
        reps: reps, 
        weight: weight,
        unit: unit,
        date: date 
    });
    return exercise.save(); // calling .save() (Mongoose function) will persist exercise instance into MongoDB
}


/*
* --------------------------- RETRIEVE models -------------------------------
*/
// This RETRIEVE is based on a FILTER and returns a promise.
// Filter code is in controller.mjs file
 const findExercise = async (filter) => {
    const query = Exercise.find(filter);
    return query.exec();
}

// This RETRIEVE based on the ID and return a promise. Each class created has a unique ID.
const findById = async (_id) => {
    const query = Exercise.findById(_id);
    return query.exec();
}


/*
* --------------------------- DELETE model -------------------------------
*/
// This DELETE is based on the ID. Similar to above filter.
const deleteById = async (_id) => {
    const result = await Exercise.deleteOne({_id: _id});
    return result.deletedCount;
};



/*
* --------------------------- UPDATE model -------------------------------
*/
const updateExercise = async (_id, name, reps, weight, unit, date) => {
    const result = await Exercise.updateOne({ _id: _id }, { name: name, reps: reps, weight: weight, unit: unit, date:date });
    return result.modifiedCount;
};


// Export our variables for use in the controller file.
export { createExercise, findExercise, findById, updateExercise, deleteById }