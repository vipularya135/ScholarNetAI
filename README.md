# ScholarNetAI

ScholarNetAI is an interactive platform designed to help users discover top scholars, researchers, and academics across a wide range of disciplines. The application provides a rich, filterable interface to explore academic excellence, analyze scholarly metrics, and learn more about individual research interests and backgrounds.

## Features

- **Secure Authentication:** Register and log in to access the platform's features.
- **Discover Scholars:** Browse and search leading academics and researchers from various domains including Computer Science, Engineering, Physics, Arts & Humanities, Medical Sciences, and more.
- **Advanced Filtering:** Filter scholars by domain/category, institution type (IIT, NIT, or Other), and sort by academic metrics such as citations, h-index, and i10-index.
- **Rich Scholar Profiles:** Each scholar profile includes:
  - Name, institution, department
  - Academic metrics (citations, h-index, i10-index, publications)
  - Biography and research interests
  - Visual avatar (photo or initials)
- **User-Friendly Interface:** Modern UI with navigation, category buttons, institution and sorting filters, and responsive grid display.
- **AI Chat:** A dedicated page for AI-powered academic assistance.

## Architecture Overview

The application is built with a modern client-server architecture:
- **Frontend:** A responsive React application built with Vite that provides the user interface.
- **Backend:** A Node.js server using Express.js to serve data and handle authentication.
- **Database:** A SQLite database that stores professor and user information.

## Getting Started

### Prerequisites

- Node.js (recommended v18+)
- npm

### Installation & Setup

Follow these steps to set up and run the project locally.

**1. Clone the Repository**
```bash
git clone https://github.com/vipularya135/ScholarNetAI.git
cd ScholarNetAI
```

**2. Backend Setup**
The backend server handles the database and API.

```bash
# Navigate to the server directory
cd server

# Install backend dependencies
npm install

# Set up the database (one-time command)
# This script creates database.sqlite and populates it with data.
node setupDatabase.js

# Start the backend server
node server.js
```
The backend server will be running on `http://localhost:3001`.

**3. Frontend Setup**
The frontend is a React application.

```bash
# Navigate to the frontend directory from the root folder
cd scholarnet

# Install frontend dependencies
npm install

# Start the frontend development server
npm run dev
```
The frontend application will be available at `http://localhost:5173` (or another port if 5173 is busy).

## Main Technologies

- **Frontend:** React, React Router, CSS
- **Backend:** Node.js, Express.js
- **Database:** SQLite (`sqlite3`)
- **Authentication:** JSON Web Tokens (JWT), bcrypt

## Usage

- Open your browser and navigate to the frontend URL.
- You will be directed to the login/register page.
- Create an account or log in with existing credentials.
- Once authenticated, you can access the main application features, including the `/scholars` grid and `/ai-chat`.

## Contributing

Contributions, suggestions, and new data for scholars are welcome! Please open issues or submit pull requests for features, bug fixes, or improvements.

## License

This project currently does not specify a license. Please contact the repository owner for more information.

## Author

- [vipularya135](https://github.com/vipularya135)

---

_Discover academic excellence. Empower research networking._
