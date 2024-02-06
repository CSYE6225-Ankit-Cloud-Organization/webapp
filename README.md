<h2>About the Application</h2>
<p>This is a simple Node Application that lets you hit APIs to do database health check and create, update, or fetch a user details. The application also implements Basic Authentication check for certain API calls.</p>

<h2>Prerequisite Software Installations and Libraries for the Application</h2>
<ul>
  <li>Postgres DB</li>
  <li>NodeJS</li>
  <li>Sequelize ORM (software)</li>
  <li>bcryptjs</li>
  <li>express</li>
  <li>mocha</li>
  <li>pg</li>
  <li>pg-hstore</li>
  <li>sequelize</li>
  <li>supertest</li>
</ul>

<h2>Step to Build And Deploy Application Locally</h2>
<ol>
  <li>Clone the github repo: <code>git clone git@github.com:CSYE6225-Ankit-Cloud-Organization/webapp.git</code></li>
  <li>Install the required Packages: <code>npm install</code></li>
  <li>Create a <code>.env</code> file</li>
  <li>Add the Application PORT, Database PORT and other database details in the <code>.env</code> file. Please note the default Application port(APP_PORT) is 3000.
    <pre>
      <code>
DB_PORT= 
APP_PORT= 
DB_HOSTNAME=
DB_PASSWORD= 
DB_USER= 
DB_NAME= 
DB_DIALECT=postgres
      </code>
    </pre>
  </li>
  <li>To start the Application: <code>npm start</code></li>
  <li>To run just basic tests for the application: <code>npm test</code></li>
</ol>

<h2>Supported API Endpoints by the Application</h2>

<h3>Health Check Endpoint</h3>
<ul>
  <li><code>GET /healthz</code>: Verifies database connection</li>
</ul>

<h3>User Endpoints</h3>
<h4>1. Authenticated Endpoints</h4>
<ul>
  <li><code>GET /v1/user/self</code>: Retrieve the authenticated user details</li>
  <li><code>PUT /v1/user/self</code>: Update the authenticated user details</li>
</ul>
<h4>2. Public Endpoints</h4>
<ul>
  <li><code>POST /v1/user</code>: Create a new user after validation of required fields</li>
</ul>
