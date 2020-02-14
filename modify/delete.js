const mysql = require('mysql')
const inquirer = require('inquirer')
const begin = require('../server')

function deleteSomething () {
    inquirer.prompt({
        type: 'list',
        name: 'updateWhat',
        message: 'What would you like to delete?',
        choices: ['Departments', 'Roles', 'Employees']
    })
    .then(ans => {
        lowerAns = ans.updateWhat.toLowerCase()
        setTimeout(eval(lowerAns), 1)
    })
}

function departments () {
    begin.con.query(
        'SELECT * FROM departments', (err, res) => {
            if (err) {
                throw err
            }
            inquirer.prompt({
                type: 'list',
                name: 'updateWhat',
                message: 'Which department would you like to delete?',
                choices: res.map(t => t.name)
            }) 
            .then(ans => {
                let chosenDepart;

                res.find(t => {
                    if (t.name === ans.updateWhat) {
                        chosenDepart = t.id
                    }
                })
                deleteDepart(chosenDepart)
            })
        }
    )
}

function deleteDepart(chosenDepart) {
    begin.con.query(
        'DELETE FROM departments WHERE ?',[{id:chosenDepart}], (err,res) => {
            if (err) {
                throw err
            }
            console.log('Department deleted successfully!!!')
            begin.start()
        }
    )
}

function roles () {
    begin.con.query(
        'SELECT * FROM role', (err, res) => {
            if (err) {
                throw err
            }
            inquirer.prompt({
                type: 'list',
                name: 'updateWhat',
                message: 'Which role would you like to delete?',
                choices: res.map(t => t.title)
            }) 
            .then(ans => {
                let chosenRole;

                res.find(t => {
                    if (t.title === ans.updateWhat) {
                        chosenRole = t.id
                    }
                })
                deleteRole(chosenRole)
            })
        }
    )
}

function deleteRole(chosenRole) {
    begin.con.query(
        'DELETE FROM role WHERE ?',[{id:chosenRole}], (err,res) => {
            if (err) {
                throw err
            }
            console.log('Role deleted successfully!!!')
            begin.start()
        }
    )
}

function employees () {
    begin.con.query(
        'SELECT * FROM employee', (err, res) => {
            if (err) {
                throw err
            }
            inquirer.prompt({
                type: 'list',
                name: 'updateWhat',
                message: 'Which employee would you like to delete?',
                choices: res.map(t => `${t.first_name} ${t.last_name}`)
            }) 
            .then(ans => {
                let chosenEm;

                res.find(t => {
                    if (`${t.first_name} ${t.last_name}` === ans.updateWhat) {
                        chosenEm = t.id
                    }
                })
                deleteEm(chosenEm)
            })
        }
    )
}

function deleteEm(chosenEm) {
    begin.con.query(
        'DELETE FROM employee WHERE ?',[{id:chosenEm}], (err,res) => {
            if (err) {
                throw err
            }
            console.log('Employee deleted successfully!!!')
            begin.start()
        }
    )
}

module.exports.deleteSomething = deleteSomething