 
# Ameixa Location
## Description

This microservice manages all location marketed on Frexco store

## Installation

Create a network to accomodate Frexco apis

```bash
$ docker network create frexco
```

Install all dependencies

```bash
$ npm install
```

Than you can run the api

```bash
$ docker-compose up
```

Everything all right just go to http://localhost:3011/swagger

## Test

```bash
# unit tests
$ npm t
```


