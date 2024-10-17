# Blockchain Price Tracker

## Overview

# Requirement

- Nest.js
- Use Moralis or Solscan API
- Relational Database System
- Swagger
- Clean code
- Dockerize to runnable on my local computer.
    - Should be run all the program by one “docker compose up (—build)” command
    

# Feature

1. Automatically save the Price of **Ethereum and Polygon every 5 minutes**
2. Automatically send an email to “hyperhire_assignment@hyperhire.in” if the price of a chain increases by more than 3% compared to its price one hour ago
3. API - returning the prices of each hour (within 24hours)
4. API  - setting alert for specific price.(parameters are chain, dollar, email)

```markdown
EXAMPLE
1. User can set alert 1000 dollar for ethereum
2. If ethereum goes 1000 dollar it send email.
```

1. API - get swap rate (eth to btc)
    1. input is ethereum amount
    2. return values are
        1. how much btc can get
        2. total fee (eth, dollar)(fee percentage is 0.03)
2. no user authentication required.

## Installation

### Prerequisites

- `Docker`

### Setup

1. **Pull the Image from `Docker Hub`**
   ```bash
   docker pull arrjunpradeep/pricetracker:latest
   docker pull postgres:13.15-alpine
   ```

2. **Create a Network**
   ```bash
   docker network create my-network
   ```

3. **Ensure You Have the Required Environment Files**

   Create an `env` folder in the root of your project with the following files:

   * `.env` : 
   ```bash
    POSTGRES_TYPE=XXXXX
    POSTGRES_HOST=XXXXX
    POSTGRES_PORT=XXXXX
    POSTGRES_DB=XXXXX
    POSTGRES_USER=XXXXX
    POSTGRES_PASSWORD=XXXXX
    MORALIS_API_KEY=XXXXX
    EMAIL_HOST=XXXXX
    EMAIL_PORT=XXXXX
    EMAIL_USERNAME=XXXXX
    EMAIL_PASSWORD=XXXXX
    RECIPIENT_MAIL=wodif66632@chainds.com
   ```
   

4. **Run PostgreSQL Container**
   ```bash
   docker run -d --name postgres_db --network my-network --env-file ./env/.env -p 5432:5432 postgres:13.15-alpine
   ```

5. **Run Application Container**
   ```bash
   docker run -d --name price --network my-network  --env-file ./env/.env -p 3369:3369 arrjunpradeep/pricetracker:latest
   ```

6. **Check Container Logs**
   ```bash
   docker logs price
   docker logs postgres_db
   ```

7. **Access API Documentation**

   Go to http://localhost:3369/swagger for API documentation and testing