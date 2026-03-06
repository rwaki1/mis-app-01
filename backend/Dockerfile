FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY package.json package-lock.json* ./

RUN npm install --production

# Copy backend source
COPY . .

# Ensure uploads folder exists
RUN mkdir -p uploads

EXPOSE 5000

CMD ["node", "index.js"]