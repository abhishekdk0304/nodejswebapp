const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pets',
  password: 'password',
  port: 5433,
})

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

const getUsers = (request, response) => {
    pool.query('SELECT * FROM pets ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })

  const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM pets WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }

  const createUser = (request, response) => {
    const { id, pet_name, pet_type, pet_age, pet_description } = request.body
  /*console.log(id)
  console.log(pet_name)
  console.log(pet_type)
  console.log(pet_age)
  console.log(pet_description)*/
    pool.query('INSERT INTO pets (id, pet_name, pet_type, pet_age, pet_description) VALUES ($1, $2, $3, $4, $5) RETURNING *', [id, pet_name, pet_type, pet_age, pet_description], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added with ID: ${results.rows[0].id}`)
    })
  }

  const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const {  pet_name, pet_type, pet_age } = request.body
  
    pool.query(
      'UPDATE pets SET pet_name = $1, pet_type = $2,pet_age =$3 WHERE id = $4',
      [ pet_name, pet_type, pet_age, id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
      }
    )
  }

  const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM pets WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User deleted with ID: ${id}`)
    })
  }

  app.delete('/users/:id', deleteUser)
  app.put('/users/:id', updateUser)
  app.post('/users', createUser)
  app.get('/users/:id', getUserById)  
  app.get('/users', getUsers)
  app.get("/", function(req, res) {
    res.send("Hello Worlxxxxd!");
  });

  app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })



  
