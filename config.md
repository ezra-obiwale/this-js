# The Config Object

The default config object is below and can be changed as seen fit.

````javascript
{
    /*
     * The base url upon which other urls are built
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
     * Indicates whether to keep app parameters in the url after processing
     */
    keepParamsInURL: false,
    /*
     * The default layout for the application
     */
    layout: null,
    /*
     * Default uid for models and collections if not explicitly defined
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
     * Paths to pages, layouts and components
     */
    paths: {
        pages: {
            dir: './pages',
            ext: '.html'
        },
        layouts: {
            dir: './layouts',
            ext: '.html'
        },
        components: {
            dir: './components',
            ext: '.html'
        },
        js: './assets/js',
        css: './assets/css'
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
