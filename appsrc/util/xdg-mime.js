
import os from './os'
import spawn from './spawn'
import mklog from './log'
const log = mklog('xdg-mime')

let self = {

  mime_type: 'x-scheme-handler/itchio',

  async query (opts) {
    let logger = opts.logger
    log(opts, 'querying default handler for itchio:// protocol')
    return await spawn({
      command: 'xdg-mime',
      args: ['query', 'default', self.mime_type],
      onToken: (tok) => log(opts, 'query: ' + tok),
      logger
    })
  },

  async set_default (opts) {
    let logger = opts.logger
    log(opts, 'registering self as default handler for itchio:// protocol')
    return await spawn({
      command: 'xdg-mime',
      args: ['default', 'itch.desktop', self.mime_type],
      onToken: (tok) => log(opts, 'set_default: ' + tok),
      logger
    })
  },

  // lets us handle the itchio:// URL scheme on linux / freedesktop
  async register_if_needed (opts) {
    if (os.platform() !== 'linux') {
      log(opts, 'non-linux platform, skipping xdg-mime')
      return
    }

    try {
      await self.set_default(opts)
      await self.query(opts)
    } catch (e) {
      log(opts, `Couldn't register xdg mime-type handler: ${e.stack || e}`)
    }
  }

}

export default self
