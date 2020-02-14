const mysql = require('mysql')
const inquirer = require('inquirer')
const begin = require('../server')



function addSomething () {
    inquirer.prompt(
        {
            type: 'list',
            name: 'addWhat',
            message: 'Which would you like to add?',
            choices: ['Department', 'Role', 'Employee']
        }
    )
    .then(ans => {
        let lowerAns = ans.addWhat.toLowerCase()
        setTimeout(eval(lowerAns), 1)
    })
}

//add a department
function department() {
    inquirer.prompt({
        type: 'input',
        name: 'departName',
        message: 'What is the name of the department you would like to add?'
    })
    .then(ans => {
        begin.con.query(
            'INSERT INTO departments SET ?',
            {
                name: ans.departName
            },
            err => {
                if (err) {
                    throw err
                }
                console.log('Department added!')
                begin.start()
            }
        )
    })
}

//add a role
function role() {
    begin.con.query(
        'SELECT * FROM departments', (err, res) => {
            if (err) {
                throw err
            }
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: "What is the title of the posistion you'd like to add?"
                },
                {
                    type: 'input',
                    name: 'sal',
                    message: 'What is the salary for this title?',
                    validate: value => !isNaN(value) ? true:false
                },
                {
                    type: 'list',
                    name: 'depart',
                    message: 'Which department is this title in?',
                    choices: res.map(t => t.name)
                }
        
            ])
            .then(ans => {
                let chosenDepart;

                res.find(t => {
                    if (t.name === ans.depart) {
                        chosenDepart = t.id
                    }
                })
             
                begin.con.query(
                    'INSERT INTO role SET ?',
                    {
                        title: ans.title,
                        salary: ans.sal,
                        department_id: chosenDepart
                    },
                    err => {
                        if (err) {
                            throw err
                        }
                        console.log('Role added!')
                        begin.start()
                    }
                )
            })
        })
    }

//add an employee 
function employee() {

    begin.con.query('SELECT * FROM role', (err,res) => {
        if(err) {
            throw err
        }
        inquirer.prompt([
            {
                type: 'input',
                name: 'first',
                message: "What is the employees first name?" 
            },
            {
                type: 'input',
                name: 'last',
                message: "What is the employees last name?" 
            },
            {
                type: 'list',
                name: 'role',
                message: "What Role is this employee apart of?",
                choices: res.map(t => t.title)
            },
        ])
        .then(ans => {
            let chosenRole;

                res.find(t => {
                    if (t.title === ans.role) {
                        chosenRole = t.id
                    }
                })
               begin.con.query(
                    'INSERT INTO employee SET ?',
                    {
                        first_name: ans.first,
                        last_name: ans.last,
                        role_id: chosenRole,
                        
                    },
                    err => {
                        if (err) {
                            throw err
                        }
                        employeePt2(ans)
                    }
                )
            
        })
       
    })
}   
    function employeePt2(fill){
        begin.con.query('SELECT * FROM employee', (err,res) => {
            if(err) {
                throw err
            }
            let person;
            res.map(t => {
                if (t.first_name === fill.first && t.last_name === fill.last){
                    person = t.id
                }
            })

  
            inquirer.prompt({
                type: 'confirm',
                name: 'managerOrNo',
                message: 'Does this employee have a manager?'
            })
            .then(ans => {
                if (ans.managerOrNo) {
                    inquirer.prompt({
                        type: 'list',
                        name: 'whoManages',
                        message: 'Who manages this employee?',
                        choices: res.map(t => `${t.first_name} ${t.last_name}` )
                    })
                    .then(ans => {
                        let chosenMan;

                            res.find(t => {
                                if (`${t.first_name} ${t.last_name}` === ans.whoManages) {
                                    chosenMan = t.id
                                }
                            })


                            begin.con.query(
                                'UPDATE employee SET ? WHERE ?',
                                [
                                    {
                                        manager_id: chosenMan
                                    },
                                    {
                                        id: person
                                    }
                                ],
                                err => {
                                    if (err) {
                                        throw err
                                    }
                                    console.log('Employee Added!!!!')
                                    begin.start()
                                }
                            )
                        })
                } else {
                    console.log('Employee Added!!!!')
                    begin.start()
                }
            })
        }
    )}
module.exports.addSomething = addSomething