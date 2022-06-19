# node-red-topological-wdio

Node Red nodes for [Webdriver IO](https://webdriver.io) test framework. The nodes are similar to nodes (https://flows.nodered.org/node/node-red-contrib-wdio). We created a new project as we are planning to customize needed for our organization.

## Usage

The "new session" node creates a Selenium Webdriver session with the configured provider, or local Webdriver server. The session is stored at the Flow level, so can be reused by downstream webdriverIO nodes in the same flow.

If any nodes encounter an error, for example unable to locate a given element on a page, an error will be thrown. This can be caught by a global catch node and actioned appropriately.

After a flow completes, close the Selenium session using the "delete session" node. Alternatively, when Node Red exits, any open Selenium sessions will be closed.

## Contributing

Pull requests are welcomed for bug fixes, new nodes, and new features. Please push your changes in a branch and initiate a Pull Request against master.
