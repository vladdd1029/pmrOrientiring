# New Website Documentation

## Overview
This project is a web application designed to provide information about competitions, news, calendars, documents, learning materials, and clubs. It features a user-friendly interface and allows users to search for competitions by date or name.

## Project Structure
The project is organized as follows:

```
new-website
├── public
│   ├── index.html          # Main HTML page of the application
│   └── favicon.ico         # Website icon displayed in the browser tab
├── src
│   ├── components          # Contains reusable components
│   │   ├── CalendarSearch.js  # Component for searching competitions
│   │   ├── ClubsContacts.js   # Component displaying clubs and contact info
│   │   ├── Competitions.js     # Component displaying a list of competitions
│   │   ├── Documents.js         # Component displaying available documents
│   │   ├── LearningMaterials.js  # Component displaying learning materials
│   │   └── News.js              # Component displaying news related to competitions
│   ├── pages                # Contains page components
│   │   ├── Calendar.js      # Page using CalendarSearch component
│   │   ├── Clubs.js         # Page using ClubsContacts component
│   │   ├── Competitions.js   # Page using Competitions component
│   │   ├── Documents.js      # Page using Documents component
│   │   ├── LearningMaterials.js # Page using LearningMaterials component
│   │   └── News.js          # Page using News component
│   ├── App.js               # Main component defining routing and page display
│   ├── index.js             # Entry point rendering the App component
│   └── styles               # Contains CSS styles
│       ├── App.css          # Styles for the main component
│       └── index.css        # Global styles for the application
├── package.json             # Configuration file for npm dependencies and scripts
└── README.md                # Documentation for the project
```

## Features
- **Competitions**: View a list of upcoming competitions.
- **News**: Stay updated with the latest news related to competitions.
- **Calendar**: Access a calendar of competitions with a search feature.
- **Documents**: Download and view important documents.
- **Learning Materials**: Access educational resources.
- **Clubs & Contacts**: Find information about clubs and their contact details.

## Installation
To get started with the project, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd new-website
npm install
```

## Usage
To run the application in development mode, use the following command:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License.