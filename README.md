# Charlie's Solution
Hey Charlie,

Thanks again for choosing Auth0! Here's a quick guide to run the application.

### Application Goals
- Be protected by Auth0 authorization
- Show applications and rules for a given tenant
- Whitelist certain users


#### Installation
1. Clone/Download the repo

2. CD into the application and run ```npm i``` to install the dependencies

### Auth0 Setup
1. Visit your [auth0 Dashboard](https://manage.auth0.com/dashboard/) -> Applications -> Create Application -> Regular Web Application 

2. Click the Settings tab of that application and add `http://localhost:3000/callback` and `http://localhost:3000/` to your application's Allowed Callback URLs and Allowed Logout URLs. Like so:
![Alt text](./public/dashboard.png?raw=true "Auth0 App Settings")

While you are in the settings tab, copy the Domain, Client ID, and Client secret and paste them into their respective fields in the .env.example file

3. Navigate to Management API page by going to your Dashboard-> API's (in the Applications tab) -> AuthOManagementAPI -> Machine to Machine Applications. Then update your scope/permissions for your app to include these 3 scopes:
    - read:rules
    - read:clients
    - read:clients_keys
![Alt text](./public/scope.png?raw=true "Auth0 Management API Page")


While you are on the Management API page, click the "Api Explorer" tab and copy the given token, and paste it into the placeholder in the .env file

4. From the dashboard click Auth Pipeline -> Rules -> Create Rule -> Whitelist for a Specific App
![Alt text](./public/whitelist.png?raw=true "Whitelist Rule")

Make sure to edit the newly made Rule script with the name of the app you created earlier, and the emails you want to whitelist. 


### Running the app:

3. Rename `.env.example` to `.env` 
If you've been following along, all of the values should have been populated as you went through the setup directions. 

3. Run the application with
```
npm start
```
The app will be served at `localhost:3000`.