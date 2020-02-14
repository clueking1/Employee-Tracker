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

function employees () {
    begin.con.query(
        'SELECT * FROM employee', (err, res) => {
            if (err) {
                throw err
            }
            inquirer.prompt([
                {
                type: 'list',
                name: 'updateEmploy',
                message: 'What Employee would you like to update',
                choices: res.map(t => `${t.first_name} ${t.last_name}`)
                },
                {
                    type: 'list',
                    name: 'updateWhatEm',
                    message: 'What would you like to update?',
                    choices: ['First name', 'Last name', 'Role', 'Manager']
                },

        ])
            .then(ans => {
                let chosenMan;

                res.find(t => {
                    if (`${t.first_name} ${t.last_name}` === ans.updateEmploy) {
                        chosenMan = t.id
                    }
                })
                if (ans.updateWhatEm === 'Role'){
                    updateEmRole(chosenMan)
                } else if (ans.updateWhatEm === 'Manager'){
                    updateEmManage(chosenMan)
                } else if (ans.updateWhatEm === 'First name'){
                    updateEmFirst(chosenMan)
                } else {
                    updateEmLast(chosenMan)
                }
                
            })
        }
    )
}

function updateEmRole (personId) {
    begin.con.query(
        'SELECT * FROM role', (err, res) => {
            inquirer.prompt(
                {
                type: 'list',
                name: 'updateEmRole',
                message: 'What is the new Role for this Employee?',
                choices: res.map(t => t.title)
                }
            )
            .then(ans => {
                let chosenRole;

                res.find(t => {
                    if (t.title === ans.updateEmRole) {
                        chosenRole = t.id
                    }
                    begin.con.query(
                        'UPDATE employee SET ? WHERE ?',[
                            {
                                role_id: chosenRole
                            },
                            {
                                id: personId
                            }

                        ],
                        err => {
                            if (err) {
                                throw err
                            }
                            console.log('Employee Role updated!!!!!')
                            begin.start()
                        }
                    )
                })
            })
        }
    )   
}
function updateEmManage (personId) {
    begin.con.query(
        'SELECT * FROM employee', (err, res) => {
            inquirer.prompt({
                type: 'list',
                name: 'whoManages',
                message: 'Who manages this employee?',
                choices: res.map(t => `${t.first_name} ${t.last_name}` )
            })
            .then(ans => {
                let chosenManager;

                    res.find(t => {
                        if (`${t.first_name} ${t.last_name}` === ans.whoManages) {
                            chosenManager = t.id
                        }
                    })


                    begin.con.query(
                        'UPDATE employee SET ? WHERE ?',
                        [
                            {
                                manager_id: chosenManager
                            },
                            {
                                id: personId
                            }
                        ],
                        err => {
                            if (err) {
                                throw err
                            }
                            console.log('Manager Updated!!!!!')
                            begin.start()
                        }
                    )
                })
        }
    )
}

function updateEmFirst (personId) {
    begin.con.query(
        'SELECT * FROM employee', (err, res) => {
            inquirer.prompt({
                type: 'input',
                name: 'newFirst',
                message: 'What is the new first name'
            })
            .then(ans => {
                begin.con.query(
                        'UPDATE employee SET ? WHERE ?',
                        [
                            {
                                first_name: ans.newFirst
                            },
                            {
                                id: personId
                            }
                        ],
                        err => {
                            if (err) {
                                throw err
                            }
                            console.log('First name Updated!!!!!')
                            begin.start()
                        }
                    )
                })
        }
    )
}

function updateEmLast (personId) {
    begin.con.query(
        'SELECT * FROM employee', (err, res) => {
            
                inquirer.prompt({
                    type: 'input',
                    name: 'newLast',
                    message: 'What is the new last name'
                })
                .then(ans => {
                    begin.con.query(
                            'UPDATE employee SET ? WHERE ?',
                            [
                                {
                                    last_name: ans.newLast
                                },
                                {
                                    id: personId
                                }
                            ],
                            err => {
                                if (err) {
                                    throw err
                                }
                                console.log('Last name Updated!!!!!')
                                begin.start()
                            }
                        )
                })
            
        }
    )
}

module.exports.updateSomething = updateSomething