# Project Overview

This is a React project built with Vite and TypeScript. It uses React Router DOM for client-side routing and Tailwind CSS v4 for styling. The project communicates with a backend using Axios, with a predefined base URL set in an Axios instance.

## Features

### Dynamic Form Generation

- On the first page, the application fetches the form structure from the server.
- A recursive function dynamically generates the form based on the response.
- Utility functions manage field visibility and dynamic options.
- `useRef` is used to compare the old and new data for dependencies.

### List Page

- Displays data fetched from the server.
- Supports sorting and searching by name.
- Columns can be dynamically shown or hidden via state changes.

## Tech Stack

- **Vite** (for fast development and build times)
- **React with TypeScript** (for component-based UI development)
- **React Router DOM** (for browser-based routing)
- **Tailwind CSS v4** (for styling)
- **Axios** (for API requests with a configured base URL)

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd <project-directory>
   ```
2. Install Dependencies:

   ```sh
   npm install

   ```

3. Start the development server:

```sh
npm run dev
```
