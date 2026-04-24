# Visual Studio 2022 & IIS Setup for RPAC Production Planner

This project is configured to run in **Visual Studio 2022** using **IIS Express** or **IIS Manager**.

## Prerequisites
- **Visual Studio 2022** (with Node.js development workload).
- **Node.js** installed on your machine.
- **IIS Express** (included with Visual Studio).
- **IIS Manager** (optional, requires IIS enabled in Windows Features and **iisnode** installed).

## Opening in Visual Studio 2022
1. Open Visual Studio 2022.
2. Select **Open a project or solution**.
3. Select `rpac-production-planner.sln`.
4. Visual Studio will load the project. It may take a moment to restore npm packages.

## Running with IIS Express
1. Press **F5** or the **Start** button in Visual Studio.
2. The project is configured to run `npm run dev` by default via the `.esproj` file.
3. Your browser will open the application running through the Visual Studio integration.

## Deploying to IIS Manager
1. Install **iisnode** on your server.
2. Ensure **URL Rewrite** module for IIS is installed.
3. Build the project: `npm run build`.
4. Point your IIS Website to this project folder.
5. The included `web.config` will handle routing through `iisnode`.
   - *Note: You may need to create a `server.cjs` or adjust the entry point in `web.config` depending on your production build strategy.*

## Database
The system uses **SQLite** (`production.db`). On Windows/IIS, ensure the user running the Application Pool has **Read/Write** permissions to the project directory to update the database file.

## Environment Variables
The application respects `process.env.PORT`. In IIS, `iisnode` will automatically assign a named pipe or port.
