# Charlie's Solution
Hey Charlie,

Here's a quick guide to getting the application up and running!

## Application Goals
- Be protected by Auth0 authorization
- Show applications and rules for a given tenant
- Restrict access to whitelisted users


### Installation
1. The first step is to either clone or download the repo. <br>
You can download a zip file from GitHub or run `git clone git@github.com:davidbolton1/CharlieSolution.git` in the command line.

2. Then, change your directory to the application by using: `cd CharlieSolution`.
3. Lastly, run ```npm i``` to install the project dependencies.

### Auth0 Setup
1. Visit your [auth0 Dashboard](https://manage.auth0.com/dashboard/) -> Applications -> Create Application -> Regular Web Application <br>
Create the new application and give it any name you'd like.

2. Click the Settings tab of that application and add `http://localhost:3000/callback` and `http://localhost:3000` to your application's Allowed Callback URLs and Allowed Logout URLs, like so:
![Alt text](./public/dashboard.png?raw=true "Auth0 App Settings")

**While you are in the Settings tab, note the values for: Domain, Client ID, and Client Secret. Copy and paste those values into their respective placeholders in the .env.example file.**

3. Navigate to Management API page by going to your Dashboard-> API's (in the Applications tab) -> AuthOManagementAPI -> Machine to Machine Applications. Verify that your newly created app is authorized, then update your scope/permissions for your app to include these 3 scopes:
    - read:rules
    - read:clients
    - read:clients_keys
![Alt text](./public/scope.png?raw=true "Auth0 Management API Page")

**While you are on the Management API page visit the "Api Explorer" tab -> Create application(If you have made an API explorer application already you can skip this step) -> Copy the given token. Navigate to the .env.example file and replace the placeholder in the AUTH0_APIV2_TOKEN field with the token value that was just copied.**

4. From the dashboard click Auth Pipeline -> Rules -> Create Rule -> Whitelist for a Specific App -> Save Changes
![Alt text](./public/whitelist.png?raw=true "Whitelist Rule")

The rule should look this like:
``` javascript
function userWhitelistForSpecificApp(user, context, callback) {
  // Access should only be granted to verified users.
  if (!user.email || !user.email_verified) {
    return callback(new UnauthorizedError('Access denied.'));
  }

  // only enforce for NameOfTheAppWithWhiteList
  // bypass this rule for all other apps
  if (context.clientName !== 'NameOfTheAppWithWhiteList') {
    return callback(null, user, context);
  }

  const whitelist = ['user1@example.com', 'user2@example.com']; // authorized users
  const userHasAccess = whitelist.some(function (email) {
    return email === user.email;
  });

  if (!userHasAccess) {
    return callback(new UnauthorizedError('Access denied.'));
  }

  callback(null, user, context);
}
```
**Make sure to edit the newly made Rule script with the name of the app you created earlier, and the emails you want to whitelist.**

*You can read about more advanced configurations in the [Auth0 Management API V2 Docs](https://auth0.com/docs/api/management/v2).*

### Running the app:

1. Rename `.env.example` to `.env` <br>
All of the values in the .env file should have been populated as you went through the setup instructions. 

2. Run the application from the command line with:
```
npm start
```
*Note: The application will be served at `localhost:3000` by default. You can change this to whatever you'd like, but make sure to apply the changes to the .env file and update your Auth0 settings.* 
