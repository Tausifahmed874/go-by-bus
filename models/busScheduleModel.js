import mongoose from "mongoose";

const BusScheduleSchema = new mongoose.Schema({
    bus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bus',
        required: true
    },
    schedule: [{
        stand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Stand',
            required: true
        },
        arrivalTime: {
            type: String,
            required: true
        }
    }]
});

export const BusSchedule = mongoose.model("BusSchedule", BusScheduleSchema); 

/* 
Example of a populated BusSchedule document:

{
  "_id": "6582f4a1b3e7c12d4a8f1e90",
  "bus": {
    "_id": "6582f3a7b3e7c12d4a8f1e80",
    "name": "Express Shuttle",
    "licenseNumber": "WB75AC1234",
    "busNumber": "B-421",
    "aadharNumber": 123456789012,
    "owner": {
      "_id": "6582f2a1b3e7c12d4a8f1e70",
      "name": "Rajesh Kumar",
      "email": "rajesh@example.com",
      "role": "driver",
      "isEmailVerified": true
    }
  },
  "schedule": [
    {
      "_id": "6582f4d1b3e7c12d4a8f1e91",
      "stand": {
        "_id": "6582f1b7b3e7c12d4a8f1e60",
        "name": "Ghatal",
        "distance": 0,
        "price": 10
      },
      "arrivalTime": "09:00"
    },
    {
      "_id": "6582f4d1b3e7c12d4a8f1e92",
      "stand": {
        "_id": "6582f1c5b3e7c12d4a8f1e61",
        "name": "Sultannagar",
        "distance": 10,
        "price": 15
      },
      "arrivalTime": "10:15"
    },
    {
      "_id": "6582f4d1b3e7c12d4a8f1e93",
      "stand": {
        "_id": "6582f1d3b3e7c12d4a8f1e62",
        "name": "Midnapore",
        "distance": 25,
        "price": 30
      },
      "arrivalTime": "11:30"
    }
  ]
}
*/ 