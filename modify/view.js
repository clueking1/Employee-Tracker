const mysql = require('mysql')
const inquirer = require('inquirer')
const begin = require('../server')

function viewSomething () {
        inquirer.prompt({
            type: 'list',
            name: 'viewWhat',
            message: 'What would you like to view?',
            choices: ['Departments', 'Roles', 'Employees', 'Managers']
        })
        .then(ans => {
            let lowerAns = ans.viewWhat.toLowerCase()
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
                name: 'viewWhat',
                message: 'Click a department to view total utilized budget',
                choices: res.map(t => t.name)
            })
            .then(ans => {
                let chosenDepart;

                res.find(t => {
                    if (t.name === ans.viewWhat) {
                        chosenDepart = t.id
                    }
                })
                viewBudget(chosenDepart)
            })
        }
    )
}
//creates array of the role_id's and correalating Salaray
function viewBudget(chosenDepart) {

    begin.con.query(
        'SELECT * FROM role where ?',[{department_id:chosenDepart}], (err, res) => {
            const roleId = res.map(t => t.id)
            const roleSal = res.map(t => t.salary)

            viewBudget2(roleId, roleSal)
        }

       
    )
}

//creates array of matching Role_id's from the roleId array
function viewBudget2(roleId, roleSal) {

    begin.con.query( "SELECT * FROM employee WHERE role_id IN (?)",[roleId], ( err, res) => {
       const roles = res.map(t => t.role_id)
        viewBudget3(roles, roleSal)
    });
    
}
//creates array of total matching ids from the roles array
function viewBudget3 (roles, roleSal) {
    empty = []
    roles.sort();

    var current = null;
    var cnt = 0;
    for (var i = 0; i < roles.length; i++) {
        if (roles[i] != current) {
            if (cnt > 0) {
                empty.push(cnt)
            }
            current = roles[i];
            cnt = 1;
        } else {
            cnt++;
        }
    }
    if (cnt > 0) {
        empty.push(cnt)
    }
    viewBudgetFinal(empty, roleSal)
}

function viewBudgetFinal(empty, roleSal) {
    emptyArr = []
    for (i = 0; i < empty.length; i++) {
       let tot = empty[i] * roleSal[i]
       emptyArr.push(tot)
    }
    
    let sum = emptyArr.reduce((t, v) => t + v, 0);

    console.log(sum)
    begin.con.end()
}

function roles () {
    begin.con.query(
    'SELECT * FROM role', (err, res) => {
        if (err) {
            throw err
        }
        inquirer.prompt({
            type: 'list',
            name: 'viewWhat',
            message: 'Click a role to view all the employees under that role',
            choices: res.map(t => t.title)
        })
        .then(ans => {
            let chosenRole;

            res.find(t => {
                if (t.title === ans.viewWhat) {
                    chosenRole = t.id
                }
            })
            console.log(chosenRole)
            viewRoleEms(chosenRole)
        })
    } 
  )  
}

function viewRoleEms(chosenRole) {
    begin.con.query(
        'SELECT * FROM employee where ?',[{role_id:chosenRole}], (err, res) => {
            res.map(t => console.log(`${t.first_name} ${t.last_name}`))
            begin.con.end()
        }
    )
}

function employees () {
    begin.con.query(
        'SELECT * FROM employee', (err, res) => {
            res.map(t => console.log(`${t.first_name} ${t.last_name}`))
            begin.con.end()
        }
    )
}

function managers () {
    begin.con.query(
        'SELECT * FROM employee', (err, res) => {
            const hey = res.map(t => t.manager_id)
            const hello = hey.filter(t => t !== null)
            function onlyUnique(value, index, self) { 
                return self.indexOf(value) === index;
            }
            const unique = hello.filter(onlyUnique);
            whichManager(unique)
        }
    )  
}

function whichManager(unique) {
    begin.con.query(
        'SELECT * FROM employee WHERE id IN (?)',[unique], (err, res) => {
            if (err) {
                throw err
            }
            inquirer.prompt({
                type: 'list',
                name: 'viewWhat',
                message: 'Click a manager to view the employees managed by them',
                choices: res.map(t => `${t.first_name} ${t.last_name}`)
            })
            .then(ans => {
                let chosenMan;
    
                res.find(t => {
                    if (`${t.first_name} ${t.last_name}` === ans.viewWhat) {
                        chosenMan = t.id
                    }
                })
   
                viewManEm(chosenMan)
            })
        }
    )
}

function viewManEm(chosenMan) {
    begin.con.query(
        'SELECT * FROM employee where ?',[{manager_id:chosenMan}], (err, res) => {
            res.map(t => console.log(`${t.first_name} ${t.last_name}`))
            begin.con.end()
        }
    )
}


module.exports.viewSomething = viewSomething