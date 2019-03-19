// Licensed to the Software Freedom Conservancy (SFC) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The SFC licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import React from 'react'
import PropTypes from 'prop-types'
import Modal from '../../Modal'
import DialogContainer from '../Dialog'
import FlatButton from '../../FlatButton'
import Checkbox from '../../Checkbox'
import { availableLanguages } from 'code-export'
import './style.css'

export default class ExportDialog extends React.Component {
  static propTypes = {
    isExporting: PropTypes.bool.isRequired,
    cancelSelection: PropTypes.func.isRequired,
    completeSelection: PropTypes.func.isRequired,
  }
  render() {
    return (
      <Modal
        className="stripped language-selector"
        isOpen={this.props.isExporting}
        onRequestClose={this.props.cancelSelection}
      >
        <ExportContent {...this.props} />
      </Modal>
    )
  }
}

class ExportContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { selectedLanguages: [] }
  }
  static propTypes = {
    cancelSelection: PropTypes.func.isRequired,
    completeSelection: PropTypes.func.isRequired,
  }
  selectLanguage(isSelected, language) {
    if (isSelected) {
      if (!this.state.selectedLanguages.includes(language)) {
        this.setState({
          selectedLanguages: [...this.state.selectedLanguages, language],
        })
      }
    } else {
      this.setState({
        selectedLanguages: this.state.selectedLanguages.filter(
          _language => _language !== language
        ),
      })
    }
  }
  render() {
    return (
      <DialogContainer
        title="Select languages"
        onRequestClose={this.props.cancel}
        renderFooter={() => (
          <span className="right">
            <FlatButton onClick={this.props.cancelSelection}>cancel</FlatButton>
            <FlatButton
              disabled={!this.state.selectedLanguages.length}
              type="submit"
              onClick={() => {
                this.props.completeSelection(this.state.selectedLanguages)
              }}
              style={{
                marginRight: '0',
              }}
            >
              export
            </FlatButton>
          </span>
        )}
      >
        <ExportList
          selectedLanguages={this.state.selectedLanguages}
          selectLanguage={this.selectLanguage.bind(this)}
        />
      </DialogContainer>
    )
  }
}

class ExportList extends React.Component {
  static propTypes = {
    selectedLanguages: PropTypes.array.isRequired,
    selectLanguage: PropTypes.func.isRequired,
  }
  handleChange(language, e) {
    this.props.selectLanguage(e.target.checked, language)
  }
  render() {
    return (
      <ul className="languages">
        {availableLanguages.map(language => (
          <li key={language.name}>
            <Checkbox
              label={language.displayName}
              checked={this.props.selectedLanguages.includes(language.name)}
              form={true}
              onChange={this.handleChange.bind(this, language.name)}
            />
          </li>
        ))}
      </ul>
    )
  }
}
