import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

console.log('ENV: ' + process.env.NODE_ENV)

ReactDOM.render(<App />, document.getElementById('root'))