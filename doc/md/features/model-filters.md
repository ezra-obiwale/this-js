#### Model Filters

The following is a full list of available filters:

- **camelToHyphen ( )**
    
    Changes camel case string to hyphen case
- **camelToSnake ( )**
    
    Changes camel case string to snake case
- **capitalize ( )**
    
    Capitalizes a string
- **date ( format )**
    
    Parses a date string or timestamp with the given **format**.
    
    **Format Parts**:
    
    *Day*
    
    - *D*       -   Day of the week, no leading zero
    - *DD*      -   Day of the week with a leading zero
    - *DDD*     -   Day, 3 letter string
    - *Ddd*     -   Day, capitalized 3 letter string
    - *ddd*     -   Day, lower case 3 letter string
    - *DDDD*    -   Day, full string
    - *Dddd*    -   Day, capitalized full string
    - *dddd*    -   Day, lower case full string
    
    *Date*
        
    - *d*       -   Date, no leading zero
    - *dd*      -   Date with a leading zero
    
    *Month*
    
    - *M*       -   Month, no leading zero
    - *MM*      -   Month with leading zero
    - *MMM*     -   Month, 3 letter string
    - *Mmm*     -   Month, capitalized 3 letter string
    - *mmm*     -   Month, lower case 3 letter string
    - *MMMM*    -   Month, full string
    - *Mmmm*    -   Month, capitalized full string
    - *mmmm*    -   Month, lower case full string
    
    *Year*
    
    - *YY*      -   2 digit year
    - *yy*      -   2 digit year
    - *YYYY*    -   4 digit year
    - *yyyy*    -   4 digit year
    
    *Hour*
    
    - *H*       -   24 hour, no leading zero
    - *h*       -   12 hour, no leading zero
    - *HH*      -   24 hour with leading zero
    - *hh*      -   12 hour with leading zero
    - *MER*     -   Meridian status, upper case (AM/PM)
    - *mer*     -   Meridian status, lower case (am/pm)
    
    *Minute*
    
    - *m*       -   Minute, no leading zero
    - *mm*      -   Minute with leading zero
    
    *Second*
    
    - *s*       -   Second, no leading zero
    - *ss*      -   Second with leading zero
    
    - *ms*      -   Milliseconds
    
    *Timezone*
    
    - *TZ*      -   Timezone, upper case
    - *tz*      -   Timezone, lower case
    
    - *t*       -   Timestamp of date, in milliseconds.

- **filter ( funcName )**

    Filters items out of an object or array with the function whose name is provided.

    The function would receive two parameters: the value and the index, in that order.

    If the function returns true, then the value is retained otherwise it's removed.
- **join ( glue ) **

    A shortcut to `Array.join()`
- **lcase ( )**
    
    A shortcut to filter `lowercase`
- **lcfirst ( )**

    Shortcut to filter `smallize`
- **length ( )**

    Gets the length of the value if value is object, array or string. Returns 0 otherwise.
- **lowercase ( )**
    
    Shortcut to `String.toLowerCase()`
- **nl2br ( )**

    Converts new lines into HTML break tags
- **or ( def ) **
    
    Uses the provided parameter as the value if model property holds no value
- **replace ( options )**

    Performs a search and replace on the value of the property. The format of the parameter is `search:replace;search2:replacemen2;...`
- **smallize ( )**

    Changes the first letter to lower case
- **snakeToCamel**

    Changes snake case to camel case
- **split ( separator )**

    Shortcut to `String.split()`
- **trim ( )**

    Shortcut to `String.trim()`
- **ucase ( )**

    Shortcut to filter `uppercase`
- **ucwords ( )**

    Capitalizes the first letter of each word
- **uppercase ( )**

    Shortcut to `String.toUpperCase()`
