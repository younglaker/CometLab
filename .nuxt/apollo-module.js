import Vue from 'vue'
import VueApollo from 'vue-apollo'
import 'isomorphic-fetch'
import { createApolloClient, restartWebsockets } from 'vue-cli-plugin-apollo/graphql-client'
import jsCookie from 'js-cookie'
import cookie from 'cookie'
import { InMemoryCache } from 'apollo-cache-inmemory'

Vue.use(VueApollo)

export default (ctx, inject) => {
  const providerOptions = { clients: {} }
  const { app, beforeNuxtRender, req } = ctx
  const AUTH_TOKEN_NAME = 'apollo-token'
  const AUTH_TOKEN_EXPIRES = 10
  const AUTH_TYPE = 'Basic '

  // Config

      const defaultTokenName = ''  || AUTH_TOKEN_NAME

      function defaultGetAuth () {
        let token
        if(process.server){
          const cookies = cookie.parse((req && req.headers.cookie) || '')
          token = cookies[defaultTokenName]
        } else {
          token = jsCookie.get(defaultTokenName)
        }
        return token && defaultClientConfig.validateToken(token) ? AUTH_TYPE + token : ''
      }

      let defaultClientConfig

        defaultClientConfig = require('~/apollo/clientConfig.js')

        if ('default' in defaultClientConfig) {
          defaultClientConfig = defaultClientConfig.default
        }

        defaultClientConfig = defaultClientConfig(ctx)

      const defaultValidateToken = () => true

      if (!defaultClientConfig.validateToken) {
        defaultClientConfig.validateToken = defaultValidateToken
      }

      const defaultCache = defaultClientConfig.cache
        ? defaultClientConfig.cache
        : new InMemoryCache(defaultClientConfig.inMemoryCacheOptions ? defaultClientConfig.inMemoryCacheOptions: undefined)

      if (!process.server) {
        defaultCache.restore(window.__NUXT__ ? window.__NUXT__.apollo.defaultClient : null)
      }

      if (!defaultClientConfig.getAuth) {
        defaultClientConfig.getAuth = defaultGetAuth
      }
      defaultClientConfig.ssr = !!process.server
      defaultClientConfig.cache = defaultCache
      defaultClientConfig.tokenName = defaultTokenName

      // Create apollo client
      let defaultApolloCreation = createApolloClient({
        ...defaultClientConfig
      })
      defaultApolloCreation.apolloClient.wsClient = defaultApolloCreation.wsClient

          providerOptions.defaultClient = defaultApolloCreation.apolloClient

  const vueApolloOptions = Object.assign(providerOptions, {
      errorHandler (error) {
          console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message)
      }
  })

  const apolloProvider = new VueApollo(vueApolloOptions)
  // Allow access to the provider in the context
  app.apolloProvider = apolloProvider

  if (process.server) {
    const ApolloSSR = require('vue-apollo/ssr')
    beforeNuxtRender(({ nuxtState }) => {
      nuxtState.apollo = ApolloSSR.getStates(apolloProvider)
    })
  }

  inject('apolloHelpers', {
    onLogin: async (token, apolloClient = apolloProvider.defaultClient, tokenExpires = AUTH_TOKEN_EXPIRES) => {
      if (token) {
        jsCookie.set(AUTH_TOKEN_NAME, token, { expires: tokenExpires })
      } else {
        jsCookie.remove(AUTH_TOKEN_NAME)
      }
      if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
      try {
        await apolloClient.resetStore()
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('%cError on cache reset (setToken)', 'color: orange;', e.message)
      }
    },
    onLogout: async (apolloClient = apolloProvider.defaultClient) => {
        jsCookie.remove(AUTH_TOKEN_NAME)
        if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
        try {
            await apolloClient.resetStore()
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log('%cError on cache reset (logout)', 'color: orange;', e.message)
        }
    },
    getToken: (tokenName = AUTH_TOKEN_NAME) => {
        if(process.server){
            const cookies = cookie.parse((req && req.headers.cookie) || '')
            return cookies && cookies[tokenName]
        }
        return jsCookie.get(tokenName)
    }
  })
}
