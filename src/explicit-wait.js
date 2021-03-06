const common = require('./wdio-common')

module.exports = function(RED) {
  function explicitWait(config) {
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

        let time = config.time || msg.time
        let reverse = config.reverse || msg.reverse
        let error = config.error || msg.error

        let boolReverse = reverse === 'false' ? false : true

        if (config.action === 'displayed') {
          node.log = `Waiting for the element to be displayed for ${time}, identified using ${locateUsing}: "${locateValue}".`
          await element.waitForDisplayed(time, boolReverse, error)
        } else if (config.action === 'enabled') {
          node.log = `Waiting for the element to be enabled for ${time}, identified using ${locateUsing}: "${locateValue}".`
          await element.waitForEnabled(time, boolReverse, error)
        } else if (config.action === 'exists') {
          node.log = `Waiting for the element to be exists for ${time}, identified using ${locateUsing}: "${locateValue}".`
          await element.waitForExist(time, boolReverse, error)
        } else if (config.action === 'until') {
          await element.waitUntil()
        }

        if (error) {
          common.handleError(error, node, msg)
        } else {
          await common.log(node)
          common.successStatus(node)
          node.send(msg)
        }
      } catch (e) {
        common.handleError(e, node, msg)
      }
    })
  }
  RED.nodes.registerType('explicit-wait', explicitWait)
}
