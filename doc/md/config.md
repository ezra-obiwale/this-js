# The Config Object

The default config object is below and can be changed as seen fit.

````javascript

{
    /* 			 
    * The base url which api urls extend
    */
    baseURL: location.origin + location.pathname,
    /*
    * Indicates whether received model data should be cached for offline
    * access
    */
    cacheData: true,
    /*
    * CRUD settings
    */
    crud: {
        /*
        * Indicates the status info for crud operations
        */
        status: {
            key: 'status', // the key that holds the operation status
            successValue: true // the key value that indicates success
        },
        /*
        * CRUD methods
        */
        methods: {
            create: 'POST',
            read: 'GET',
            update: 'PUT',
            delete: 'DELETE'
        }
    },
    /*
    * The key in each ajax response which holds the actual object or array of objects
    */
    dataKey: 'data',
    /*
    * Indicates whether the app should run in debug mode or not.
    */
    debug: false,
    /*
    * The default layout to use with all pages if none is explicitly specified for the page
    */
    defaultLayout: null,
    /*
    * Indicates whether to keep app parameters in the url after processing
    */
    keepParamsInURL: false,
    /*
    * Default idKey for models and collections if not explicitly defined
    */
    idKey: 'id',
    /*
    * Pagination settings
    */
    pagination: {
        // The number of results to fetch when paginating.
        // FALSE means no limit should be sent. Useful for when the server
        // takes care of its pagination limit
        limit: 20,
        // FALSE means new data would be appended
        overwrite: false
    },
    /*             
    * Paths to asset files
    */
    paths: {
        pages: {
            dir: './pages',
            ext: '.html',
            min: {
                prod: false, // use minified in production
                dev: false, // use minified in developement (when debug:true)
                subdir: "" // subdirectory containing minified files
            }
        },
        layouts: {
            dir: './layouts',
            ext: '.html',
            min: {
                prod: false, // use minified in production
                dev: false, // use minified in developement (when debug:true)
                subdir: "" // subdirectory containing minified files
            }
        },
        components: {
            dir: './components',
            ext: '.html',
            min: {
                prod: false, // use minified in production
                dev: false, // use minified in developement (when debug:true)
                subdir: "" // subdirectory containing minified files
            }
        },
        js: {
            dir: './assets/js',
            min: {
                prod: false, // use minified in production
                dev: false, // use minified in developement (when debug:true)
                subdir: "" // subdirectory containing minified files
            }
        },
        css: {
            dir: './assets/css',
            min: {
                prod: false, // use minified in production
                dev: false, // use minified in developement (when debug:true)
                subdir: "" // subdirectory containing minified files
            }
        }
    },
    /*
    * ID of the page to start the app with
    */
    startWith: null,
    /*
    * The selector that holds the title of each page
    */
    titleContainer: null,
    /*
    * The transition effect to use between pages
    */
    transition: 'switch',
    /*
    * The options for the transition effect
    */
    transitionOptions: {}
}
````
