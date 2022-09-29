const common = require('./wdio-common')

module.exports = function(RED) {
  function windowAction(config) {
    RED.nodes.createNode(this, config)
    const node = this
    common.clearStatus(node)

    node.on('input', async (msg) => {
      try {
        let browser = await common.getBrowser(node.context())

        let value = config.value || msg.value
        let index = config.index || msg.index

        if (config.action === 'byName') {
          node.log = `Switch to the browser window with window title: "${value}".`
          await browser.switchWindow(value)
        } else if (config.action === 'byIndex') {
          node.log = `Switch to the browser window with window index: "${index}".`
          let handles = await browser.getWindowHandles()
          await browser.switchWindow(handles[index])
        } else if (config.action === 'getHandle') {
          node.log = `Get all the browser windows.`
          msg.payload = await browser.getWindowHandles()
        } else if (config.action === 'close') {
          node.log = `Close the active browser window.`
          await browser.closeWindow()
        } else if (config.action === 'open') {
          node.log = `Open a new window with url: "${value}".`
          await browser.createWindow(value)
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
  RED.nodes.registerType('window-action', windowAction)
}
