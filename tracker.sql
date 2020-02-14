DROP DATABASE IF EXISTS employeeTrackerDB;
create database employeeTrackerDB;

use employeeTrackerDB;

create table departments (
	id int not null auto_increment,
	name varchar(30),
    primary key(id)
);

create table role (
	id int not null auto_increment,
    title varchar(30),
    salary int, 
    department_id int,
    primary key(id)
);

create table employee (
	id int not null auto_increment,
    first_name varchar(30),
    last_name varchar(30), 
    role_id int,
    manager_id int,
    primary key(id)
);