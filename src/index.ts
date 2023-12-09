import express from "express"

const API_URL = "https://uselessfacts.jsph.pl/api/v2/facts/random"

async function getFact(): Promise<string> {
    const response = await fetch(API_URL)
    const json = await response.json()
    return json.text
}

const guestbook = ["Hello!", "Great website!", "Fun."]
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
        res.send(guestbook)
    })
    .put((req, res) => {
        guestbook.push(req.query.text as string)
        res.send()
    })

app.listen(Number(process.env.PORT), process.env.IP, () => {
    console.log(`listening on port ${process.env.PORT}`)
})
