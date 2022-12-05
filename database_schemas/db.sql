CREATE DATABASE IF NOT EXISTS `workgrade`;

CREATE TABLE IF NOT EXISTS public.users
(
    login character varying(30) COLLATE pg_catalog."default" NOT NULL,
    password character varying(40) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (password, login)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.grades
(
    work_id character varying(150) COLLATE pg_catalog."default" NOT NULL,
    user_id character varying(30) COLLATE pg_catalog."default" NOT NULL,
    mark integer NOT NULL,
    comment text COLLATE pg_catalog."default"
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;


