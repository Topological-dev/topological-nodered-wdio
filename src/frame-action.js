const common = require('./wdio-common')

module.exports = function(RED) {
  function frameAction(config) {
    RED.nodes.createNode(this, config)
    const node = this
    common.clearStatus(node)

    node.on('input', async (msg) => {
      try {
        let browser = await common.getBrowser(node.context())

        let frame = config.frame || msg.value

        if (config.action === 'frame') {
          let checkNumber = Number(frame)
          if (!Number.isNaN(checkNumber)) {
            node.log = `Switch to frame/iFrame, identified using index: "${frame}".`
            await browser.switchToFrame(parseInt(frame))
          } else {
            node.log = `Switch to frame/iFrame, identified using selector: "${frame}".`
            //Need to fix this to find element
            await browser.switchToFrame(frame)
          }
        } else if (config.action === 'parentFrame') {
          await browser.switchToParentFrame()
        }
        await common.log(node)
        common.successStatus(node)
        node.send(msg)
      } catch (e) {
        common.handleError(e, node, msg)
      }
    })
  }
  RED.nodes.registerType('frame-action', frameAction)
}
