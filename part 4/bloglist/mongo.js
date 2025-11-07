const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://judithrea_db_user:${password}@cluster0.edbuqms.mongodb.net/testBloglistApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

const Blog = mongoose.model('Blog', blogSchema)

if (process.argv.length === 3) {
  Blog.find({}).then(result => {
    console.log('bloglist:')
    result.forEach(blog => {
      console.log(`${blog.title} ${blog.author} ${blog.url} ${blog.likes}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 7) {
  const title = process.argv[3]
  const author = process.argv[4]
  const url = process.argv[5]
  const likes = process.argv[6]

  const blog = new Blog({ title, author, url, likes })

  blog.save().then(() => {
    console.log(`Added ${title} author ${author} to bloglist`)
    mongoose.connection.close()
  })
}