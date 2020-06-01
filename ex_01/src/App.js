import React, { useState } from 'react'
import { Switch, Route, useRouteMatch, Link, useHistory } from "react-router-dom"

import { useField } from './hooks'


const Menu = () => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Link to='/anecdotes' style={padding}>Anecdotes</Link>
      <Link to='/create' style={padding}>Create new</Link>
      <Link to='/about' style={padding}>About</Link>
    </div>
  )
}

const Anecdote = ({ anecdote }) => (
  <div>
    <h3> {anecdote.content} </h3>
    has {anecdote.votes} votes <br />
    For more information, see: <a href={anecdote.info}> {anecdote.info} </a>
    <br />
  </div>

)

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => <li key={anecdote.id}>
        <Link to={'/anecdote/' + anecdote.id}>{anecdote.content} </Link>
      </li>)}
    </ul>
  </div>
)

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
    Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
    such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    <br />
    Anecdote app for <a href='https://courses.helsinki.fi/fi/tkt21009'>Full Stack -websovelluskehitys</a>.
    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2019/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  const history = useHistory()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Create new", author)
    console.log()
    props.addNew({
      content : content.value,
      author : author.value ,
      info : info.value ,
      votes: 0
    })
    history.push('/')
  }
  const handleReset = (e) => {
    e.preventDefault()
    console.log('Reset form')
    content.onReset()
    info.onReset()
    author.onReset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button >Create</button>
        <button onClick={(e)=>{handleReset(e)}}> Reset</button>
      </form>
    </div>
  )

}
const Notification = ({ notification }) => {
  const style = {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "black",
  }

  if (notification.msg) {
    return (
      <div style={style}>
        {notification.msg}
      </div>)
  }
  else {
    return (<div></div>)
  }
}
const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: '1'
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: '2'
    }
  ])

  const [notification, setNotification] = useState({ msg: '', timer: null })

  const addNew = (anecdote) => {
    anecdote.id = (Math.random() * 10000).toFixed(0)
    setAnecdotes(anecdotes.concat(anecdote))

    if (notification.timer) {
      console.log('Clear old timer', notification.timer)
      clearTimeout(notification.timer);
    }

    const timer = setTimeout(() => { setNotification({ msg: '', timer: null }); }, 10 * 1000);
    setNotification({ msg: "A new anecdote '" + anecdote.content + "' was created!", timer: timer })

  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  const match = useRouteMatch('/anecdote/:id')
  console.log("Match;", match)
  let anecdote = null;

  if (match)
    anecdote = anecdotes.find(x => x.id === match.params.id);

  console.log('anecdote', anecdote)

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <Notification notification={notification} />
      <Switch>
        <Route path="/anecdote/:id">
          <Anecdote anecdote={anecdote} />
        </Route>

        <Route path="/about">
          <About />
        </Route>
        <Route path="/create">
          <CreateNew addNew={addNew} />
        </Route>
        <Route path="/">
          <AnecdoteList anecdotes={anecdotes} />
        </Route>
      </Switch>
      <Footer />
    </div>
  )
}

export default App;
