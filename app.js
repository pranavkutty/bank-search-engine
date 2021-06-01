
const express = require("express");
const app = express();
const pool = require("./db")


//autocomplete api
app.get("/api/branches", async (req, res) => {
    try {
        //default limit and offset
        let offset = 0, limit = 10;
        let searchText = '';
        if (req.query.offset) {
            offset = req.query.offset;
        }
        if (req.query.limit) {
            limit = req.query.limit;
        }
        if (req.query.q) {
            searchText = req.query.q;
        }
        else {
            res.status(400).json({
                "error": "Missing query 'q' in the query parameters"
            });
        }
        offset = limit * offset;
        // const regex = new RegExp(`^${searchText}`, 'gi');

        const matches = await pool.query(
            "SELECT * from branches WHERE branch ILIKE $1 ORDER BY ifsc ASC LIMIT $2 OFFSET $3",
            [searchText + "%", limit, offset]
        );
        res.json({ "branches": matches["rows"] });
    }
    catch (err) {
        res.send(err.message);
    }
});

// search api



app.listen(3000, () => {
    console.log("Server started and listening on port 3000");
});
