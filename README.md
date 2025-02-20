# AggiePulse

AggiePulse is a mobile application designed to help UC Davis students stay informed about real-time busyness levels of campus locations such as the library, gym, and more. The app also enables users to rate and review campus facilities. This repository contains the codebase for the project, including both the frontend and backend.

## Getting Started

Follow these steps to set up and run the project on your local machine.
 
### Prerequisites

- [Node.js](https://nodejs.org/) (latest stable version recommended)
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) package manager

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/corypham/AggiePulse.git
   cd AggiePulse
   ```

2. **Pull the Latest Changes**

   ```bash
   git pull origin main
   ```

3. **Create Your Own Branch:** Replace `<your-name>` with your name

   ```bash
   git checkout -b dev/<your-name>
   ```

4. **Install Dependencies** Run the following command at the root directory. This installs all necessary packages for the root, `server/`, and `frontend/` directories:

   ```bash
   yarn install
   ```

   After, ensure `node_modules` is installed in the following directories:

   - Root directory
   - `server/`
   - `frontend/`
   <p>&nbsp;</p>

5. **Run the App** from the root directory, execute the following command to start the frontend app:

   ```bash
   yarn start:app:clear
   ```

### Project Structure

- **Root Directory**: Contains shared configuration files and scripts for managing the project

- **server/**: Backend code, including API endpoints and server-side logic. Latter half of this project will be developed on backend.

- **frontend/**: React Native codebase with Expo for mobile application. This part of the project will be mostly developed first.

### Development Guidelines

- Always pull the latest changes from `main` before starting work

  ```bash
  git pull origin main
  ```

- Commit your changes frequently to your own branch and write messages in your `git commit -m` with an emoji followed by a brief description

  Example:

  ```bash
  git commit -m "🧭 Fixed navigation bar"
  git commit -m "💫 Finished profile page"
  ```

- Push your changes to your branch for review:

  ```bash
  git push origin dev/<your-name>
  ```

- Open a pull request when your feature is ready to review

### Additional Notes

- For styling, we use NativeWind for seamless integration with tailwind CSS
- The app's design assets, including colors and fonts, are synced and Figma and detailed in the Notion
- For real-time-notifications, the app utilized Firebase
- We'll be using a lot of Google's API options for maps and other features

### **Happy Coding! 🚀**
