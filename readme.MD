# MERN Shopping List

## Table of Contents

1. [Description](#description)
2. [Functionaltiy](#functionality)
3. [Screenshots](#screenshots)
4. [Tutorial](#tutorial)

## Description

This application is built based off Traversy's Media MERN stack video series with a key differences.

1. This application will use firebase for user authentication instead of writing custom code.
2. The React component UI library will be using MATERIAL-UI instead of using ReactStrap.
3. The user state will be kept track of using redux on the front end.
4. The application will host image files with three different aspect ratios.

The purpose of the application is to explore the usage of Google's Firebase Authentication system on the back end while using React as the frontend library.

## Functionality

-   User can register and login
-   User can view all posts that belongs to them
-   User can create, view, edit and delete image posts.

## Screenshots

### Homepage

![homepage](/screenshots/homepage.png 'Homepage')

### Login Page

![login](/screenshots/login.png 'Login')

### Post Info

![post](/screenshots/post.png 'Post')

### Register Page

![register](/screenshots/register.png 'Register')

### Create Post

![Create Post](/screenshots/createPost.png 'Create a Post')

### Unauthorized

![Unauthorized](screenshots/unauthorized.png 'Unauthorized Image')

## Test Application

A Heroku demo of this application is hosted [here](a4ccb33bc8d2c3d29fbecf2f53e583798babd61c)!

This application uses the MERN stack combined with Firebase (for fun) to build a simple application that emulates instagram.

To run the application locally, `git clone` into a local directory.

In the root folder run:

```
npm install
```

then change directory into the client folder run:

```
npm install
```

then change directory back to the root folder

Create the config file required for the application to run

```sh
mkdir src/config
touch src/config/config.js
```

Open the newly created file and populate with the following parameters:

```javascript
module.exports = {
    mongoURI: YOURMONGOURI,
    firebase: YOURFIREBASEPARAMETERS
};
```

Remember to replace YOURMONGOURI with your MongoDB connection point and FIREBASE with your firebase parameters.

Finally use `npm run dev` to start the application.

## Tutorial

Navigate Here [tutorial](tutorial.MD)
