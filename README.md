# TypeORM Express Node Entrypoint App

Steps to run this project:

1. Run `npm i` command
# DEVELOPMENT MODE
2. Run `npm run dev` command

# PRODUCTION MODE
2. Run `npm run prod` command

# How it was build (step by step):
1. Install Node: 
https://nodejs.org/es/

2. Install a DB manager:
    1. https://laragon.org/download/
    2. https://www.apachefriends.org/es/download.html
    3. https://www.wampserver.com/en/

3. Install Code Editor:
https://code.visualstudio.com/download

4. Run your chosen DB manager and create a DB named "test"

5. Run CMD/Powershell commands:
    1. `mkdir my-app`
    2. `cd my-app`
    3. `npm init -y`
    4. `npm install typeorm -g`
    5. `cd..`
    6. `typeorm init --name my-app --express --database mysql`
    7. `npm i typeorm npm-check-updates -g`
    8. `ncu`
    9. `ncu -u`
    10. `npm i cors -S`
    11. `npm i ts-node-dev dotenv morgan @types/morgan @types/express @types/cors @types/node -D`
    12. `code .`

6. Replace every file content with the one on this repository:
package.json
tsconfig.json
ormconfig.json
index.ts

7. Create ".env" file and replace its content with the one on this repository.

8. Add this line to .gitignore file:
.env

9. Run `npm run dev` or `npm run prod`.
