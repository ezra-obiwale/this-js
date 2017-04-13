#Attributes
-----------
##id
This is the id of the container. No two containers of the same type should have the same id.

**Usage**:

`this-id="main"`

##type
A container marker. The container must also have an id. Values include:

- _page_: Indicates the container is a page
- _collection_: Indicates the container lists out models. The url for the collection should be indicated too.
- _model_: Indicates the container shows a model's details. The url for the model may be indicated too.

**Usage**:

`this-type="page" this-id="user"`

`this-type="collection" this-id="users" this-url="/users"`

`this-type="model" this-id="user" this-url="/users/1"`

##url


##action


##load-model
Loads a model container into a page. The value should be the id of the model container.

**Usage**

`this-load-model="user"`

##load-collection
Loads a collection container into a page. The value should be the id of the collection container.

**Usage**

`this-load-collection="users"`

##load-template

Loads a template container into a page. The value should be the id of the template container.

**Usage**

`this-load-template="heading"`
