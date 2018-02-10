## **Introduction**

`Maintenance Tracker` is a `AngularJS` and `NodeJS` App. It's linked to a `Firebase` database.
It has the following features;
* Login with username ans password
* Allows adding requests(maintenance or repair)
* Allows users to edit requests and see the status;
* Allows users to see notifications
* Allows repairers to update request they were assigned a s done
* Allows users to see profile
* Allows adminitrator to add repairers
* Allows administrator to manage requests: accept or reject it

Click here ~~http://centia28.github.io/bc-19-maintenance_tracker/~~to access the app on Github Pages

## Dependencies

### Back End Dependencies

This app's functionality depends on multiple `NodeJS` packages  and `Firebase` database including;
* Angular - This framework helps is essential in the creation of object relational models and it also handles routing on the back end.

### Front End Dependencies

* Materialize CSS - The app's login and dashboard templates have been styled using this CSS framework
* Angular JS - This framework facilitates the dynamic aspects of this app. It enables the application of the Single Page Application philosophy and also has mechanisms to make calls to the backend to update the view with recent data.
* Angular Resource - This is an Angular component that is particularly useful when making calls to a RESTful route.
* Angular - An Angular component that provides read/write access to a browser's cookies.
* ng-file-upload - This library is an angular component that enables file (images in this case) upload and also features a service that enables posting of these uploads to the back end.

## Installation and setup

1. Navigate to a directory of choice on terminal.
2. Clone this repository on that directory.

    * Using SSH;
    
            git clone git@github.com:centia28/bc-19-maintenance_tracker.git
    * Using HTTP;

            https://github.com/centia28/bc-19-maintenance_tracker.git
3. Navigate to the repo's folder on your computer

        cd bc-19-maintenance_tracker/
4. Run the app. It installs the app's backend dependencies.
        
        npm install
        Starting development server at http://127.0.0.1:8000/
         Quit the server with CONTROL-C.

5. You can access to the app in the browser at this: **`http://127.0.0.1:8000/`**
