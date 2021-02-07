# User routes

|Method | Route | What it does|
|--- | --- | ---|
|GET | / | shows browse page|
|GET | /users/:id | show user profile |
|PUT |/users/:id	|	update user info|
|GET  | /login    |  shows login view|
|PUT |/login	 |logs user in (set cookie), redirect to /|
|PUT |/logout	|logs user out	(clear cookie)|
|GET   |/register     | shows sign up  view|
|PUT |/register	 |adds/registers new user and  (set cookie), redirect to /|



# API routes

|Method | Route | What it does|
|--- | --- | ---|
|GET |/api/maps  |     show list of maps (browse)|
|GET| /api/maps/:id(?parameters)   |show specific queried maps (example my favorites)|
|GET |/api/map/:id(?parameters) |  show map detail view (single map)|
|PUT |/api/map/:id(?parameters)	|	create new map (single map)|
|PATCH |/api/map/:id(?parameters)	|	update map (single) details|
|DELETE |/api/map/(?parameters) 	|	remove map|
|GET |/api/pin/:id(?parameters)  |  show pin details (title/ description etc)|
|PUT |/api/pin/:id(?parameters)    |create new pin |
|PATCH |/api/pin/:id(?parameters)    |edit pin details (title/ description etc)|
|DELETE |/api/pin/:id        |         remove pin from db|
|GET   |   /api/collaborators/:id(?map_id)   | get list of collaborators|
|PUT   |   /api/collaborators/:id(?map_id)   | add new collaborator|
|DELETE   | /api/collaborators/:id(?params)    |remove collaborator |
