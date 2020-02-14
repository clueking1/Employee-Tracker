const mysql = require('mysql')
const inquirer = require('inquirer')
const begin = require('../server')

function updateSomething () {
    inquirer.prompt({
        type: 'list',
        name: 'updateWhat',
        message: 'What will you like to update?',
        choices: ['Departments', 'Roles', 'Employees']
    })
    .then(ans => {
        lowerAns = ans.updateWhat.toLowerCase()
        setTimeout(eval(lowerAns), 1)
    })
}

//UPDATE DEPARTMENT
function departments () {
    begin.con.query(
        'SELECT * FROM departments', (err, res) => {
            if (err) {
                throw err
            }
            inquirer.prompt({
                type: 'list',
                name: 'updateDepart',
                message: 'What Department would you like to update',
                choices: res.map(t => t.name)
            })
            .then(ans => {
                let chosenDepart;

                res.find(t => {
                    if (t.name === ans.updateDepart) {
                        chosenDepart = t.id
                    }
                })
                updateDepart(chosenDepart)
            })
        }
    )
}

function updateDepart(departId) {
    begin.con.query(
        'SELECT * FROM departments', (err, res) => {
            if (err) {
                throw err
            }
            inquirer.prompt({
                type: 'input',
                name: 'updateDepart2',
                message: 'What is the new name of this Department?',
            })
            .then(ans => {
                begin.con.query(
                    'UPDATE departments SET ? WHERE ?',
                    [
                        {
                            name: ans.updateDepart2
                        },
                        {
                            id: departId
                        }
                    ],
                    err => {
                        if (err) {
                            throw err
                        }
                        console.log('Department Updated!!!!')
                        begin.start()
                    }
                )
            })
        }
    )
}

function roles () {
    begin.con.query(
        'SELECT * FROM role', (err, res) => {
            if (err) {
                throw err
            }
            inquirer.prompt([
                {
                type: 'list',
                name: 'updateRole',
                message: 'What Role would you like to update',
                choices: res.map(t => t.title)
                },
                {
                    type: 'list',
                    name: 'whichRole',
                    message: 'What part of the Role would you like to update?',
                    choices: ['Title', 'Salary']
                },
                {
                    type: 'input',
                    name: 'newUpdate',
                    message: 'What is the new info?'
                }
            ])
            .then(ans => {
                let chosenRole;

                res.find(t => {
                    if (t.title === ans.updateRole) {
                        chosenRole = t.id
                    }
                })
                let lowerAns = ans.whichRole.toLowerCase()
                updateRole(chosenRole, ans, lowerAns)
            })
        }
    )
}

function updateRole (roleId, ans, low) {
    if (low === 'title') {

    begin.con.query(
        
        'UPDATE role SET ? WHERE ?',[
            {
                title : ans.newUpdate
            },
            {
                id: roleId
            }
            
        ],
        err => {
            if (err) {
                throw err
            }
            console.log('Role Title Updated!!!!')
            begin.start()
        }
    )
    } else {
        begin.con.query(
        
            'UPDATE role SET ? WHERE ?',[
                {
                    title : ans.newUpdate
                },
                {
                    id: roleId
                }
                
            ],
            err => {
                if (err) {
                    throw err
                }
                console.log('Role Salary Updated!!!!')
                begin.start()
            }
        )
    }
}
