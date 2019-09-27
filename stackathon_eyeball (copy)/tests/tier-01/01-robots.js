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
  robots: [],
}

import { setRobots, fetchRobots } from '../../app/redux/robots'

import appReducer from '../../app/redux'
import { createStore } from 'redux'
import store from '../../app/store'

const app = require('../../server')
const agent = require('supertest')(app)

const { db } = require('../../server/db')
const { Robot } = require('../../server/db')
const seed = require('../../seed')

const adapter = new Adapter()
enzyme.configure({ adapter })

import ConnectedAllRobots, { AllRobots } from '../../app/components/AllRobots'
import Root from '../../app/components/root'

// Sometimes, we want to wait for a short time for async events to finish.
const waitFor = (wait) =>
  new Promise((resolve) => setTimeout(resolve, wait))

describe('Tier One: Robots', () => {
  let fakeStore
  const robots = [
    { id: 1, name: 'R2-D2', imageUrl: '/images/r2d2.png' },
    { id: 2, name: 'WALL-E', imageUrl: '/images/walle.jpeg' },
  ]
  beforeEach(() => {
    fakeStore = mockStore(initialState)
  })

  describe('<AllRobots /> component', () => {

    xit('renders the robots passed in as props', () => {
      const wrapper = mount(
        <Provider store={fakeStore}>
          <MemoryRouter>
            <AllRobots robots={[
              { id: 1, name: 'R2-D2', imageUrl: '/images/r2d2.png' },
              { id: 2, name: 'WALL-E', imageUrl: '/images/walle.jpeg' },
            ]} />
          </MemoryRouter>
        </Provider>
      )
      expect(wrapper.text()).to.include('R2-D2')
      expect(wrapper.text()).to.include('WALL-E')
      const images = wrapper.find('img').map(node => node.get(0).props.src)
      expect(images).to.include.members([
        '/images/r2d2.png',
        '/images/walle.jpeg',
      ])
    })

    xit('*** renders "No Robots" if passed an empty array of robots or if robots is undefined', () => {
      throw new Error('replace this error with your own test')
    })
  })

  describe('Redux', () => {
    describe('set/fetch robots', () => {
      xit('setRobots action creator', () => {
        expect(setRobots(robots)).to.deep.equal({
          type: 'SET_ROBOTS',
          robots,
        })
      })

      xit('fetchRobots thunk creator', async () => {
        // Curiously, we can pass this test even though we haven't created any
        // API routes yet. Go check out tests/mock-axios.js to see how we can
        // send dummy data when our tests fetch data from the server.
        await fakeStore.dispatch(fetchRobots())
        const actions = fakeStore.getActions()
        expect(actions[0].type).to.equal('SET_ROBOTS')
        expect(actions[0].robots).to.deep.equal(robots)
      })
    })

    describe('robots reducer', () => {
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

      xit('reduces on SET_ROBOTS action', () => {
        const action = { type: 'SET_ROBOTS', robots }

        const prevState = testStore.getState()
        testStore.dispatch(action)
        const newState = testStore.getState()

        expect(newState.robots).to.be.deep.equal(robots);
        expect(newState.robots).to.not.be.equal(prevState.robots);
      })
    })

  })

  describe('Connect: react-redux', () => {

    xit('initializes robots from the server when the app first loads', async () => {
      const reduxStateBeforeMount = store.getState()
      expect(reduxStateBeforeMount.robots).to.deep.equal([])
      mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <Root />
          </MemoryRouter>
        </Provider>
      )
      await waitFor(10) // wait for 10 milliseconds
      const reduxStateAfterMount = store.getState()
      expect(reduxStateAfterMount.robots).to.deep.equal(robots)
    })

    xit('<AllRobots /> is passed robots from store as props', async () => {
      const wrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/robots']}>
            <ConnectedAllRobots />
          </MemoryRouter>
        </Provider>
      )
      store.dispatch(fetchRobots()) // fetch the robots
      await waitFor(10) // wait for 10 milliseconds
      wrapper.update() // forces the component to re-render airbnb.io/enzyme/docs/api/ShallowWrapper/update.html
      const { robots: reduxRobotes } = store.getState()
      const { robots: componentRobots } = wrapper.find(AllRobots).props()
      expect(componentRobots).to.deep.equal(reduxRobotes)
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

    xit('renders <AllRobots /> at path /robots', () => {
      const wrapper = mount(
        <Provider store={fakeStore}>
          <MemoryRouter initialEntries={['/robots']}>
            <Root />
          </MemoryRouter>
        </Provider>
      )
      expect(wrapper.find(AllRobots)).to.have.length(1)
    })

    xit('*** navbar has links to "/robots" and "/" (homepage)', () => {
      throw new Error('replace this error with your own test')
    })

  })

  describe('Express API', () => {
    // Let's test our Express routes WITHOUT actually using the database.
    // By replacing the findAll methods on the Robot and Student models
    // with a spy, we can ensure that our API tests won't fail just because
    // our Sequelize models haven't been implemented yet.
    // For more information on fakes, read the docs:
    // https://sinonjs.org/releases/latest/fakes/#adding-the-fake-to-the-system-under-test
    if (!Robot.findAll) Robot.findAll = function() {}
    const fakeFindAll = sinon.fake.resolves([
      { id: 1, name: 'R2-D2', imageUrl: '/images/r2d2.png' },
      { id: 2, name: 'WALL-E', imageUrl: '/images/walle.jpeg' },
    ])
    beforeEach(() => {
      sinon.replace(Robot, 'findAll', fakeFindAll)
    })
    afterEach(() => {
      sinon.restore()
    })

    xit('GET /api/robots responds with all robots', async () => {
      const response = await agent
        .get('/api/robots')
        .timeout({ deadline: 20 })
        .expect(200)
      expect(response.body).to.deep.equal([
        { id: 1, name: 'R2-D2', imageUrl: '/images/r2d2.png' },
        { id: 2, name: 'WALL-E', imageUrl: '/images/walle.jpeg' },
      ])
      expect(Robot.findAll.calledOnce).to.be.equal(true)
    })

    xit('GET /api/robots responds with error 500 when database throws error', async () => {
      sinon.restore()
      const fakeFindAllWithError = sinon.fake.rejects(
        Error('Ooopsies, the database is on fire!')
      )
      sinon.replace(Robot, 'findAll', fakeFindAllWithError)
      await agent
        .get('/api/robots')
        .timeout({ deadline: 20 })
        .expect(500)
      expect(Robot.findAll.calledOnce).to.be.equal(true)
    })
  })

  describe('Sequelize Model', () => {
    let robot;
    before(() => db.sync({ force: true }))
    beforeEach(() => {
      robot = {
        name: 'R2-D2',
        imageUrl: '/images/r2d2.png',
        fuelType: 'electric',
        fuelLevel: 88.34,
      }
    })
    afterEach(() => db.sync({ force: true }))

    xit('has fields name, imageUrl, fuelType, fuelLevel', async () => {
      robot.notARealAttribute = 'does not compute'
      const savedRobot = await Robot.create(robot)
      expect(savedRobot.name).to.equal('R2-D2')
      expect(savedRobot.imageUrl).to.equal('/images/r2d2.png')
      expect(savedRobot.fuelType).to.equal('electric')
      expect(savedRobot.fuelLevel).to.equal(88.34)
      expect(savedRobot.notARealAttribute).to.equal(undefined)
    })

    xit('*** name cannot be null or an empty string', async () => {
      throw new Error('replace this error with your own test')
    })

    xit('fuelType can only be gas, diesel, or electric (defaults to electric)', async () => {
      robot.fuelType = 'the power of love'
      try {
        const badFuelRobot = await Robot.create(robot)
        if (badFuelRobot) throw Error('Validation should have failed with invalid fuelType')
      } catch (err) {
        expect(err.message).to.not.have.string('Validation should have failed')
      }
      delete robot.fuelType
      const defaultFuelRobot = await Robot.create(robot)
      expect(defaultFuelRobot.fuelType).to.equal('electric')
    })

    xit('fuelLevel must be between 0 and 100 (defaults to 100)', async () => {
      robot.fuelLevel = -10
      try {
        const negativeFuelRobot = await Robot.create(robot)
        if (negativeFuelRobot) throw Error('Validation should have failed with fuelLevel < 0')
      } catch (err) {
        expect(err.message).to.not.have.string('Validation should have failed')
      }
      robot.fuelLevel = 9001
      try {
        const tooMuchFuelRobot = await Robot.create(robot)
        if (tooMuchFuelRobot) throw Error('Validation should have failed with fuelLevel > 100')
      } catch (err) {
        expect(err.message).to.not.have.string('Validation should have failed')
      }
      delete robot.fuelLevel
      const defaultFuelLevelRobot = await Robot.create(robot)
      expect(defaultFuelLevelRobot.fuelLevel).to.equal(100)
    })
  })
  describe('Seed File', () => {
    beforeEach(seed)

    xit('populates the database with at least three robots', async () => {
      const seedRobots = await Robot.findAll()
      expect(seedRobots).to.have.lengthOf.at.least(3)
    })
    // If you've finished this part, remember to run the seed file from the
    // command line to populate your actual database (rather than just the
    // test database). Fire it up with npm run start-dev and see what it looks
    // like in the browser!
  })
})
