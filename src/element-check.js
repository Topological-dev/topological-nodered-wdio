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
        let locator = await common.getLocator(
          browser,
          locateUsing,
          locateValue
        ) 

        if (config.check === 'clickable') {
          node.log = `Check the webelement is clickable, identified using ${locateUsing}: "${locateValue}".`
          msg.payload = await browser.$(locator).isClickable()
        } else if (config.check === 'displayed') {
          node.log = `Check the webelement is displayed, identified using ${locateUsing}: "${locateValue}".`
          msg.payload =  await browser.$(locator).isDisplayed()
        } else if (config.check === 'displayedInView') {
          node.log = `Check the webelement is displayed in view port, identified using ${locateUsing}: "${locateValue}".`
          msg.payload = await browser.$(locator).isDisplayedInViewport()
        } else if (config.check === 'enabled') {
          node.log = `Check the webelement is enabled, identified using ${locateUsing}: "${locateValue}".`
          msg.payload =  await browser.$(locator).isEnabled()
        } else if (config.check === 'existing') {
          node.log = `Check the webelement is existing, identified using ${locateUsing}: "${locateValue}".`
          msg.payload = await browser.$(locator).isExisting()
        } else if (config.check === 'focused') {
          node.log = `Check the webelement is focused, identified using ${locateUsing}: "${locateValue}".`
          msg.payload =  await browser.$(locator).isFocused()
        } else if (config.check === 'selected') {
          node.log = `Check the webelement is selected, identified using ${locateUsing}: "${locateValue}".`
          msg.payload = await browser.$(locator).isSelected()
        }
        await common.log(node)
        common.successStatus(node)
        node.send(msg)
      } catch (e) {
        // if(e.message == 'unable to find'){
        //   msg.payload = false
        //   node.log = `Webelement is NOT displayed, identified using ${locateUsing}: "${locateValue}".`
        //   await common.log(node)
        //   common.successStatus(node)
        //   node.send(msg)
        // }
        // else{
          await common.log(node)
          common.handleError(e, node, msg)
        }
      //}
    })
  }
  RED.nodes.registerType('element-check', elementCheck)
}
