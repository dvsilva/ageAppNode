const express = require('express')
const nunjucks = require('nunjucks')
const path = require('path')

const app = express()

nunjucks.configure('src/views', {
  autoescape: true,
  express: app,
  watch: true
})

app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'njk')
app.set('views', path.join(__dirname, 'src', 'views'))

app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => res.render('new'))

app.post('/check', (req, res) => {
  if (req.body.age > 18) res.redirect(`/major/?age=${req.body.age}`)
  else res.redirect(`/minor/?age=${req.body.age}`)
})

// com next executa o middleware sem travar a aplicação
const checkMiddleware = (req, res, next) => {
  if (req.query.age === '') return res.redirect('/')
  return next()
}

app.get('/major', checkMiddleware, (req, res) => {
  res.send(`Você é maior de idade e possui ${req.query.age} anos`)
})

app.get('/minor', checkMiddleware, (req, res) => {
  res.send(`Você é menor de idade e possui ${req.query.age} anos`)
})

app.listen(3000)
