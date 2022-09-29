const common = require('./wdio-common')

module.exports = function(RED) {
  function executeScript(config) {
    RED.nodes.createNode(this, config)
    const node = this
    common.clearStatus(node)

    node.on('input', async (msg) => {
      try {
        let locateUsing = config.locateUsing || msg.locateUsing
        let locateValue = config.locateValue || msg.locateValue

        let browser = await common.getBrowser(node.context())
        let element = await common.getElement(
          browser,
          locateUsing,
          locateValue
        )

        let script = config.script || msg.script

        if (config.action === 'sync') {
          node.log = `Execute synchronous Javascript: "${script}"${element?` By passing the webelement identified using ${locateUsing}: "${locateValue}"`:''}.`
          await browser.executeScript(script, Array.from(element))
        } else if (config.action === 'aSync') {
          node.log = `Execute the asynchronous Javascript: "${script}"${element?` By passing the webelement identified using ${locateUsing}: "${locateValue}"`:''}.`
          await browser.executeAsyncScript(script, Array.from(element))
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
  RED.nodes.registerType('execute-script', executeScript)
}
