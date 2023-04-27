# SoniQube

SoniQube is a music player application currently under development, which integrates with the Jamendo API to allow users to easily search and play music available on the Jamendo music platform.

## Client

- Open a terminal and navigate to the client folder in the project directory.
- Run `npm install` to install the necessary dependencies.
- Create a new file called `.env` with the following contents:
  `REACT_APP_JAMENDO_CLIENT_ID=your_jamendo_client_id`
  Replace `your_jamendo_client_id` with the actual client ID you obtained from Jamendo API.
- Once the installation process is complete, run `npm start` to start the application.

## Server

- Open a terminal and navigate to the server folder in the project directory.
- Run `npm install` to install the necessary dependencies.
- Modify the `provider` name of `datasource db` in the `prisma/schema.prisma` file according to the database you are using.
- Create a new file called `.env` with the following contents:
  ```
  DATABASE_URL=your_database_url
  JWT_SECRET=your_jwt_secret
  SALT_ROUNDS=your_bcrypt_salt_rounds
  ```
  Replace `your_database_url` with the actual URL for your database, `your_jwt_secret` with a secure secret key for JSON Web Tokens, and `your_bcrypt_salt_rounds` with a number for the number of salt rounds to use for bcrypt password hashing.
- Run `npx prisma migrate dev --name your_migration_name` to generate a new migration in the `prisma/migrations` folder.
- Verify that the migration was successful by checking the database to see if the changes were applied.
- Once the installation process is complete, run `npm start` to start the server.

## Jamendo API client ID

- Go to the [Jamendo Developer Console](https://devportal.jamendo.com/) and create an account if you don't already have one.
- After creating an account on Jamendo, an application will be automatically created for you
- Once you're logged in, click on the "Dashboard/Applications" tab in the navigation menu.
- Click on the application that was automatically created for you to view your client ID.
