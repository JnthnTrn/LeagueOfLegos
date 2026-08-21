
require('dotenv').config();
const riotAPIKey = process.env.API_KEY;
console.log('Key loaded:', riotAPIKey); // temporary debug line

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

app.get('/summoners/:gameName/:tagLine/matches', async (req, res) => { // get request from riot API

    // parameters specified
    const {gameName, tagLine} = req.params;

    // within our try function, we will extract all the data we need for our GET method
    try {
        // # step 1: extract puuid from riot API
        const accountResponse = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`, {
            headers: {"X-Riot-Token": riotAPIKey} // set the X-Riot-Token header to the API key
        });
        const {puuid} = await accountResponse.json(); // extract puuid from the response variable we created

        // # step 2: extract user data from DynamoDB using the puuid
        const matchesResponse = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids`, {
            headers: {"X-Riot-Token": riotAPIKey} 
        });
        const matches = await matchesResponse.json(); // extract matches from the response variable we created

        // # step 3: extract a specific match from the matches array
        const matchDetails = await Promise.all(
            matches.map(async (matchId) => {
                const matchRes = await fetch(`https://americas.api.riotgames.com/lol/match/v5/matches/${matchId}`, {
                    headers: { 'X-Riot-Token': riotAPIKey }
                });
                return matchRes.json(); // extract matchData from the response variable we created
            })
        );

        res.json({ puuid, matches: matchDetails });

    } catch (e) { // need a catch for the try function in case of an error, so we can log it and send a 500 status code to the client
        console.error(e);
        res.status(500).send('Error fetching matches');
    }
})

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
    console.log(`were good ${port}`)
})