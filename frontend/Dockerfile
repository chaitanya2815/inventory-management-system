# Use official Node image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose port
EXPOSE 5173

# Command to run the frontend
CMD ["npm", "run", "dev", "--", "--host"]