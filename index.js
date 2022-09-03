const express = require('express')
const app = express()
const fs = require('fs')
var cors = require('cors');
const port = process.env.PORT || 5000;

//middlewares
app.use(cors())
app.use(express.json())

//get all users
app.get('/user/all', (req, res) => {
    var users = fs.readFileSync('users.json', 'utf8');
    res.send(JSON.parse(users))
})

//get a random user
app.get('/user/random', (req, res) => {
    var users = fs.readFileSync('users.json', 'utf8');
    const allusers = JSON.parse(users);
    const randomUser = allusers[Math.floor(Math.random() * allusers.length)]
    console.log(randomUser);
    res.send(randomUser)
})

//save a new user
app.post('/user/save', (req, res) => {
    const pastUsers = fs.readFileSync('users.json', 'utf8');
    const newUser = req.body;
    newUser.id = pastUsers.length + 1
    const allUsers = [...pastUsers && JSON.parse(pastUsers), newUser]
    console.log(newUser)
    fs.writeFile('users.json', JSON.stringify(allUsers), () => {
        console.log('success')
    })
})

//update a user
app.patch('/user/update/:id', (req, res) => {
    const id = req.params.id;
    const newComers = req.body;
    const allUsers = JSON.parse(fs.readFileSync('users.json', 'utf8'))
    const updated = allUsers.map(user => {
        if (user.id == id) {
            console.log(user, newComers);
            return { ...user, ...newComers }
        }
        else {
            return user
        }
    })
    console.log(allUsers);
    fs.writeFile('users.json', JSON.stringify(updated), () => {
        console.log('success')
    })
    res.send('success')
})

//delete a user
app.delete('/user/delete/:id', (req, res) => {
    const id = req.params.id;
    const allUsers = JSON.parse(fs.readFileSync('users.json', 'utf8'))
    const restUsers = allUsers.filter(user => user.id != id)
    fs.writeFile('users.json', JSON.stringify(restUsers), () => {
        console.log('success')
    })
    res.send('success')
})

//bulk_update (update multiple users || send an array object including id)
//format : [{"id": 10, "name":"abdullah"}, {"id":"21":"address":"dhaka"}]
app.patch('/user/bulk-update', (req, res) => {
    const updated = req.body;
    const allUsers = JSON.parse(fs.readFileSync('users.json', 'utf8'))
    const updatedUsers = allUsers.map(user => {
        const haveThis = updated.find(u => u.id == user.id && { ...user, ...u })
        console.log(haveThis);
        if (haveThis) {
            return { ...user, ...haveThis }
        } else {
            return user
        }
    })
    fs.writeFile('users.json', JSON.stringify(updatedUsers), () => {
        console.log('success')
    })
    res.send("success")
})



//default routes
app.get('/', (req, res) => {
    res.send('welcome to random users world!')
})
app.all('*', (req, res) => {
    res.send('No such as route found!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})