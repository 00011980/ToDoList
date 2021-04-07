/** ======================================================
 *             General Libraries for Project 
========================================================*/
const express = require('express')
const index = express()
const fs = require('fs')
const PORT = 8000 // Port number the project will run in this port
const DataBase = './data/ListOfTasks.json' //Direction for ListOfTasks


/** ======================================================
 *                Linking Asset Files
========================================================*/
index.set('view engine', 'pug')
index.use('/static', express.static('public'))
index.use(express.urlencoded({ extended: false }))


/** ======================================================
 *                Logic Part
========================================================*/
index.get('/', (req, res) => {
  fs.readFile(DataBase, (err, data) => {
    if (err) throw err

    const ListOfTasks = JSON.parse(data)

    res.render('home', { ListOfTasks:ListOfTasks })
  })
})

index.post('/add', (req, res) => {
  const formData = req.body

  if (formData.ListOfTask.trim() == '') {
    fs.readFile(DataBase, (err, data) => {
      if (err) throw err

      const ListOfTasks = JSON.parse(data)

      res.render('home', { mistake: true, ListOfTasks: ListOfTasks })
    })
  } else {
    fs.readFile(DataBase, (err, data) => {
      if (err) throw err

      const ListOfTasks = JSON.parse(data)

      const ListOfTask = {
        id: id(),
        description: formData.ListOfTask,
        adding: false
      }

      ListOfTasks.push(ListOfTask)

      fs.writeFile(DataBase, JSON.stringify(ListOfTasks), (err) => {
        if (err) throw err

        fs.readFile(DataBase, (err, data) => {
          if (err) throw err

          const ListOfTasks = JSON.parse(data)

          res.render('home', { added: true, ListOfTasks: ListOfTasks })
        })
      })
    })
  }
})

index.get('/:id/delete', (req, res) => {
  const id = req.params.id

  fs.readFile(DataBase, (err, data) => {
    if (err) throw err

    const ListOfTasks = JSON.parse(data)

    const CleanedListOfTasks = ListOfTasks.filter(ListOfTask => ListOfTask.id != id)

    fs.writeFile(DataBase, JSON.stringify(CleanedListOfTasks), (err) => {
      if (err) throw err

      res.render('home', { ListOfTasks: CleanedListOfTasks, failure: true })
    })
  })
})


index.get('/:id/update', (req, res) => {
  const id = req.params.id

  fs.readFile(DataBase, (err, data) => {
    if (err) throw err
    
    const ListOfTasks = JSON.parse(data)
    const ListOfTask = ListOfTasks.filter(ListOfTask => ListOfTask.id == id)[0]
    
    const ListOfTaskId = ListOfTasks.indexOf(ListOfTask)
    const OrderedListOfTask = ListOfTasks.splice(ListOfTaskId, 1)[0]
    
    OrderedListOfTask.adding = true
    
    ListOfTasks.push(OrderedListOfTask)

    fs.writeFile(DataBase, JSON.stringify(ListOfTasks), (err) => {
      if (err) throw err

      res.render('home', { ListOfTasks: ListOfTasks })
    })
  })
    
})

index.listen(PORT, (err) => {
  if (err) throw err

  console.log(`ToDoList is running on port ${ PORT }`) // Instead of Port there will be 6000
})


function id () {
  return '_' + Math.random().toString(36).substr(2, 9);
}