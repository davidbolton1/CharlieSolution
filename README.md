# Charlie's Solution
Hey Charlie,

Thanks again for choosing Auth0! Here's a quick guide to getting the application up and running.

## Application Goals
- Be protected by Auth0 authorization
- Show applications and rules for a given tenant
- Whitelist certain users


### Installation
1. The first step is to either clone or download the repo.

2. Then, cd into the application directory and run ```npm i``` to install the dependencies.

### Auth0 Setup
1. Visit your [auth0 Dashboard](https://manage.auth0.com/dashboard/) -> Applications -> Create Application -> Regular Web Application <br>
Create the new application and give it any name you'd like.

2. Click the Settings tab of that application and add `http://localhost:3000/callback` and `http://localhost:3000/` to your application's Allowed Callback URLs and Allowed Logout URLs. Like so:
![Alt text](./public/dashboard.png?raw=true "Auth0 App Settings")

**While you are in the Settings tab, note the values for: Domain, Client ID, and Client Secret. Copy and paste those values into their respective placeholders in the .env.example file.**

3. Navigate to Management API page by going to your Dashboard-> API's (in the Applications tab) -> AuthOManagementAPI -> Machine to Machine Applications. Then update your scope/permissions for your app to include these 3 scopes:
    - read:rules
    - read:clients
    - read:clients_keys
![Alt text](./public/scope.png?raw=true "Auth0 Management API Page")


**While you are on the Management API page, click the "Api Explorer" tab and copy the given token. Navigate to the .env.example file and replace the placeholder in the AUTH0_APIV2_TOKEN field with the token value that was just copied.**

4. From the dashboard click Auth Pipeline -> Rules -> Create Rule -> Whitelist for a Specific App
![Alt text](./public/whitelist.png?raw=true "Whitelist Rule")

**Make sure to edit the newly made Rule script with the name of the app you created earlier, and the emails you want to whitelist.**


### Running the app:

1. Rename `.env.example` to `.env` <br>
All of the values of the env file should have been populated as you went through the setup directions. 

2. Run the application with:
```
npm start
```
The app will be served at `localhost:3000`.
