const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors')
const userRouter = require('./routers/user.router')
const postRouter = require('./routers/post.router')
const cookieParser = require('cookie-parser')

dotenv.config()

const app = express()

const port = 3001

app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json())

app.use('/users', userRouter)
app.use('/posts', postRouter)

app.listen(port, () => {
    console.log(`서버가 포트 ${port}에 연결되었습니다.`)
})
