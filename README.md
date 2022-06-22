# FOOD SHOP
A simple Vue-Express web game where you can collect ingredients, make dishes, and serve customers.

# Setup for backend
Go to `backend` directory and run `npm install` to install the dependencies.
Then, start the MongoDB database using `mongod` with the `--auth` option after setting up the user.

Next, create a `.env` file (in `backend` directory) and put the following into it:
```
NODE_ENV=development
PORT=<port for Express server>
DB_HOST=<your db host>
DB_PORT=<your db port>
DB_NAME=<your db name>
DB_USER=<your db user>
DB_PWD=<your db password>
DB_AUTH_SOURCE=<your authentication source for your db user>
```

Next, generate a `public/private keypair` with this command:
```
npm run genKeys
```

The application requires some initial data from the database. To insert the initial data to the database, run this command:
```
npm run seed
```

#### Start the Express server
```
npm run devStart
```

# Setup for frontend
Go to `frontend` directory and run `npm install` to install the dependencies.

#### Start the Vue server
```
npm run serve
```