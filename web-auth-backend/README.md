## Instructions to run this project

- `npm i` to install the dependencies
- Make sure mongo is installed and running => `brew services start mongodb-community`
- I use the community version and run it like this =>
- Running backend server => `npm run dev`
- Running backend server =>
  - `cd web-auth-backend`
  - `npm run dev`
- Running frontend client side =>
  - `cd web-auth-frontend`
  - `npm run dev`

## You can also use docker to run the app

- Backend can be run as follow (refer to makefile for respective commands)
  - `make build` (For building the image)
  - `make up` ( Runs the containers)
  - `make down` (Stops the containers)
