const wdio = require('webdriverio')
let newSessionNode

module.exports.getBrowser = (context) => {
  let browser = context.flow.get('wdio_browser')
  if (!browser || !browser.sessionId)
    throw new Error('No session defined - call newSession first')

  return browser
}

/*
config = {
    logLevel: 'error',
    protocol: 'https',
    hostname: '<key>@chrome.browserless.io',
    port: 443,
    path: '/webdriver',
    capabilities: {
        browserName: 'chrome',
        chromeOptions: {
            args: ['--headless', '--no-sandbox']
        }
    }
}
*/
module.exports.newSession = async (config, node, context) => {
  let browser
  try {
    browser = await wdio.remote(config)
    context.flow.set('wdio_browser', browser)
    newSessionNode = node
  } catch (e) {
    throw e
  }
  return browser
}

module.exports.deleteSession = async (context) => {
  let b
  let browser = context.flow.get('wdio_browser')
  try {
    b = { sessionId: browser.sessionId }
    await browser.closeWindow()
    await browser.deleteSession()
    context.flow.set('wdio_browser', null)
    if (newSessionNode) module.exports.disconnected(newSessionNode)
  } catch (e) {}
  return b
}

module.exports.getElementId = async (browser, using, value) => {
  let elementId
  try {
    const element = await browser.findElement(using, value)
    if (element && Object.keys(element)) {
      elementId = element[Object.keys(element)[0]]
    } else {
      let e
      if (element && element.message) {
        e = element.message
      } else {
        e = 'Element not found'
      }
      throw new Error(e)
    }
  } catch (e) {
    throw e
  }
  return elementId
}

module.exports.getLocator = async (browser, using, value) => {
  let locator = ''
    switch (using) {
        case 'id':
            locator = `#${value}`
            break
        case 'name':
            locator = `[name='${value}']`
            break
        case 'className':
            locator = `.${value}`
            break
        case 'tagName':
            locator = value
            break
        case 'cssSelector':
            locator = value
            break
        case 'text':
            locator = `=${value}`
            break
        case 'partialText':
            locator = `*=${value}`
            break
        case 'xPath':
            locator = value
            break
        default:
            locator = value
    }

  return locator
}

module.exports.handleError = (e, node, msg) => {
  console.log(e)
  module.exports.errorStatus(node)
  node.error(e, msg)
}

module.exports.clearStatus = (node) => {
  node.status({})
}

module.exports.connectedStatus = (node) => {
  node.status({
    fill: 'green',
    shape: 'dot',
    text: 'connected'
  })
}

module.exports.disconnectedStatus = (node) => {
  node.status({
    fill: 'green',
    shape: 'ring',
    text: 'disconnected'
  })
}

module.exports.successStatus = (node) => {
  node.status({
    fill: 'green',
    shape: 'ring',
    text: 'done'
  })
}

module.exports.errorStatus = (node) => {
  node.status({
    fill: 'red',
    shape: 'ring',
    text: 'error'
  })
}

module.exports.log = async (node) => {
  let context = node.context()
  let stepCount = await (context.global.get('stepCount') || 0) + 1
  let document = await context.global.get('document') || ''
  await context.global.set('document', `${document}\n${stepCount}. Node: ${node.name} - ${node.log}`)
  await context.global.set('stepCount', stepCount)
}

module.exports.document = async (node) => {
  let context = node.context()
  let name = node.name
  let document = await context.global.get('document') || ''
  await context.global.set('document', `${document}\n********************\n${name}\n********************`)
}
