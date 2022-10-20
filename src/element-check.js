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

        let element = await common.getElement(
          browser,
          locateUsing,
          locateValue
        )

        if (config.check === 'clickable') {
          node.log = `Check the webelement is clickable, identified using ${locateUsing}: "${locateValue}".`
          msg.payload = await element.isClickable()
        } else if (config.check === 'displayed') {
          node.log = `Check the webelement is displayed, identified using ${locateUsing}: "${locateValue}".`
          msg.payload =  await element.isDisplayed()
        } else if (config.check === 'displayedInView') {
          node.log = `Check the webelement is displayed in view port, identified using ${locateUsing}: "${locateValue}".`
          msg.payload = await element.isDisplayedInViewport()
        } else if (config.check === 'enabled') {
          node.log = `Check the webelement is enabled, identified using ${locateUsing}: "${locateValue}".`
          msg.payload =  await element.isEnabled()
        } else if (config.check === 'existing') {
          node.log = `Check the webelement is existing, identified using ${locateUsing}: "${locateValue}".`
          msg.payload = await element.isExisting()
        } else if (config.check === 'focused') {
          node.log = `Check the webelement is focused, identified using ${locateUsing}: "${locateValue}".`
          msg.payload =  await element.isFocused()
        } else if (config.check === 'selected') {
          node.log = `Check the webelement is selected, identified using ${locateUsing}: "${locateValue}".`
          msg.payload = await element.isSelected()
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
