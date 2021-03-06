
import React, {PropTypes, Component} from 'react'
import classNames from 'classnames'
import {connect} from './connect'
import {createStructuredSelector} from 'reselect'

import {debounce} from 'underline'

import * as actions from '../actions'

class GameGridFilters extends Component {
  constructor () {
    super()
    this.onQueryChanged = ::this.onQueryChanged::debounce(100)
  }

  render () {
    const {t, filterQuery, onlyCompatible, showBinaryFilters = true} = this.props

    return <section className='filters'>
      <section className='search'>
        <input className='filter-input-field' ref='search' type='search' defaultValue={filterQuery} placeholder={t('grid.criterion.filter')} onKeyPress={this.onQueryChanged} onKeyUp={this.onQueryChanged} onChange={this.onQueryChanged}/>
        <span className={classNames('icon', 'icon-filter', {active: filterQuery})}/>
      </section>
      {showBinaryFilters
        ? <section className='checkboxes'>
          <label>
            <input type='checkbox' checked={onlyCompatible} onChange={(e) => this.onCheckboxChanged('onlyCompatible', e.target.checked)}/>
            {t('grid.criterion.only_compatible')}
          </label>
        </section>
        : ''}
      {this.props.children}
    </section>
  }

  onQueryChanged (e) {
    const {search} = this.refs
    if (!search) return

    this.props.filterChanged(search.value)
  }

  onCheckboxChanged (field, value) {
    this.props.binaryFilterChanged(field, value)
  }
}

GameGridFilters.propTypes = {
  tab: PropTypes.string.isRequired,
  showBinaryFilters: PropTypes.bool,

  t: PropTypes.func.isRequired
}

const mapStateToProps = (state, props) => {
  const {tab} = props

  return createStructuredSelector({
    filterQuery: (state) => state.session.navigation.filters[tab],
    onlyCompatible: (state) => state.session.navigation.binaryFilters.onlyCompatible
  })
}

const mapDispatchToProps = (state, props) => {
  const {tab} = props

  return (dispatch) => ({
    filterChanged: (query) => dispatch(actions.filterChanged({tab, query})),
    binaryFilterChanged: (field, value) => dispatch(actions.binaryFilterChanged({field, value}))
  })
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameGridFilters)
