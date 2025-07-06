# fAntonsy Football App

Welcome to the fAntonsy Football App! This project is built with Angular, designed to mimic the look and feel of the official Fantasy Premier League (FPL) website.

## Live Demo

🚀 **[Try the app here: https://le-anton.github.io/fantasy-football-app/transfer](https://le-anton.github.io/fantasy-football-app)**


**Important Notes:**

*   **Frontend Only:** This application is entirely frontend-based. There is no dedicated backend server to store points data persistently across different sessions or weeks.
*   **No Data Persistence Between Weeks:** Player selections, team names, and points are primarily stored in your browser's local storage. This means data will persist in your current browser, but gameweek progression and historical point tracking like in the official FPL game are not implemented. Each "session" is effectively a snapshot.
*   **For Fun & Demonstration:** The main goal of this app was to explore Angular features and recreate some of the FPL user interface elements for fun. It uses the official FPL API for player and fixture data but does not interact with your actual FPL account or save any league/team progress.

Enjoy tinkering with your fantasy team!

---

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.