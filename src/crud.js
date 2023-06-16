const express = require("express");
const { ObjectId } = require("mongodb");
const connectToCluster = require("../utility/mongoConn.js");

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json()); // Parse JSON request bodies

// Create route
const router = express.Router();

// Get route
router.get("/", async (_, res) => {
  try {
    // connection codes
    const client = await connectToCluster();
    const database = client.db("ESD_Tour");
    const test = database.collection("test1");

    // To find and get the full list of all that is in the DB
    const test2 = await test.find().toArray();
    res.json(test2);

    client.close(); // Close the connection when done
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).json({ error: "Error connecting to MongoDB" });
  }
});

// Post route
router.post("/", async (req, res) => {
    try {
      // connection codes
      const client = await connectToCluster();
      const database = client.db("ESD_Tour");
      const test = database.collection("test1");
  
      const { name, age, email } = req.body; // Extract the data from the request body
      const newDocument = { name, age, email }; // Create a new document to insert
      const result = await test.insertOne(newDocument); // Insert the new document into the collection
  
      // Send a JSON response with the inserted document details
      res.status(201).json({ status: 201, mongoCode: result, data:newDocument });
  
      client.close(); // Close the connection when done
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        res.status(500).json({ error: "Error connecting to MongoDB" });
    }
  });


// Delete route (by id)
router.delete("/:id", async (req, res) => {
try {
    // Connection code
    const client = await connectToCluster();
    const database = client.db("ESD_Tour");
    const test = database.collection("test1");

    const documentId = req.params.id; // extracts the ID from the params routes
    const query = { _id: new ObjectId(documentId) }; // Construct the query to find the document by its ID

    // Delete the document that matches the query
    const result = await test.deleteOne(query);

    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Document not found" });
    } else {
      res.status(200).json({ status: 200, id: documentId,  message: "Document deleted successfully" });
    }

    client.close(); // Close the connection when done
} catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).json({ error: "Error connecting to MongoDB" });
}
});


// Update route
router.put("/:id", async (req, res) => {
  try {
    // Connection code
    const client = await connectToCluster();
    const database = client.db("ESD_Tour");
    const test = database.collection("test1");

    const id = req.params.id; // get the ID from the route param
    const { name, age, email } = req.body; // get the details from the bady json

    const objectId = new ObjectId(id); // Convert the id to a valid ObjectId
    const query = { _id: objectId }; // Construct the query to find the document by the _id field

    // Construct the update operation
    const update = { $set: { name, age, email } };
    // Perform the update operation
    const result = await test.updateOne(query, update);

    if (result.matchedCount === 0) {
      res.status(404).json({ error: "No matching document found" });
    } else {
      res.status(200).json({ status: 200, message: "Document updated successfully", data:req.body });
    }

    client.close(); // Close the connection when done
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).json({ error: "Error connecting to MongoDB" });
  }
});


app.use("/", router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
