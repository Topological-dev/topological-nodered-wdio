const common = require('./wdio-common')

module.exports = function(RED) {
  function documentHelper(config) {
    RED.nodes.createNode(this, config)
    const node = this
    node.refUrl = config.refUrl
    node.line = config.line
    common.clearStatus(node)

    node.on('input', async (msg) => {
      try {
        common.document(node)
        node.send(msg)
        common.successStatus(node)
      } catch (e) {
        await common.log(node)
        common.handleError(e, node, msg)
      }
    })
  }
  RED.nodes.registerType('document-helper', documentHelper)
}
