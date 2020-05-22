const express = require('express');
const bodyParser = require('body-parser')
const pgp = require('pg-promise')();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

const config = {
    host: 'localhost',
    port: '5432',
    database: 'restaurants',
    user: 'postgres'
};
const db = pgp(config);



app.get('/api/restaurants', (req, res) => {
    db.query('SELECT * FROM restaurant').then((results) => {
        res.json(results);
    })

});

app.get('/api/restaurants/:id', (req, res) => {
    db.one('SELECT * FROM restaurant WHERE restaurant.rest_id = $1;',
    req.params.id
    ).then((result) => {
        if (result) {
            res.json(result);
        } else {
            res.status(404).json({});
        }
    })
    .catch((e) => {
        res.status(500).json({
            error: 'database error',
        })});    
});

app.post('/api/restaurants', (req, res) => {
    console.log(res.body);
    db.one('INSERT INTO restaurant VALUES (DEFAULT, ${restaurant_name}, ${distance}, ${stars}, ${category}, ${fav_dish}, ${takeout_avail}, ${visit_date}) returning *',req.body
    ).then ((result) => {
        res.status(201).json(result);
    });
});

app.listen(PORT, () => console.log(`Running: http://localhost:${PORT}`));


// INSERT INTO "public"."restaurant"("restaurant_name", "distance", "stars", "category", "fav_dish", "takeout_avail", "visit_date") VALUES('Five Guys', 4.7, 4.8, 'burgers', 'Double', TRUE, '2020-02-12 17:45:00') RETURNING "id", "restaurant_name", "distance", "stars", "category", "fav_dish", "takeout_avail", "visit_date";

