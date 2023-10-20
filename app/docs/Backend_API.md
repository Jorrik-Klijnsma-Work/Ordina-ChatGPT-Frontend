# API Documentation - Backend

## Table of Contents

- [Introduction](#Introduction)
- [Endpoints](#Endpoints)
  - [GetUserChatList](#GetUserChatList)
  - [GetChat](#GetChat)
  - [MakeNewChat](#MakeNewChat)
  - [RequestChatResponse](#RequestChatResponse)
  - [RequestMagicToken](#RequestMagicToken)
  - [LoginUser](#LoginUser)
- [Setting up Authorization](#Setting-up-Authorization)
- [Error Handling](#Error-Handling)
- [Rate Limiting](#Rate-Limiting)
- [Changelog](#Changelog)

---

## Introduction
This API is designed for backend developers working on an Azure service using Python. It outlines how to handle incoming requests and responses for managing chat sessions, authenticating users, and interacting with chat content. 

---

## Endpoints
Each of the API endpoints is explained in detail in the following sections.

### GetUserChatList
This function retrieves a list of all chat sessions for a specific user. 

#### Handling Incoming Request

```python
from flask import Flask, request
app = Flask(__name__)

@app.route('/GetUserChatList', methods=['POST'])
def get_user_chat_list():
    data = request.get_json()
    userId = data.get('userId')
    # Retrieve chat sessions from the database using userId
    # ...
    return jsonify(chat_sessions)
```
---
### GetChat
This function retrieves the history of a chat session.

### Handling Incoming Request

```python
@app.route('/GetChat', methods=['POST'])
def get_chat():
    data = request.get_json()
    chatId = data.get('chatId')
    # Retrieve chat history from the database using chatId
    # ...
    return jsonify(chat_history)
```
---
### MakeNewChat
This function creates a new chat session.

#### Handling Incoming Request

```python
@app.route('/MakeNewChat', methods=['POST'])
def make_new_chat():
    data = request.get_json()
    temp = data.get('temp')
    persona = data.get('persona')
    top_p = data.get('top_p')
    # Create new chat session in the database
    # ...
    return jsonify(new_chat)
```
---
### RequestChatResponse
This function allows a user to send a message in a chat session and receive a response from the assistant.

#### Handling Incoming Request

```python
@app.route('/requestChatResponse', methods=['POST'])
def request_chat_response():
    data = request.get_json()
    chatId = data.get('chatId')
    content = data.get('content')
    # Process user message and generate assistant response
    # ...
    return jsonify(chat_response)
```
---
### RequestMagicToken
This function requests a magic token for the user.

#### Handling Incoming Request

```python
@app.route('/requestMagicToken', methods=['POST'])
def request_magic_token():
    data = request.get_json()
    email = data.get('email')
    # Verify email domain, generate magic token, and send it to the user
    # ...
    return jsonify({"status": "success"})
```
---
### LoginUser
This function logs in a user using a magic token.

#### Handling Incoming Request

```python
@app.route('/LoginUser', methods=['POST'])
def login_user():
    data = request.get_json()
    magicToken = data.get('magicToken')
    # Authenticate user using magic token and generate session token
    # ...
    return jsonify(user_session)
```
---
## Setting up Authorization

The authentication in a Flask application can be managed using extensions like Flask-JWT (JSON Web Token). Here's an example of how you can handle authentication:

```python
from flask_jwt import JWT, jwt_required, current_identity
from werkzeug.security import safe_str_cmp

# Define your User class with properties as needed
class User:
    def __init__(self, id, username, password):
        self.id = id
        self.username = username
        self.password = password

    def __str__(self):
        return "User(id='%s')" % self.id

# You might store users in a database in a real application
users = [
    User(1, 'user1', 'password1'),
    User(2, 'user2', 'password2'),
]

username_table = {u.username: u for u in users}
userid_table = {u.id: u for u in users}

def authenticate(username, password):
    user = username_table.get(username, None)
    if user and safe_str_cmp(user.password.encode('utf-8'), password.encode('utf-8')):
        return user

def identity(payload):
    user_id = payload['identity']
    return userid_table.get(user_id, None)

app = Flask(__name__)
app.debug = True
app.config['SECRET_KEY'] = 'super-secret'

jwt = JWT(app, authenticate, identity)

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    return '%s' % current_identity
```

In this example, we're using Flask-JWT to handle JSON Web Tokens. The `authenticate` function is used when a client attempts to authenticate. If authentication is successful, the function returns a User object, which Flask-JWT uses to build a JWT and send it to the client.

The `identity` function is used when a client attempts to access a protected endpoint. Flask-JWT passes the contents of the token's 'identity' field (which is the user id) to the function, which then returns a User object if a user with that id exists.

The `jwt_required()` decorator is used to protect endpoints. Only clients who have sent a valid JWT will be able to access these endpoints.

The provided secret key (`app.config['SECRET_KEY']`) should be kept secure, as anyone with the key can create valid tokens.

Remember, this is a simple example for illustrative purposes and might not be secure enough for a production environment. Make sure to use securely hashed passwords and follow best practices for user authentication in a real-world application.

## Error Handling
Errors can be handled in Flask using the `@app.errorhandler()` decorator. For example, to handle 404 errors, you can define a function like this:

```python
@app.errorhandler(404)
def page_not_found(e):
    return jsonify(error=404, text=str(e)), 404
```

## Rate Limiting
Rate limiting can be added to your Flask application using the Flask-Limiter extension. Here is an example of how to use it:

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(app, key_func=get_remote_address)
@app.route("/limited", methods=["GET"])
@limiter.limit("10/minute")  # change this to set the limit
def limited_route():
    return "This route is limited!"
```

## Changelog
### v1.0
- Initial release of the API documentation.
