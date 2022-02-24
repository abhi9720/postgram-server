# Postgram- A social Networking hub

This is an **social** - networing app with lot of functionality like  sharing post , adding new friend, follow other users , do realtime chat chat with your friends.
Looks Excited right , just click on link below and create your account and join these amazing peoples.


---

## Live Demo [Postgram](https://postgram-social.herokuapp.com/#/)

**Homepage**
![Home Page](https://res.cloudinary.com/abhi97/image/upload/v1629359950/recipes/home_kmdzgh.png)

**Profile**
![PROFILE PAGE](https://res.cloudinary.com/abhi97/image/upload/v1629360037/recipes/profile_t1sjf0.png)

**MESSENGER**
![CHAT PAGE](https://res.cloudinary.com/abhi97/image/upload/v1629359956/recipes/chat_cozsol.png)

### Functionality and Features

- Simple login and signup
- Adding new post
- Follow other user
- Like a post
- Delete a post
- Sending Friend Request using socket.io - accept or reject both
- Realtime chat application
- Creative profile page of user to manage your follower and following , and friend
- Upload profile picture and Cover image for profile page
- Easily Search other user , follow or send request
- **Awesome UI for laptop and desktop**

## **TOOLS AND TECHNOLOGY**

| Nodejs        | Express         | Mongodb              |
| ------------- | --------------- | -------------------- |
| **Reactjs**   | **Socket.io**   | **mongoose**         |
| **Multer**    | **cloudinary**  | **morgan**           |
| **bootstrap** | **react-alert** | **socket.io-client** |
| **axios**     | **Heroku**      | **Material UI**      |

## RUN IT LOCALLY

- Install `Nodejs` and `Reactjs` to your local machine
- Create account on cloudinary and mongodb
- Set up all these keys by creating .env file for nodejs server

`MONGO_URL =`

`CLOUDINARY_CLOUD_NAME =`

`CLOUDINARY_KEY =`

`CLOUDINARY_SECRET =`

- And in Client folder setup .env file and add these variables to it

`REACT_APP_PUBLIC_FOLDER = ./assets/`

`REACT_APP_End_Point = http://localhost:8800/`

- And Finally , run `cd .\server\` then `npm start`
