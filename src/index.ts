import express from "express"
import mysql from "mysql2"

const API_URL = "https://uselessfacts.jsph.pl/api/v2/facts/random"

async function getFact(): Promise<string> {
    const response = await fetch(API_URL)
    const json = await response.json()
    return json.text
}

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
})

connection.query("CREATE TABLE IF NOT EXISTS guestbook (id INT PRIMARY KEY AUTO_INCREMENT, entry VARCHAR(255))")

const app = express()

app.get("/", (_, res) => {
    res.send(
        `Visit /fact or /guestbook. Add a note to our guestbook via /guestbook?text={text}.`,
    )
})

app.get("/fact", async (_, res) => {
    const fact = await getFact()
    res.send(fact)
})

app.route("/guestbook")
    .get((_, res) => {
        connection.query(
            `SELECT * FROM ${process.env.MYSQL_DB}`,
            (_, results) => {
                res.send(results)
            },
        )
    })
    .put((req, res) => {
        const entry = req.query.text as string
        connection.execute(
            `INSERT INTO ${process.env.MYSQL_DB} (entry) VALUES (?)`,
            [entry],
        )
        res.send()
    })

app.listen(Number(process.env.PORT), process.env.IP, () => {
    console.log(`listening on port ${process.env.PORT}`)
})
