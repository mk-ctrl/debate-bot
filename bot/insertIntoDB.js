// This File is used to connect with the mongoDB database and activate the trigger function
// for embedding the inserted data. The 1st and most important step

import { MongoClient } from "mongodb";
const client = new MongoClient('mongodb+srv://mirunkaushik:mirun2005@cluster0.g8yoz.mongodb.net/');

const connectDB = async () => {
    try {
        await client.connect();
        console.log("DataBase Connected Successfully");
        
    } catch (error) {
        console.error(error)
    }
}

connectDB();

//Procedure for CRUD operation in db
const db = client.db('Debate');
const collection = db.collection('room1');

//function to peform insertion

const Insert = async ()=>{
    const document = {
        'Title' : 'AI should not be allowed to make decisions in life-or-death situations.'
    }

    await collection.insertOne(document);
    console.log('Inserted Successfully');
}

Insert();