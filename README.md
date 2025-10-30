Here's how to get your test app working:

1) You need to clone the repository you were using for testing: 

git clone https://github.com/bondar-artem/pw-practice-app.git

2) After cloning, go to the app directory and install dependencies:
cd pw-practice-app
npm install

3) Start the application:
npm start

4) The Angular app will run at http://localhost:4200

I've proposed changes to your Playwright configuration to automatically start the test app when running tests. The webServer section will now point to your pw-practice-app and start it before running tests.

I've also added a convenient script to your package.json so you can start the test app directly from your test project by running:

npm run start-test-app

To open/run Docker container:
docker run -it pw-pageobject-test /bin/bash

If the cintainer is alredy running and you want to access it:
docker exec -it <container-id-or-name> /bin/bash