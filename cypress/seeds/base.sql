TRUNCATE public.shops CASCADE;

--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.22
-- Dumped by pg_dump version 13.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: shops; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.shops (id, name, host, scope, installed, "createdAt", "updatedAt")
VALUES ('sveltekits.myshopify.com', 'sveltekits.myshopify.com', 'c3ZlbHRla2l0cy5teXNob3BpZnkuY29tL2FkbWlu',
        'write_products,write_customers,write_draft_orders,read_locales', false, '2021-07-06 23:01:25.95',
        '2021-07-11 09:50:18.634');


--
-- Data for Name: product_configs; Type: TABLE DATA; Schema: public; Owner: postgres
--


--
-- Data for Name: offline_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.offline_sessions (id, id_shop, state, scope, "accessToken", "createdAt", "updatedAt")
VALUES ('offline_sveltekits.myshopify.com', 'sveltekits.myshopify.com', '715948913675261',
        'write_products,write_customers,write_draft_orders,read_locales', 'access_token',
        '2021-07-25 11:49:05.67', '2021-07-25 11:51:47.069');


--
-- Data for Name: online_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.online_sessions (id, primary_id, secondary_id, id_user, id_shop, state, scope, expires,
                                    "accessToken", "onlineAccessInfo", "createdAt", "updatedAt")
VALUES ('ckr9nv1tb0092mxt8vpix5uga', 'sveltekits.myshopify.com_13989740601', '156539ca-08f7-4ded-bf51-70f68a2f9438',
        1104838713, 'sveltekits.myshopify.com', '853225606042686',
        'write_products,write_customers,write_draft_orders,read_locales', '2021-07-19 20:37:59.6',
        'access_token',
        '"{\"expires_in\":86398,\"associated_user_scope\":\"write_products,write_customers,write_draft_orders,read_locales\",\"session\":\"f55956ca9efa80a07b9403a277428de0bdae17dd42e9e6f5752ba0e2102ebff1\",\"account_number\":0,\"associated_user\":{\"id\":13989740601,\"first_name\":\"Mohamed\",\"last_name\":\"Jebali\",\"email\":\"prestalife.solutions@gmail.com\",\"account_owner\":true,\"locale\":\"en-US\",\"collaborator\":false,\"email_verified\":true}}"',
        '2021-07-18 20:38:00.431', '2021-07-18 20:38:01.637');

