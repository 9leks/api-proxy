import mysql from 'mysql2'
import argon2 from 'argon2'
import crypto from 'crypto'

type User = {
    username: string
    hash: string
    salt: string
}

type Entry = {
    username: string
    entry: string
}

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
})

connection.query(
    `CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255),
        hash VARCHAR(255),
        salt CHAR(64))
    `,
)

connection.query(
    `CREATE TABLE IF NOT EXISTS guestbook (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255),
        entry VARCHAR(255))
    `,
)

export function addUser(username: string, password: string, callback: (success: boolean) => void) {
    connection.query('SELECT * FROM users WHERE username = ?', username, async (_, results) => {
        if (!Array.isArray(results) || results.length > 0) {
            callback(false)
        } else {
            const salt = crypto.randomBytes(32).toString('hex')
            const hash = await argon2.hash(salt + password)
            connection.query('INSERT INTO users (username, hash, salt) VALUES (?, ?, ?)', [username, hash, salt])
            callback(true)
        }
    })
}

export function getUser(username: string, callback: (user?: User) => void) {
    connection.query('SELECT * FROM users WHERE username = ?', username, (_, results) => {
        if (!Array.isArray(results) || results.length == 0) {
            callback(null)
        } else {
            const user = results[0] as User
            callback({ username, hash: user.hash, salt: user.salt })
        }
    })
}

export function getGuestbook(callback: (results: Record<string, any>) => void) {
    connection.query(`SELECT * FROM guestbook`, (_, results) => {
        callback(results)
    })
}

export function addGuestbookEntry(username: string, text: string) {
    connection.query('INSERT INTO guestbook (username, entry) VALUES (?, ?)', [username, text])
}

export function removeGuestbookEntry(id: string, username: string, callback: (success: boolean) => void) {
    connection.query('SELECT * FROM guestbook WHERE id = ?', id, async (_, results) => {
        if (!Array.isArray(results) || results.length === 0 || (results[0] as Entry).username !== username) {
            callback(false)
        } else {
            connection.query('DELETE FROM guestbook WHERE id = ?', id)
            callback(true)
        }
    })
}
