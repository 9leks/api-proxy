import express, { Request } from 'express'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import * as db from './db'
import { string, constants, code, routes } from './values'

type DecodedToken = {
    username: string
}

const API_URL = 'https://uselessfacts.jsph.pl/api/v2/facts/random'

function verifyAndGetDecodedToken(req: Request): DecodedToken {
    const token = req.headers.authorization.replace('Bearer ', '')
    return jwt.verify(token, process.env.JWT_SECRET) as DecodedToken
}

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    if (req.path === routes.LOGIN || req.path === routes.SIGNUP) {
        next()
        return
    }

    try {
        verifyAndGetDecodedToken(req)
        next()
    } catch (error) {
        res.status(code.UNAUTHORIZED).send(string.ERROR_UNAUTHORIZED)
    }
})

app.post(routes.LOGIN, (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        res.status(code.UNAUTHORIZED).send(string.ERROR_MISSING_USERNAME_PASSWORD)
        return
    }

    db.getUser(username, async (user) => {
        if (!user) {
            res.status(code.UNAUTHORIZED).send(string.ERROR_USER_NOT_FOUND)
            return
        }

        if (await argon2.verify(user.hash, user.salt + password)) {
            const decodedToken: DecodedToken = { username }
            res.cookie(constants.TOKEN, jwt.sign(decodedToken, process.env.JWT_SECRET, { expiresIn: '1h' }))
            res.send(string.LOGIN_SUCCESSFUL)
        } else {
            res.send(string.ERROR_INCORRECT_PASSWORD)
        }
    })
})

app.post(routes.SIGNUP, (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        res.status(code.BAD_REQUEST).send(string.ERROR_MISSING_USERNAME_PASSWORD)
        return
    }

    db.addUser(username, password, (success) => {
        if (success) {
            res.send(string.SIGNUP_SUCCESSFUL)
        } else {
            res.status(code.BAD_REQUEST).send(string.ERROR_NAME_TAKEN)
        }
    })
})

app.get(routes.FACT, async (_, res) => {
    const response = await fetch(API_URL)
    const json = await response.json()
    const fact = json.text
    res.send(fact)
})

app.route(routes.GUESTBOOK)
    .get((_, res) => {
        db.getGuestbook((results) => {
            res.send(JSON.stringify(results) + '\n')
        })
    })
    .put((req, res) => {
        const { entry } = req.body
        const { username } = verifyAndGetDecodedToken(req)
        db.addGuestbookEntry(username, entry)
        res.send(string.GUESTBOOK_SUCCESSFUL_INSERTION)
    })
    .delete((req, res) => {
        const { id } = req.body
        const { username } = verifyAndGetDecodedToken(req)

        db.removeGuestbookEntry(id, username, (success) => {
            if (success) {
                res.send(string.GUESTBOOK_SUCCESSFUL_DELETION)
            } else {
                res.status(code.BAD_REQUEST).send(string.ERROR_INCORRECT_GUESTBOOK_ENTRY)
            }
        })
    })

app.listen(Number(process.env.PORT), process.env.IP, () => {
    console.log(`Listening on port ${process.env.PORT}.`)
})
