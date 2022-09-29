const common = require('./wdio-common')

module.exports = function (RED) {
  function elementCheck(config) {
    RED.nodes.createNode(this, config)
    const node = this
    common.clearStatus(node)

    node.on('input', async (msg) => {
      try {
        let locateUsing = config.locateUsing || msg.locateUsing
        let locateValue = config.locateValue || msg.locateValue

        let browser = await common.getBrowser(node.context())

        let elementId = await common.getElementId(
          browser,
          locateUsing,
          locateValue
        )

        if (config.check === 'selected') {
          node.log = `Check the webelement is selected, identified using ${locateUsing}: "${locateValue}".`
          msg.payload = await browser.isElementSelected(elementId)
        } else if (config.check === 'enabled') {
          node.log = `Check the webelement is enabled, identified using ${locateUsing}: "${locateValue}".`
          msg.payload = await browser.isElementEnabled(elementId)
        } else if (config.check === 'displayed') {
          let element = await common.getElement(
            browser,
            locateUsing,
            locateValue
          )
          node.log = `Check the webelement is displayed, identified using ${locateUsing}: "${locateValue}".`
          msg.payload = await browser.isElementDisplayed(element.elementId)
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
  RED.nodes.registerType('element-check', elementCheck)
}
