const common = require('./wdio-common')

module.exports = function(RED) {
  function newSession(config) {
    RED.nodes.createNode(this, config)
    const node = this

    common.clearStatus(node)

    node.on('input', async (msg) => {
      try {
        const webdriverConfig = Object.assign(
          { logLevel: config.logLevel },
          parseUri(config.webdriverUri || msg.webdriverUri, node),
          getCapabilities(
            config.webdriverProvider,
            config.webdriverBrowser,
            msg
          )
        )
        node.log = `Open new browser.`
        let b = await common.newSession(webdriverConfig, node, node.context())
        await common.log(node)
        common.connectedStatus(node)
        msg.payload = b.sessionId
        node.send(msg)
      } catch (e) {
        await common.log(node)
        common.handleError(e, node, msg)
      }
    })

    node.on('close', async (done) => {
      try {
        if (config.killSession) {
          let b = await common.deleteSession(node.context())
          let sessionId = ''
          if (b && b.sessionId) sessionId = b.sessionId
          common.disconnectedStatus(node)
          node.log('Disconnected webdriver session ' + sessionId)
        }
      } catch (e) {
        await common.log(node)
        common.handleError(e, node, msg)
      }
      done()
    })
  }
  RED.nodes.registerType('new-session', newSession)
}

const parseUri = (uri, node) => {
  let uriComponents
  try {
    if (uri[uri.length - 1] !== '/') uri += '/'
    //let parsed = uri.match(/(\w+):\/\/(.+):(\d+)(\/.*)/)
    let parsed = uri.match(/(\w+):\/\/(.+)(\/.*)/)
    uriComponents = {
      protocol: parsed[1],
      hostname: parsed[2],
      port: parseInt(parsed[3]),
      path: parsed[4]
    }
  } catch (e) {
    common.handleError(
      new Error(
        'Invalid URI, expected format "<protocol>://<host>:<port>/<path>'
      ),
      node
    )
  }

  return uriComponents
}

const getCapabilities = (vendor, browser, msg) => {
  let capabilities

  if(browser == 'custom'){
    capabilities = msg.capabilities
  }
  else if (vendor === 'browserless.io') {
    capabilities = {
      browserName: browser,
      'goog:chromeOptions': {
        args: ['--headless', '--no-sandbox']
      }
    }
  } else if (vendor === 'local' && browser === 'chromium') {
    capabilities = {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['--headless', '--no-sandbox'],
        w3c: false
      }
    }
  } else if (vendor === 'local') {
    capabilities = {
      browserName: browser,
      //platformName: 'Linux',
      'goog:chromeOptions': {
        w3c: false
      }
    }
  }

  return { capabilities }
}
