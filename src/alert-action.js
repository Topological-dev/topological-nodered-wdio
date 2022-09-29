const common = require('./wdio-common')

const isAlertPresent = async (browser) => {
  try {
    await browser.getAlertText()
    return true
  } catch (e) {
    return false
  }
}

module.exports = function(RED) {
  function alertAction(config) {
    RED.nodes.createNode(this, config)
    const node = this
    common.clearStatus(node)

    node.on('input', async (msg) => {
      try {
        let browser = await common.getBrowser(node.context())

        let value = msg.value || config.sendText 

        if (config.action === 'dismiss') {
          node.log = 'Dismiss the alert.'
          await browser.dismissAlert()
        } else if (config.action === 'accept') {
          node.log = 'Accept the alert displayed.'
          await browser.acceptAlert()
        } else if (config.action === 'getAlertText') {
          node.log = 'Get the alert text.'
          msg.payload = await browser.getAlertText()
        } else if (config.action === 'sendAlertText') {
          if (await isAlertPresent()) {
            node.log = `Send "${value}" to alert.`
            await browser.sendAlertText(value)
          }
        } else if (config.action === 'isPresent') {
          node.log = 'Verify for an alert.'
          msg.payload = await isAlertPresent(browser)
        }
        await common.log(node)
        common.successStatus(node)
        node.send(msg)
      } catch (e) {
        await common.log(node)
        common.handleError(e, node, msg)
      }
    })
  }
  RED.nodes.registerType('alert-action', alertAction)
}
