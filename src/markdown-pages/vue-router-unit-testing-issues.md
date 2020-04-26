---
path: "/blog/there-are-code-smells-when-writing-vue-router-unit-tests-with-nodejs-and-jsdom"
date: "2020-04-25"
title: "There are code smells when writing vue router unit tests with Node.js and jsdom"
categories:
  - Code
tags:
  - javascript 
  - unit test
  - npm package
  - vue-router
---

I have been trying to write unit tests in a web application to test the functionality of a vue-router definition. I quickly realized that these are not actually unit tests and they have code smell.

I believe the definition of a unit test should include the follow statements:
- Unit tests need to run independently
- Unit tests should be able to be reordered in any combination

I think it would be bad practice to not follow these definitions.

# Create vue application to test the code smell

We will create a vue application with vue cli because it has everything out of the box to test this code smell.

```terminal
$ npm install @vue/cli
```

> I don't recommend using global installs, that is global pollution.

```terminal
$ npx vue create unit-test-project
$ cd unit-test-project
$ vue add @vue/unit-mocha
$ npm run test:unit
```

```terminal
 WEBPACK  Compiling...

  [===                      ] 10% (building)

  [=========================] 98% (after emitting)

 DONE  Compiled successfully in 1949ms

  [=========================] 100% (completed)

 WEBPACK  Compiled successfully in 1949ms

 MOCHA  Testing...

  HelloWorld.vue
    √ renders props.msg when passed

  1 passing (23ms)

 MOCHA  Tests completed successfully
```

Great, everything is working. We have a foundation to write out unit tests.

