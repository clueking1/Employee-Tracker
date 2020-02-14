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
