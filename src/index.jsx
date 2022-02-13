import Post from './Post'
import json from './assets/json'
import Logo from './assets/webpack-logo'
import xml from './assets/data.xml'
import csv from './assets/data.csv'
import './styles/styles.css'
import './styles/less.less'
import './styles/scss.scss'
import './babel'

import React from 'react'
import {render} from 'react-dom'

import * as $ from 'jquery'

const post = new Post('Webpack', Logo)

$('pre').addClass('code').html(post.toString())


const App = () => (<div>REACT</div>)


render(<App />, document.getElementById('app'))

// console.log(post)
// console.log('json:', json)
// console.log('xml:', xml)
// console.log('csv:', csv)
