### Amey Choudhary
### 2021113017

The following project is part of DASS 2023. It is a social media platform, similar to Reddit. It has been implemented using MERN stack.

It has the following functionalities:
1. For Registration, input your details. The contact number and age must be numbers while other are text.
2. After Logging in, you will be directed to the home page, you can follow other users through "More People to Follow"
3. You can create a new subgreddit, giving you moderator privileges.
4. You can request to join another subgreddit.  You will shall be able to see posts, reports, user lists, stats and requests. If accepted, you can additionally create posts, upvote, downvote and comment.
5. You can leave subgreddit. But once left, you cannot request to join. You will still be able to see posts, reports, user lists, stats and requests. 
6. You can view all the subgreddits under All SubGReddit tab. In it, you can search by name and description (Fuzzy included) and also sort them. You can go to their home page by view option.
7. You can comment on posts, if you are a moderator/member.
8. You can save posts for future references.
9. You can report other users. As a moderator, you can either ignore report, or block user or delete post.
10. You can view stats.
11. Some libraries might need to be installed like bcrypt , jsonwebtoken.

### For running the file

#### Through docker 

First ensure, docker is installed in your system. 


```bash
sudo docker-compose build
sudo docker-compose up

```
Compose build will take time to run.
The web app should run on localhost:3000.

#### Through frontend and backend individually

For frontend, first cd into frontend folder:

```bash 
npm install
npm start
```

For backend, first cd into backend folder:
```bash
npm install
nodemon server.js 
```
(if nodemon is installed, otherwise node)

