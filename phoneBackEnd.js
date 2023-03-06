const express = require('express');
const app = express();
const morgan = require('morgan')
const cors = require('cors')

morgan.token('body', function(req,res) {
    console.log(req.body)
    return JSON.stringify(req.body);
})
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info',(req,res) => {
    let time = new Date()

    res.send(`Phonebook has info for ${persons.length} people
    ${time}`)
});


app.get('/api/persons',(req,res) => {
    res.json(persons);
})


app.post('/api/persons',(req,res) => {
    let newPerson = req.body;
    newPerson.id = Math.round(Math.random()*10000);
    persons.push(newPerson);
    return res.json(newPerson);
});

app.get('/api/persons/:id',(req,res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id == id);

    if (person) {
        return res.json(person)
    } else {
        return res.status(404).end()
    }
});

app.put('/api/persons/:id',(req,res) => {
    const id = req.params.id;
    const newPerson = req.body;
    const newPersons = persons.map(person => {
        if (person.id == id) {
            person = newPerson
        }
    })
    
    return res.json(newPerson)
   
    
});



app.delete('/api/persons/:id',(req,res) => {
    const id = req.params.id;
    const person = persons.find(person => person.id == id);

    if (person) {
        newPersons = persons.filter(person => person.id != id)
        persons = newPersons;
        console.log(newPersons);
        return res.send(`${person.name} has been deleted`)
    } else {
        return res.end(`Person of id ${id} does not exist, Please try again!`)
    }
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)



const PORT = 3001;
app.listen(PORT,() => {
    console.log(`Server running on PORT ${PORT}`)
})