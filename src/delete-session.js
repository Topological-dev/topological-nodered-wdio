const common = require('./wdio-common')

module.exports = function(RED) {
  function deleteSession(config) {
    RED.nodes.createNode(this, config)
    const node = this
    common.clearStatus(node)

    node.on('input', async (msg) => {
      try {
        let browser = await common.deleteSession(node.context())
        if (browser && browser.sessionId) {
          node.log = 'Close the browser.'
          msg.payload = browser.sessionId
        } else {
          node.log = 'No active browser detected to Close.'
          msg.payload = 'no open session'
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
  RED.nodes.registerType('delete-session', deleteSession)
}
