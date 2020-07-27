const {date} = require('../../lib/utils')
const db = require('../../config/db')
const { Query } = require('pg')

module.exports = {

    all(callback) {

        db.query(`
        SELECT instructors.*, count(members) AS total_students 
        FROM instructors 
        LEFT JOIN members ON (instructors.id = members.instructor_id)
        GROUP BY instructors.id
        ORDER BY total_students DESC`, function(err, results){
            if(err) throw "Database Error!"

            callback(results.rows)
        })
    },
    create(data, callback ){
        const query = `
            INSERT INTO instructors (
                name,
                avatar_url,
                gender,
                services,
                birth,
                created_at
            ) VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING id
        `
        const value = [
            data.name,
            data.avatar_url,
            data.gender,
            data.services,
            date(data.birth).iso,
            date(Date.now()).iso

        ]

        db.query(query, value, function(err, results){
            if (err) throw "Database Error!" 

            callback(results.rows[0])
        })
    },
    find(id, callback){
        db.query(`SELECT * FROM instructors WHERE id = $1`, [id], function(err, results){
            if (err) throw "Database Error!" 
            callback(results.rows[0])
             
        })
    },
    findby(filter, callback){
        db.query(`
        SELECT instructors.*, count(members) AS total_students 
        FROM instructors 
        LEFT JOIN members ON (instructors.id = members.instructor_id)
        WHERE instructors.name ILIKE '%${filter}%'
        OR instructors.services ILIKE '%${filter}%'
        GROUP BY instructors.id
        ORDER BY total_students DESC`, function(err, results){
            if(err) throw "Database Error!"

            callback(results.rows)
        })
    },
    update(data, callback) {
        const query = `
        UPDATE instructors SET
            avatar_url=($1)
            name=($2)
            birth=($3)
            gender=($4)
            services=($5)
        WHERE id = $6
        `

        const values = [
            data.avatar_url,
            data.name,
            date(data.birth),
            data.gender,
            data.services,
            data.id
        ]

        db.query(query, values, function(err, results){
            if (err) throw "Database Error!" 
            callback()
             
        })
    },
    delete(id, callback){
        db.query( `DELETE FROM instructors WHERE id = $1`, [id], function(err, results){
            if (err) throw "Database Error!" 

            return callback()
        } )
    },
    paginate(params){
       const { filter, limit, offset, page, callback } = params

       let query = "",
       queryFilter = "",
       totalQuery = `(
       SELECT * FROM instructors
       )AS total`

       let query = `
       SELECT instructors.*,(
           SELECT * FROM instructors
       ) AS total, count(members) as total_students
       FROM instructors
       LEFT JOIN members ON (instructors.id = members.instructor_id)`

       if ( filter ) {
           query = `${query}
           WHERE instructors.name ILIKE '%${filter}%'
           OR instructors.services ILIKE '%${filter}%'
           `
       }

       query = `${query}
            GROUP BY instructors.id LIMIT $1 OFFSET $2`

       db.query(query, [limit, offset], function(err, results){
           if (err) throw 'Database Error!'

           callback(results.rows)
       })
    }
}
