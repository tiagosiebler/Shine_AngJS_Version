# AngularJS & Bootstrap Frontend for Shine
This specific project is a frontend built with:
* AngularJS
* Bootstrap 3
* A heavily modified version of Shine - not yet included.
* A PHP based task interface exposed through app/API/ - not yet included.

-----------
## Shine
Shine is a web-based dashboard for indie Mac developers. It's designed to manage payment and order processing with PayPal and generate and email license files to your users using the [Aquatic Prime](http://www.aquaticmac.com/) framework. It even uploads each revision of your app into Amazon S3 and can produce reports from your users' demographic info (gathered via [Sparkle](http://sparkle.andymatuschak.org/)). It also serves as a central location to collect user feedback, bug reports, and support questions using the [OpenFeedback framework](http://github.com/tylerhall/OpenFeedback/tree/master).

Here's the [original blog post](http://clickontyler.com/blog/2009/08/shine-an-indie-mac-dashboard/) about the project if you're looking for a longer description.
-----------

# Basic Usage
1. Install dependencies
```sh
$ npm install shine-angular
```
2. Build with gulp
```sh
$ gulp build
```

# Project Structure
### src
Contains all source code that is modified and should be optimized in any way:
* HTML
* JavaScript modules
* CSS

### app
Contains production-ready project with heavy code optimization.

### backup
Bash script to clean project and create tarball. For temporary backup purposes.

### gulpfile.js
Gulp tasks used to automate build & optimization process. 
* Clean project (e.g .DS_Store files)
* Minify HTML
* Concatenate and minify JS resources into two files
* Concatenate, optimize and minify custom CSS files
* Archive production-ready zip of project

For information on gulp refer to: https://github.com/gulpjs/gulp

### package.json
npm depencenies for project.


Screenshots
-----------
To be added later.

![Alt text](https://raw.githubusercontent.com/tiagosiebler/Shine_AngJS_Version/master/screenshots/screen1.png "Main Interface")

![Alt text](https://raw.githubusercontent.com/tiagosiebler/Shine_AngJS_Version/master/screenshots/screen2.png "Versions Interface")
