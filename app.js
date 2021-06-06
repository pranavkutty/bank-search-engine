
const express = require("express");
const app = express();
var cors = require('cors')
app.use(cors())
const pool = require("./db");
app.use(express.static('public'));


//autocomplete api
app.get("/api/branches/autocomplete", async (req, res) => {
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

        offset = limit * offset; //converting offset to postgres offset

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

        offset = limit * offset; //converting offset to postgres offset
        let matches = await pool.query(
            "SELECT * FROM branches WHERE ifsc ILIKE $1 OR branch ILIKE $1 OR address ILIKE $1 OR city ILIKE $1 OR district ILIKE $1 OR state ILIKE $1 ORDER BY ifsc ASC LIMIT $2 OFFSET $3",
            ["%" + searchText + "%", limit, offset]
        )
        data = matches["rows"];
        // console.log(typeof (data));
        // if (typeof BigInt(searchText) === 'bigint') {
        //     matches = await pool.query(
        //         "SELECT * from branches WHERE bank_id::varchar(255) LIKE $1 ORDER BY ifsc ASC LIMIT $2 OFFSET $3",
        //         ['110', limit, offset]
        //     )
        // }
        res.json({ "branches": data });
    }
    catch (err) {
        res.send(err);
    }
});


app.listen(3000, () => {
    console.log("Server started and listening on port 3000");
});
