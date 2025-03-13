FROM node:18-alpine

#working directory
WORKDIR /app

#copy package.json for docker container
COPY package.json package-lock.json* ./

#install dependencies
RUN npm ci

# copy files
COPY . .

#port
EXPOSE 3000

# Start React development server
CMD ["npm", "start"]