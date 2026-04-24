# RPAC Production Planner .NET Migration Guide

This project has been converted from Node.js (Express) to **.NET Framework 4.8 (C#)** for compatibility with Visual Studio 2022 and IIS.

## backend-Project Structure
The C# code is located in the `/dotnet-backend` folder:
- **Controllers/**: Web API Controllers handling `Orders`, `Login`, and `MasterData`.
- **Services/DatabaseService.cs**: Unified data access for MSSQL (Windows Auth), MySQL (SQLyog), and SQLite (Fallback).
- **Web.config**: Configuration for IIS, Connection Strings, and Authentication.

## Setup Instructions (Visual Studio 2022)
1.  **Create Project**: Create a new "ASP.NET Web Application (.NET Framework 4.8)" in Visual Studio. Select the "Web API" template.
2.  **Add Dependencies**: Install the following NuGet Packages:
    - `Newtonsoft.Json`
    - `MySql.Data`
    - `System.Data.SQLite`
    - `Microsoft.AspNet.WebApi.Cors` (if using cross-origin)
3.  **Copy Code**: Copy the files from `/dotnet-backend` into your new project.
4.  **Frontend Integration**:
    - Run `npm run build` in this directory to generate the `dist` folder.
    - Copy the contents of `dist` into your Visual Studio project's root.
    - In `Web.config`, ensure `index.html` is the default document.

## Database Connections
- **MSSQL**: Configure `Integrated Security=SSPI` in `Web.config` to enable **Windows Authentication**.
- **MySQL**: Update the `MySQLServer` connection string with your SQLyog/MySQL credentials.
- **SQLite**: Keep `production.db` in your `App_Data` folder for fallback support.

## UI Compatibility
The UI remains exactly as you see in the preview. The React frontend interacts with the C# Controllers via the same endpoints (`/api/*`), ensuring zero impact on the visual experience.
