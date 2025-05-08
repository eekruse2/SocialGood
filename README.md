# Social Good Platform

A full-stack application to connect owner's of lost items with finders of mathcing lost items.

## Features
User side: 

Upload lost item with optional descriptions and images and trace a rough path of where you were on that day on E-Map. 

or

Upload found item with optional descriptions and images and pin exact location.

Dev side: 

Matches descriptions and rough locations, emailing finder and loser of a potential match.

## Project Structure
- `/client` - React frontend
- `/server` - Node/Express backend

## Technologies
- Frontend: React
- Backend: Node.js, Express
- Database: PostgreSQL

## Setup Instructions
1. Clone the repository
2. Install dependencies:
   ```
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```
3. Set up the PostgreSQL database
4. Start the development servers:
   ```
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd ../client
   npm run dev
   ```

## API Documentation
- Base URL: `/api`
- Available endpoints:
  - GET `/api/users` - Get all users
  - POST `/api/users` - Create a new user


## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

```
git clone https://github.com/yourusername/SocialGood.git
cd SocialGood
npm install
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