We need to install [vue-router](https://www.npmjs.com/package/vue-router) package now.

```terminal
$ npm install vue-router
```

The unit tests are located in `tests/unit`. Here is the code for the unit test of the code smells.

```javascript
import { expect } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
import VueRouter from "vue-router"

const routes = [
  {
    path: '/',
    name: 'root'
  },
  {
    path: '/home',
    name: 'home'
  },
  {
    path: '/options',
    name: 'options'
  },
  {
    path: '/profile',
    name: 'profile'
  }
];

describe('Vue Router', () => {
  describe('initialize a vue router instance', () => {
    it('should default to root route name', () => {
      const localVue = createLocalVue()
      localVue.use(VueRouter)
      const router = new VueRouter({routes})
      const wrapper = shallowMount(HelloWorld, { localVue, router})
      const actual = wrapper.vm.$router.currentRoute.name
      const expected = 'root'
      expect(actual).to.equal(expected)
    })
    describe('when navigating', () => {
      it("should be able to access home", () => {
        const localVue = createLocalVue()
        localVue.use(VueRouter)
        const router = new VueRouter({routes})
        const wrapper = shallowMount(HelloWorld, { localVue, router})
        wrapper.vm.$router.push('home')
        const actual = wrapper.vm.$router.currentRoute.name
        const expected = 'home'
        expect(actual).to.equal(expected)
      })
      it("should be able to access options from root path", () => {
        const localVue = createLocalVue()
        localVue.use(VueRouter)
        const router = new VueRouter({routes})
        const wrapper = shallowMount(HelloWorld, { localVue, router})
        const currentRouteName = wrapper.vm.$router.currentRoute.name
        expect(currentRouteName).to.equal('root')
        wrapper.vm.$router.push('options')
        const actual = wrapper.vm.$router.currentRoute.name
        const expected = 'options'
        expect(actual).to.equal(expected)
      })
    })
  })
})
```
> I delete the unit test file that is already there because we do not need it for this test.

I created a routes array with the routes that I want to test inside a vue router. Say if we declare these routes in our web application and we want to make sure they are all accessible. We should be able to initialize our routes and be able to navigate to them within the vue router unit test. 

This is were the code starts to smell.

We first write a unit test that we can access home. Great that unit test passes.

Now let us write a `should be able to access options from root path`. Maybe we have had a bug lately that someone on the root path cannot route to options. 

```terminal
$ npm run test:unit 
  Vue Router
    initialize a vue router instance
      √ should default to root route name
      when navigating
        √ should be able to access home
        1) should be able to access options from root path

  2 passing (108ms)
  1 failing

  1) Vue Router
       initialize a vue router instance
         when navigating
           should be able to access options from root path:

      AssertionError: expected 'home' to equal 'root'
      + expected - actual

      -home
      +root
```

Wait what? I have a unit test that passes saying that when the vue router initializes the current route is `/` and the name is `root`.

This is why the code smells, we thought we were writing a unit test to test the functionality of the vue router. What we see is a unit test N+1 being effected by a unit test N. This goes against our definition of our unit test stated above.

Try commenting out the unit test `should be able to access home` and rerun it. It will work.

```terminal
 DONE  Compiled successfully in 1723ms

  [=========================] 100% (completed)

 WEBPACK  Compiled successfully in 1723ms

 MOCHA  Testing...

  Vue Router
    initialize a vue router instance
      √ should default to root route name
      when navigating
        √ should be able to access options from root path

  2 passing (36ms)

 MOCHA  Tests completed successfully
 ```

Okay, well what am I supposed to do? Why is this happening? I created my own localVue, I created my own VueRouter instance. Why is the vue router being edited across unit tests?

I check the vue test util documentation 

> createLocalVue returns a Vue class for you to add components, mixins and install plugins without polluting the global Vue class.

Okay great, just what I want!

No way it could be my `VueRouter` instance, it is a new object everytime! I'll prove it!

I'll add a key to the objects to prove they are different and console log each object with that key

```javascript
localVue.myVar = "I'll prove it!"
console.log('localVue',localVue.myVar)
localVue.use(VueRouter)
const router = new VueRouter({routes})
router.myVar = 42
console.log('Router',router.myVar)

// I also console.log the router, and localVue in the next 2 unit tests
```

```terminal
  Vue Router
    initialize a vue router instance
localVue I'll prove it!
Router 42
      √ should default to root route name
      when navigating
localVue undefined
Router undefined
        √ should be able to access home
localVue undefined
Router undefined
        1) should be able to access options from root path
```

Okay, what gives? `localVue` and `router` are always new instances. They aren't shared across the unit tests.

Wait what is shared? `VueRouter`, but wait! I created my own `createLocalVue` and my own `router` instance how is it possible the `VueRouter` that I am using is shared across all of them. I literally write a line of code to initialize a new router object in the `shallowMount`! 

What happens if I add some variables to the `VueRouter` object that is imported at the top level.

```javascript
import VueRouter from "vue-router"

VueRouter.myVar = "Why is this happening?"
```

```terminal
  Vue Router
    initialize a vue router instance
import VueRouter Why is this happening?
localVue I'll prove it!
Router 42
      √ should default to root route name
      when navigating
import VueRouter Why is this happening?
localVue undefined
Router undefined
        √ should be able to access home
import VueRouter Why is this happening?
localVue undefined
Router undefined
        1) should be able to access options from root path
```

Well duhh that should print, the scoping of `VueRouter` import is at the top level of the file. What did you expect? Okay but what about the `VueRouter` that is then `used` inside my localVue.

We can take a look at the documentation for `Vue.use`

https://vuejs.org/v2/api/#Vue-use

> When this method is called on the same plugin multiple times, the plugin will be installed only once.

Well I have 3 different Vue instances, I proved it! 

More documentation :

https://vuejs.org/v2/guide/plugins.html

> Vue.use automatically prevents you from using the same plugin more than once, so calling it multiple times on the same plugin will install the plugin only once.

Well how do I make the `VueRouters` not talk to each other?

After doing some some research,

https://stackoverflow.com/questions/37459565/es6-import-duplicates

https://tc39.es/ecma262/#sec-hostresolveimportedmodule

> Each time this operation is called with a specific referencingScriptOrModule, specifier pair as arguments it must return the same Module Record instance if it completes normally.

Can we somehow create a new instance and use that instead of using one import statement above?

```javascript
// index.js inside the folder createLocalVueRouter
export const createLocalVueRouter = () => {
  delete require.cache[require.resolve('vue-router')]; 
  return require('vue-router').default
}
```

I know that you can delete the cache in node.js and re-require the module for it retrieves a new instance.

Okay we should make some new unit tests now knowing we can have 3 seperate vue router import statements for the vue routers are dependent on each other.

```javascript
import { expect } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
import {createLocalVueRouter} from "../../createLocalVueRouter"

const routes = [
  {
    path: '/',
    name: 'root'
  },
  {
    path: '/home',
    name: 'home'
  },
  {
    path: '/options',
    name: 'options'
  },
  {
    path: '/profile',
    name: 'profile'
  }
];

describe('Vue Router', () => {
  describe('initialize a vue router instance', () => {
    it('should default to root route name', () => {
      const localVueRouter = createLocalVueRouter()
      const localVue = createLocalVue()
      localVue.use(localVueRouter)
      const router = new localVueRouter({routes})
      const wrapper = shallowMount(HelloWorld, { localVue, router})
      const actual = wrapper.vm.$router.currentRoute.name
      const expected = 'root'
      expect(actual).to.equal(expected)
    })
    describe('when navigating', () => {
      it("should be able to access home", () => {
        const localVueRouter = createLocalVueRouter()
        const localVue = createLocalVue()
        localVue.use(localVueRouter)
        const router = new localVueRouter({routes})
        const wrapper = shallowMount(HelloWorld, { localVue, router})
        wrapper.vm.$router.push('home')
        const actual = wrapper.vm.$router.currentRoute.name
        const expected = 'home'
        expect(actual).to.equal(expected)
      })
      it("should be able to access options from root path", () => {
        const localVueRouter = createLocalVueRouter()
        const localVue = createLocalVue()
        localVue.use(localVueRouter)
        const router = new localVueRouter({routes})
        const wrapper = shallowMount(HelloWorld, { localVue, router})
        const currentRouteName = wrapper.vm.$router.currentRoute.name
        expect(currentRouteName).to.equal('root')
        wrapper.vm.$router.push('options')
        const actual = wrapper.vm.$router.currentRoute.name
        const expected = 'options'
        expect(actual).to.equal(expected)
      })
    })
  })
})
```

```terminal
$ npm run test:unit
 MOCHA  Testing...

  Vue Router
    initialize a vue router instance
      √ should default to root route name
      when navigating
        √ should be able to access home
        1) should be able to access options from root path

  2 passing (107ms)
  1 failing

  1) Vue Router
       initialize a vue router instance
         when navigating
           should be able to access options from root path:

      AssertionError: expected 'home' to equal 'root'
      + expected - actual

      -home
      +root
```

Why is this happening? 

vue-router actually uses global variables. You can't uncache and reload the component with module requires. Why would you think you can do that? The module still is accessing and using global variables. You can't reload the module.

Look at the function [getHash](https://github.com/vuejs/vue-router/blob/65de048ee9f0ebf899ae99c82b71ad397727e55d/src/history/hash.js#L109)

```javascript
function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  // empty path
  if (index < 0) { return '' }

  href = href.slice(index + 1);
  // decode the hash but not the search or hash
  // as search(query) is already decoded
  // https://github.com/vuejs/vue-router/issues/2708
  var searchIndex = href.indexOf('?');
  if (searchIndex < 0) {
    var hashIndex = href.indexOf('#');
    if (hashIndex > -1) {
      href = decodeURI(href.slice(0, hashIndex)) + href.slice(hashIndex);
    } else { href = decodeURI(href); }
  } else {
    href = decodeURI(href.slice(0, searchIndex)) + href.slice(searchIndex);
  }

  return href
}
```

```javascript
var href = window.location.href;
```

Great, global variables.

If you print the value of `href` each time in our unit test above this is what you will see

```javascript
  Vue Router
    initialize a vue router instance
http://localhost/
http://localhost/#/
http://localhost/#/
      √ should default to root route name
      when navigating
http://localhost/#/
http://localhost/#/
http://localhost/#/
http://localhost/#/home
        √ should be able to access home
http://localhost/#/home
http://localhost/#/home
http://localhost/#/home
        1) should be able to access options from root path
```

You can see that the `window.location.href` is being used across all the unit tests. `window.location.href` isn't even `vue-router` that is from JSDOM.

We can update our `createLocalVueRouter` function to account for this global variable.


```javascript
export const createLocalVueRouter = () => {
  delete require.cache[require.resolve('vue-router')]; 
  if (window && window.location && window.location.href) {
    window.location.href = '/'
  }
  return require('vue-router').default
}
```

All the tests pass now.

```terminal
$ npm run test:unit
 MOCHA  Testing...

  Vue Router
    initialize a vue router instance
      √ should default to root route name
      when navigating
        √ should be able to access home
        √ should be able to access options from root path

  3 passing (174ms)

 MOCHA  Tests completed successfully
```

This is just a mess. We have a module that relies on global variables and the state isn't being restored in normal usage. You cannot easily write a unit test because of this global variable. The global variable actually comes from JSDOM.

https://www.npmjs.com/package/@vue/cli-plugin-unit-mocha

> Note the tests are run inside Node.js with browser environment simulated with JSDOM.

Now I thought to myself how is vue-router writing it's unit tests for vue-router if I ran into this issue? I checked out their repo myself and looked into the unit tests.

https://github.com/vuejs/vue-route

https://github.com/vuejs/vue-router/blob/65de048ee9f0ebf899ae99c82b71ad397727e55d/test/unit/specs/discrete-components.spec.js

I installed the repo and found this file `discrete-components.spec.js`. You will see that they are testing a similar unit test to what I want to test and it passes. Why does theirs work but not mine?

Oh what they don't tell you is they are actually unit testing their code without global variables.

https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations

> The default mode for vue-router is hash mode - it uses the URL hash to simulate a full URL so that the page won't be reloaded when the URL changes.

https://github.com/vuejs/vue-router/blob/65de048ee9f0ebf899ae99c82b71ad397727e55d/src/index.js#L44

```javascript
    let mode = options.mode || 'hash'
    this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false
    if (this.fallback) {
      mode = 'hash'
    }
    if (!inBrowser) {
      mode = 'abstract'
    }
    this.mode = mode
```

No you aren't! You are using 'abstract'.  You aren't using hash mode in your unit tests.
Well if you look at the code if you aren't in a browser it will default to abstract. The documentation they provide is misleading.

```javascript
var inBrowser = typeof window !== 'undefined';
```

JSDOM creates a global window object in the mocha unit tests. That means it will be in `hash` mode in our unit tests.

They are using the `abstract` mode which is used Node.js environments. 

If I initialize all my VueRouter instances to use `mode: abstract` my unit tests would pass but that is not the point!

The `vue-router` module says the browser is determined by the window object. JSDOM reimplements the DOM by creating a window object all while you are in Node.js.

You are telling me that we are using Node.js but then using a browser environment so VueRouter goes to hash mode. So now the unit tests are dependant on one another because the entire environment is in browser mode. It won't default to abstract mode.

This can be confusing, you are in Node.js but you are in a simulated browser at the same time. How can you effecetively write unit tests that don't effect one another? I wrote unit tests that import and create local variables that shouldn't be scoped into a function but it actually is because we are sharing a global variable that is `window.location.href`. This is utterly annoying. I could have easily written `abstract` within the initialization statement. I could have easily written `window.location.href = ''` after each `it` function to clear the history. I could have easily imported variables that are not scoped into another function to write my unit test but I can't. This library effects global storage and it doesn't really tell you.

I say easily after spending a long time debugging why this problem occurs and what are potential solutions.

You cannot simulate a new `window.location.href` with a new `VueRouter` object across the browser environment in each unit test with how they have implemented their library. It is really annoying. 

I don't want one VueRouter to effect another VueRouter clearly that is asking for too much.

My current solution to this problem.

```javascript
export const createLocalVueRouter = () => {
  delete require.cache[require.resolve('vue-router')]; 
  if (window && window.location && window.location.href) {
    window.location.href = '/'
  }
  return require('vue-router').default
}
```

# JSDOM extra information

What really is happening is that within each unit test the JSDOM does not get cleared. VueRouter doesn't care or know about that it is just using whatever is in `window.location`. What do either test runners or others have to say about clearing JSDOM between unit tests?

##  JSDOM does not clear after every unit test 

https://stackoverflow.com/questions/42805128/does-jest-reset-the-jsdom-document-after-every-suite-or-test

> No. Jest does not clean the JSDOM document after each test run! It only clears the DOM after all tests inside an entire file are completed.

We are using mocha but the same idea applies.

## Someone had the same idea as me but gets shut down

https://github.com/facebook/jest/issues/1224

>I suggest if you need this, to either:
>  - Write your own cleanup handler.
>  - Create a separate test file.
>
>Does this work for you? At this point I'm quite hesitant to adding new APIs to support jsdom better.


# NPM package

I created an NPM package for this solution as well.

It can be found [here](https://www.npmjs.com/package/createlocalvuerouter)