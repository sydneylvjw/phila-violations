## Notes About Project

-   Benefits of storytelly & other template include provided code templates that don't really need to be tweaked too much
    -   js file will just need modifications to titles and other small things; go ham if you want tho
-   Will need to modify:
    -   index.html
        -   Each article is a different slide for your storymap
        -   ID coincides to a geojson file inside of the data folder
    -   Files inside data folder
-   Need somewhere to run your projects
    -   Can open up the HTML path in your browser but a ton of stuff will break
    -   You'll start a local web server through live preview extensio 

  

## Samples

Find examples from previous years and elsewhere on the internet at [https://github.com/Weitzman-MUSA-JavaScript/story-map-project-examples](https://github.com/Weitzman-MUSA-JavaScript/story-map-project-examples)

## Instructions

### Step 1: Choose a topic

Choose a topic that is fruitfully explained with some combination of narrative and geographic elements. Think about what data you want to tell a story about. Whatever data you use, **be sure to include citations somewhere in your app interface**. You can choose a dataset from any of a number of sources, for example:

-   Use data you've been working with for another class
-   Create your own dataset (check out [geojson.io](https://geojson.io))
-   Find data from an open data repository...

#### OpenDataPhilly.org

OpenDataPhilly has lots of Philadelphia-specific data, like:

-   [Neighborhood Boundaries](https://opendataphilly.org/dataset/philadelphia-neighborhoods)
-   Historic [Streets](https://opendataphilly.org/dataset/historic-streets), [Districts](https://opendataphilly.org/dataset/philadelphia-registered-historic-districts), or [Properties](https://opendataphilly.org/dataset/philadelphia-registered-historic-sites)
-   [School Information](https://opendataphilly.org/dataset/school-information-data)
-   [PA Horticultural Society Land Care](https://opendataphilly.org/dataset/land-care)

#### Other open data portals

Many other cities, counties, states, and countries have dedicated data portals as well. Here are a couple of lists of state-sponsored open data sites:

-   [Data.gov - Open Government](https://data.gov/open-gov/)
-   [Open Knowledge Foundation - DataPortals.org](https://dataportals.org/)

#### Independently compiled data sources

Sources like [Stop Demolishing Philly](https://www.stopdemolishingphilly.com/map/) or other privately compiled data sources.

Use one of the template story maps in the *templates/* folder, modified as you see fit, to explain your topic. For example, open [templates/scrollytelly/](templates/scrollytelly/) and copy the contents to the root folder in this repository. You can then modify the HTML, CSS, JavaScript, and data to suit your needs.

### Step 2: Think About Slide Content

Your story will have multiple slides, each with a title, some additional text, maybe images, and geographic data. Your slide content will go straight into your HTML, and your map features will go in to separate GeoJSON files in the [data/](data/) folder.

### Step 3: Submit your story map

Commit your code and push it to your repository on GitHub. Set up GitHub pages on the repository and submit a new pull request into the original project repository in the class organization.

#### Submission Checklist

-    Pushed latest code to the `main` branch of your repository
-    Linted JS and CSS code
-    Turned on GitHub Pages for the repository and verified that your site works when deployed
-    Submitted a pull request to the original repository in the class organization
-    In the PR **title**, included your name at least
-    In the PR **description**, included a brief description of your topic, and your target audience