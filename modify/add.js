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