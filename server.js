const mysql = require('mysql')
const inquirer = require('inquirer')
const addJs = require('./modify/add') 
const updateJs = require('./modify/update')
const viewJs = require('./modify/view')  
const deleteJs = require('./modify/delete') 



const con = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employeeTrackerDb'
})

con.connect(err => {
    if (err) {
        throw err
    }
    start()
})

function start() {
    inquirer.prompt(
        {
            type: 'list',
            name: 'addView',
            message: 'What would you like to do?',
            choices: ['Add', 'View', 'Update', 'Remove', 'Exit']
        }
    )
    .then(ans => {
        lowerAns = ans.addView.toLowerCase()
        setTimeout(eval(lowerAns), 1)
    })
}

function add() {
    addJs.addSomething()
}

function view() {
   viewJs.viewSomething() 
}

function update() {
    updateJs.updateSomething()
}

function remove() {
    deleteJs.deleteSomething()
}

function exit() {
    con.end()
}

module.exports.start = start
module.exports.con = con