create database database_links;
use database_links;

create table users(
    id int(11) primary key not null AUTO_INCREMENT,
    username varchar(16) not null ,
    password varchar(60) not null,
    fullname varchar(100) not null
);

Describe users;

create table links(
    id int(11) not null primary key AUTO_INCREMENT,
    title varchar(150) not null,
    url varchar(255) not null,
    description text,
    FkIdUser int(11),
    created_at timestamp NOT null DEFAULT current_timestamp,
    constraint Fk_user Foreign Key (FkIdUser) REFERENCES users(id)
);

Describe links;

