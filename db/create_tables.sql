DROP TABLE IF EXISTS todo;
CREATE TABLE todo (
    id serial primary key,
    description text not null,
    message text,
    time timestamp not null default now()
);