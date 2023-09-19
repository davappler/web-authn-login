# Web Authn Login
- This is a password-less login system
- It uses the inbuilt authenticator of the device that is trying to login
- There are two folders, one for server and another for frontend client.
- Feel free to add any improvements in this project, this is a very basic mock to show to the functionality of the password-less authentication system.
- Backend server is using express app
- Frontend client is using next js react app


<img width="802" alt="Screenshot 1402-05-15 at 14 56 28" src="https://github.com/davappler/web-authn-login/assets/63969056/256b96b7-5d99-425f-b12c-b692e8c8837c">




## Instructions to run this project locally
- `npm i` to install the dependencies
- make sure you are using node 20 + version if running locally
- Make sure mongo is installed and running
- I use the community version and run it like this => `brew services start mongodb-community`
- also if you are running locally go to `web-auth-backend/db.js` file and change the mongoUrl to use localhost =>  `const mongoUrl = "mongodb://localhost:27017/web-authn";`
- Running backend server =>
  - `cd web-auth-backend`
  - `npm run dev`
- Running frontend client side =>
  - `cd web-auth-frontend`
  - `npm run dev`

## You can also use docker to run the app

- Backend can be run as follow (refer to makefile for respective commands)
  - `cd web-auth-backend`
  - `make build` (For building the image)
  - `make up` ( Runs the containers)
  - `make down` (Stops the containers)
- Frontend client can be run as follow (refer to makefile for respective commands)
  - `cd web-auth-frontend`
  - `make build` (For building the image)
  - `make up` ( Runs the containers)
  - `make down` (Stops the containers)
