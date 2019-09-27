const { expect } = require('chai');
import enzyme, { mount } from 'enzyme'
import sinon from 'sinon'
import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import configureMockStore from 'redux-mock-store'
import thunkMiddleware from 'redux-thunk'
import { Provider } from 'react-redux'
import * as rrd from 'react-router-dom'
const { MemoryRouter } = rrd

const middlewares = [thunkMiddleware]
const mockStore = configureMockStore(middlewares)
const initialState = {
  projects: [],
}

import {anHourFromNow} from '../mock-axios'
import { setProjects, fetchProjects } from '../../app/redux/projects'

import appReducer from '../../app/redux'
import { createStore } from 'redux'
import store from '../../app/store'

const app = require('../../server')
const agent = require('supertest')(app)

const { db } = require('../../server/db')
const { Project } = require('../../server/db')
const seed = require('../../seed')

const adapter = new Adapter()
enzyme.configure({ adapter })

import ConnectedAllProjects, { AllProjects } from '../../app/components/AllProjects'
import Root from '../../app/components/root'

// Sometimes, we want to wait for a short time for async events to finish.
const waitFor = (wait) =>
  new Promise((resolve) => setTimeout(resolve, wait))

describe('Tier One: Projects', () => {
  const projects = [
    { id: 1, title: 'Build barn', description: 'Lorem Ipsum' },
    { id: 2, title: 'Discover love', completed: true, deadline: anHourFromNow },
    { id: 3, title: 'Open the pod bay doors', priority: 10 },
  ]

  let fakeStore
  beforeEach(() => {
    fakeStore = mockStore(initialState)
  })

  describe('<AllProjects /> component', () => {
    xit('renders the projects passed in as props', () => {
      const wrapper = mount(
        <Provider store={fakeStore}>
          <MemoryRouter>
            <AllProjects projects={projects} />
          </MemoryRouter>
        </Provider>
      )
      expect(wrapper.text()).to.include('Build barn')
      expect(wrapper.text()).to.include('Discover love')
    })

    xit('*** renders "No Projects" if passed an empty array of projects or if projects is undefined', () => {
      throw new Error('replace this error with your own test')
    })
  })


  describe('Redux', () => {
    describe('set projects', () => {
      xit('setProjects action creator', () => {
        expect(setProjects(projects)).to.deep.equal({
          type: 'SET_PROJECTS',
          projects,
        })
      })

      xit('fetchProjects thunk creator', async () => {
        // Curiously, we can pass this test even though we haven't created any
        // API routes yet. Go check out tests/mock-axios.js to see how we can
        // send dummy data when our tests fetch data from the server.
        await fakeStore.dispatch(fetchProjects())
        const actions = fakeStore.getActions()
        expect(actions[0].type).to.equal('SET_PROJECTS')
        expect(actions[0].projects).to.deep.equal(projects)
      })
    })

    describe('projects reducer', () => {
      // Pay attention to where the store is being created, namely
      // app/redux/index.js. Once you've created your reducer, ensure that
      // it's actually being used by the redux store.
      let testStore
      beforeEach(() => {
        testStore = createStore(appReducer)
      })

      xit('*** returns the initial state by default', () => {
        throw new Error('replace this error with your own test')
      })

      xit('reduces on SET_PROJECTS action', () => {
        const action = { type: 'SET_PROJECTS', projects }

        const prevState = testStore.getState()
        testStore.dispatch(action)
        const newState = testStore.getState()
        expect(newState.projects).to.be.deep.equal(projects);
        expect(newState.projects).to.not.be.equal(prevState.projects);
      })
    })
  })

  describe('Connect: react-redux', () => {
    // hint: take a look at the componentDidMount method in ../../app/components/root
    xit('initializes projects from the server when the app first loads', async () => {
      const reduxStateBeforeMount = store.getState()
      expect(reduxStateBeforeMount.projects).to.deep.equal([])
      mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <Root />
          </MemoryRouter>
        </Provider>
      )
      await waitFor(10) // wait for 10 milliseconds
      const reduxStateAfterMount = store.getState()
      expect(reduxStateAfterMount.projects).to.deep.equal(projects)
    })

    xit('<AllProjects /> is passed projects from store as props', async () => {
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/projects']}>
            <ConnectedAllProjects />
          </MemoryRouter>
        </Provider>
      )
      store.dispatch(fetchProjects()) // fetch the projects
      await waitFor(10) // wait for 10 milliseconds
      wrapper.update() // forces the component to re-render airbnb.io/enzyme/docs/api/ShallowWrapper/update.html
      const { projects: reduxProjects } = store.getState()
      const { projects: componentProjects} = wrapper.find(AllProjects).props()
      expect(componentProjects).to.deep.equal(reduxProjects)
    })
  })

  describe('Navigation', () => {
    beforeEach(() => {
      sinon.stub(rrd, 'BrowserRouter').callsFake(({ children }) => (
        <div>{children}</div>
      ))
    })
    afterEach(() => {
      rrd.BrowserRouter.restore()
    })

    xit('renders <AllProjects /> at path /projects', () => {
      const wrapper = mount(
        <Provider store={fakeStore}>
          <MemoryRouter initialEntries={['/projects']}>
            <Root />
          </MemoryRouter>
        </Provider>
      )
      expect(wrapper.find(AllProjects)).to.have.length(1)
    })

    xit('*** navbar has links to "/projects"', () => {
      throw new Error('replace this error with your own test')
    })
  })

  describe('Express API', () => {
    // Let's test our Express routes WITHOUT actually using the database.
    // By replacing the findAll methods on the Project and Robot models
    // with a spy, we can ensure that our API tests won't fail just because
    // our Sequelize models haven't been implemented yet.
    if (!Project.findAll) Project.findAll = function() {}
    const fakeFindAll = sinon.fake.resolves(projects)
    beforeEach(() => {
      sinon.replace(Project, 'findAll', fakeFindAll)
    })
    afterEach(() => {
      sinon.restore()
    })

    xit('GET /api/projects responds with all projects', async () => {
      const response = await agent
        .get('/api/projects')
        .timeout({ deadline: 20 })
        .expect(200)
      expect(response.body).to.deep.equal(projects)
      expect(Project.findAll.calledOnce).to.be.equal(true)
    })

    xit('GET /api/projects responds with error 500 when database throws error', async () => {
      sinon.restore()
      const fakeFindAllWithError = sinon.fake.rejects(
        Error('Ooopsies, the database is on fire!')
      )
      sinon.replace(Project, 'findAll', fakeFindAllWithError)
      await agent
        .get('/api/projects')
        .timeout({ deadline: 20 })
        .expect(500)
      expect(Project.findAll.calledOnce).to.be.equal(true)
    })
  })

  describe('Sequelize Model', () => {
    // clear database before the 'describe' block
    before(() => db.sync({ force: true }))

    // clear the database after each 'it' block
    afterEach(() => db.sync({ force: true }))

    xit('has fields title, deadline, priority, completed, description', async () => {
      const fakeDeadline = new Date(2018, 12, 31)
      const project = {
        title: 'Make pizza',
        deadline: fakeDeadline,
        priority: 9,
        completed: false,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
      }
      project.notARealAttribute = 'does not compute'
      const savedProject = await Project.create(project)
      expect(savedProject.title).to.equal('Make pizza')
      expect(savedProject.priority).to.equal(9)
      expect(savedProject.completed).to.equal(false)
      expect(savedProject.deadline.toString()).to.equal(fakeDeadline.toString())
      expect(savedProject.description).to.equal('Lorem ipsum dolor sit amet, consectetur adipiscing elit')
    })

    xit('requires title', async () => {
      const project = Project.build()
      try {
        await project.validate()
        throw Error('validation should have failed without title')
      }
      catch (err) {
        expect(err.message).to.contain('title cannot be null')
      }
    })

    xit('title cannot be empty', async () => {
      const project = Project.build({ title: '', priority: 8})
      try {
        await project.validate()
        throw Error('validation should have failed with empty title')
      }
      catch (err) {
        expect(err.message).to.contain('Validation notEmpty on title failed')
      }
    })

    xit('*** deadline must be a valid date', async () => {
      throw new Error('replace this error with your own test')
    })

    xit('priority must be an integer between 1 and 10', async () => {
      const project = {
        title: 'Create party playlist',
        priority: 15
      }

      const highPriority = Project.build(project)
      try {
        await highPriority.validate()
        throw Error('validation should have failed with too high priority')
      }
      catch (err) {
        expect(err.message).to.contain('Validation max on priority failed')
      }

      project.priority = 0
      const lowPriority = Project.build(project)
      try {
        await lowPriority.validate()
        throw Error('validation should have failed with too low priority')
      }
      catch (err) {
        expect(err.message).to.contain('Validation min on priority failed')
      }
    })

    xit('default completed to false if left blank', () => {
      const project = Project.build({ title: 'Clean campus', priority: 5})
      expect(project.completed).to.be.a('boolean')
      expect(project.completed).to.equal(false)
    })
  })

  describe('Seed File', () => {
    beforeEach(seed)

    xit('populates the database with at least three projects', async () => {
      const seedProjects = await Project.findAll()
      expect(seedProjects).to.have.lengthOf.at.least(3)
    })
    // If you've finished this part, remember to run the seed file from the
    // command line to populate your actual database (rather than just the
    // test database). Fire it up with npm run start-dev and see what it looks
    // like in the browser!
  })

})
