# FED Package
This repository is just a collection of FED files.

## Setup
Requires node.js and gulp.js to be installed on your computer.

If you already have node and gulp installed, skip to step 3.

### Step 1 - Install node.js 
Download node.js from https://nodejs.org/en/ and install it (requires admin access).

To verify that node.js is installed open the command prompt and type `node -v` and press enter.  It should return the version of node installed.

### Step 2 - Install gulp.js globally
In the command prompt type `npm install gulp -g` and press enter.

Verify that gulp is installed by typing `gulp -v` in the command prompt and press enter.

### Step 3 - Install project files.
In the command prompt cd to the project folder. Type `npm install`.

You should now see a folder called **node_modules**.

The setup process is now complete.

## Running the project
There are two commands for working with the project:

### The gulp command
`gulp` - this is the default command in gulpfile.js that will start the project and run a series of tasks.

The series of tasks will:
+ compile all sass to css
+ run the build task (refer to the build task in gulpfiles.js)
+ launch the project in your default Browser
+ watch the project for css, js and html changes and automaticall reload the Browser.

### The gulp-build command
`gulp-build` - this command will run the build task in gulpfile.js.

The build task will:
+ delete and rebuild the dist folder
+ compile all sass to css
+ collect all stysheets and js files from the "build" comment in html files and it will concatinate into their respective main.css/main.js files in the dist folder
+ copy images from src to dist
+ copy font from src to dist
