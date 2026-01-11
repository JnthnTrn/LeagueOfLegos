
require('dotenv').config();

const riotAPIKey = process.env.API_KEY // protects riot API

const express = require('express'); // imports the express class to express constant

const app = express(); // names express package to 'app' to be called on
const port = 8000; 
app.use(express.json()); // middleware to parse JSON bodies

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { UpdateCommand, PutCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const docClient = new DynamoDBClient({
  region: "local",
  endpoint: "http://localhost:9000", // This is the magic line
  credentials: {
    accessKeyId: "fakeMyKeyId",
    secretAccessKey: "fakeSecretAccessKey"
  }
});

app.get('/summoners/:gameName/:tagLine', async (req, res) => { // get request from riot API

    // parameters specified
    const {gameName, tagLine} = req.params;

    try {
        const response = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`, {
        method: 'GET',
        headers: { // how we pass API key
            'X-Riot-Token': riotAPIKey
        }
    })

    const data = await response.json();
    res.send(data);
    
    } catch(e) {
        res.send(`Error Found ${e}`)
    }
});

app.post('/summoners/save', async (req, res) => { // users will be identified by summoner name
        const {puuid, gameName, tagLine} = req.body; // params that wil be passed in

        if (!puuid) {
            return res.status(400).send('PUUID is required'); // in the case a user changes their summoner name, puuid will remain the same
        }
        
        const params = {
        TableName: "LeagueOfLegos",
        Item: {
            PK: puuid, // Changed from PUUID to PK
            SK: "PROFILE",       // Added Sort Key
            GameName: gameName,
            TagLine: tagLine,
            LastUpdated: Date.now()
        }
    };

    try {
        await docClient.send(new PutCommand(params));
        res.status(201).send('User saved successfully');
    } catch (e) {
        console.error(e);
        res.status(500).send('Unable to save to Database');
    }
});

app.patch('/summoners/upsert', async (req, res) => {

    // specify any fields we want here, alongside the PUUID
    const {puuid, winRate} = req.body; 

    // This one command handles "If exists, update; if not, create"
    const params = {
        TableName: "LeagueOfLegos", // the table name specified in AWS
        Key: {
            PK: puuid,
            SK: "PROFILE"
        },
        UpdateExpression: "set winRate = :w", // set place holder values for all additional fields we pass in
        ExpressionAttributeValues: {":w": winRate} // if real value exists, replace placeholder with real value
    };

    try {
        await docClient.send(new UpdateCommand(params));
        res.json({ status: "Done" });
    } catch (e) {
        console.error("Upsert Error:", e);
        res.status(500).send(e.message);
    }
});

app.delete('/summoners/:puuid', async (req, res) => {
    const {puuid} = req.params;

    const params = {
        TableName: "LeagueOfLegos", // Your table name
        Key: { 
            PK: puuid, // Primary Key = The ID of the player to delete
            SK: "PROFILE" // what are we deleting specifically from this user
        }
    };

    try {
        await docClient.send(new DeleteCommand(params));
        res.json({message: `User with PUUID ${puuid} successfully deleted.`});
    } catch (e) {
        console.error("Delete Error:", e);
        res.status(500).json({error: "Could not delete user"});
    }
});


app.listen(port, ()=>{
    console.log(`were good ${port} ${riotAPIKey}`)
})