const pool = require('../utils/pool');

module.exports = class GithubUser {
    id;
    username;
    email;
    avatar;

    constructor(row) {
        this.id = row.id;
        this.username = row.username;
        this.email = row.email;
        this.avatar = row.avatar;
    }

    static async insert({ username, email, avatar_url }) {
        if (!username) throw new Error('Username is required');

        return pool
          .query(
            `
            INSERT INTO
                github_users (username, email, avatar)
            VALUES
                ($1, $2, $3)
            RETURNING 
                *
            `,
            [username, email, avatar_url]
        )
        .then(({ rows }) => new GithubUser(rows[0]));
    }

    static async getByUsername(username) {
        return pool
          .query(
            `
            SELECT
            *
            FROM
            github_users
            WHERE
            username=$1
            `,
            [username]
        )
        .then(({ rows }) => {
            if (!rows[0]) {
                return null;
            } else {
                return new GithubUser(rows[0]);
            }
        });
    }

    toJSON() {
        return { ...this };
    }
}