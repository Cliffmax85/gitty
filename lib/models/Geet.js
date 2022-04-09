const pool = require('../utils/pool');

module.exports = class Geet {
    id;
    title;
    description;

    constructor(row) {
        this.id = row.id;
        this.title = row.title;
        this.description = row.description;
    }

    static getAll() {
        return pool
          .query(
            `
            SELECT
                *
            FROM
                geets
            `,
        )
        .then(({ rows }) => rows.map((row) => new Geet(row)));
    }

    static insert({ title, description }) {
        return pool
        .query(
            `
            INSERT INTO
                geets (title, description)
            VALUES 
                ($1, $2)
            RETURNING 
                *
            `,
            [title, description]
        )
        .then(({ rows }) => new Geet(rows[0]));
    }
}