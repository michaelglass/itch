
import listensToClickOutside from 'react-onclickoutside'
import React, {PropTypes, Component} from 'react'
import {connect} from './connect'
import classNames from 'classnames'

import * as actions from '../actions'

export class BrowserControls extends Component {
  constructor () {
    super()
    this.state = {
      editingURL: false
    }

    this.startEditingURL = ::this.startEditingURL
    this.addressKeyUp = ::this.addressKeyUp
    this.addressBlur = ::this.addressBlur
    this.onAddressField = ::this.onAddressField
    this.popOutBrowser = ::this.popOutBrowser
  }

  render () {
    const {editingURL} = this.state
    const {t, browserState} = this.props
    const {canGoBack, canGoForward, loading, url = ''} = browserState
    const {goBack, goForward, stop, reload, frozen} = this.props

    const addressClasses = classNames('browser-address', {frozen, visible: (url && url.length)})

    return <div className='browser-controls'>
      <span className={classNames('icon icon-arrow-left', {disabled: !canGoBack})} onClick={goBack}/>
      <span className={classNames('icon icon-arrow-right', {disabled: !canGoForward})} onClick={goForward}/>
      {
        loading
        ? <span className='icon icon-cross loading' onClick={stop}/>
        : <span className='icon icon-repeat' onClick={reload}/>
      }
      {editingURL
        ? <input type='text' disabled={frozen} ref={this.onAddressField} className='browser-address editing visible' defaultValue={url} onKeyUp={this.addressKeyUp} onBlur={this.addressBlur}/>
        : <span className={addressClasses} onClick={() => (url && url.length) && this.startEditingURL()}>{url || ''}</span>
      }
      <span className='hint--right' data-hint={t('browser.popout')}>
        <span className={classNames('icon icon-redo')} onClick={this.popOutBrowser}/>
      </span>
    </div>
  }

  popOutBrowser () {
    this.props.openUrl(this.props.browserState.url)
  }

  startEditingURL () {
    if (this.props.frozen) return
    this.setState({editingURL: true})
  }

  onAddressField (addressField) {
    if (!addressField) return
    addressField.focus()
    addressField.select()
  }

  addressKeyUp (e) {
    if (e.key === 'Enter') {
      const url = e.target.value
      this.setState({editingURL: false})
      this.props.loadURL(url)
    }
    if (e.key === 'Escape') {
      this.setState({editingURL: false})
    }
  }

  addressBlur () {
    this.setState({editingURL: false})
  }

  handleClickOutside () {
    this.setState({editingURL: false})
  }
}

BrowserControls.propTypes = {
  browserState: PropTypes.shape({
    url: PropTypes.string,
    loading: PropTypes.boolean,
    canGoBack: PropTypes.boolean,
    canGoForward: PropTypes.boolean
  }),

  goBack: PropTypes.func.isRequired,
  goForward: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
  reload: PropTypes.func.isRequired,
  loadURL: PropTypes.func.isRequired,

  tabPath: PropTypes.string,
  tabData: PropTypes.object
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = (dispatch) => ({
  openUrl: (url) => dispatch(actions.openUrl(url))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(listensToClickOutside(BrowserControls))
