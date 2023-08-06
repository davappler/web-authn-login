FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy the rest of the application code to the container
COPY . .

RUN npm run build

EXPOSE 3000

# Set the command to start the Next.js server
CMD ["npm", "start"]