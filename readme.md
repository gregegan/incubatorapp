# IncubatorApp

## Install dependencies
- brew install node
- brew install pnpm


## Setup postgres and redis
- brew install postgresql@15
- brew services start postgresql@15
- brew install redis
- brew services start redis
- run `psql -U postgres`
- in psql run `CREATE DATABASE incubatorapp;`
- verify database was created by running `\l`
- configure apps/api/drizzle.config.ts with your postgres credentials

## Setup schema
- in apps/api run `pnpm install`
- in apps/api run `pnpm run db:generate`
- in apps/web run `pnpm run db:push`
- in apps/web run `pnpm run db:studio`

## Setup and start backend
- Clone .env.example to .env and set the variables, be sure to set a SESSION_SECRET
- in apps/api run `pnpm run dev`
- in another tab inapps/api run `pnpm run db:studio`
- Check it out at https://local.drizzle.studio/

## Setup frontend
- clone .env.local.example to .env.local and set the variables
- in apps/web run `pnpm install`
- in apps/web run `pnpm run dev`
- check it out at http://localhost:3000

## Signup your first user and make it an admin
- http://localhost:3000/signup
- after signup open drizzle studio and find the user record, update the isAdmin column to true and save.