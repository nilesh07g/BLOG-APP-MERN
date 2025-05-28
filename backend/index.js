const express = require('express')
const mongoose = require('mongoose');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();

//parse options
app.use(cors());
app.use(express.json());

//routes
const blogRoutes = require('./src/routes/blog.route');
const commentRoutes = require('./src/routes/comment.route');
const userRoutes = require('./src/routes/auth.user.route');
app.use('/api/auth', userRoutes)
app.use('/api/blogs', blogRoutes)
app.use('/api/comments', commentRoutes)





async function main() {
    await mongoose.connect(process.env.MONGODB_URL);

    app.get('/', (req, res) => {
        res.send('Hello World!')
      })
    
  }


  main().then(()=>console.log("Mongodb connected successfully!")).catch(err => console.log(err));



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})