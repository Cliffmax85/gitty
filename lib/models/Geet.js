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

    static async getAll() {
        const { rows } = await pool.query(
            `
            SELECT
                *
            FROM
                geets
            `,
        );
        console.log('rrrrooooooowwwwsss', rows);
        return rows.map((row) => new Geet(row));
    }
}