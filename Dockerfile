# Use an official Node runtime as a parent image
FROM node:18-slim

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and pnpm-lock.yaml
COPY package*.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Make port 8080 available to the world outside this container
EXPOSE 8080

# Define environment variables (optional for local testing)
ENV NODE_ENV production
ENV PORT 8080

# Run the app when the container launches
CMD ["pnpm", "start"]
