FROM node:18

WORKDIR /app

COPY package*.json ./

#install node dependencies
RUN npm install

# Copy app source code
COPY . .

#expose port
EXPOSE 8000

#start the server
CMD ["npm", "run", "dev"]