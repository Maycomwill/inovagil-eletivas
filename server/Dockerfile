# Use a Node.js base image
FROM node:18

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

# Copy the rest of the application code
COPY . .

RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 3333

# Command to run the application
CMD ["sh", "-c", "until pg_isready -h postgres -p 5432; do echo 'Waiting for PostgreSQL...'; sleep 2; done && npm run migrate && npm run build && npm run start"]
