import React, { Component } from 'react'
import './Chat.css'
import ChatInput from './ChatInput'
import ChatMessages from './ChatMessages'
import Dropzone from 'react-dropzone'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

const createMessage = gql`
  mutation createMessage($text: String!, $conversationId: ID!) {
    createMessage(text: $text, conversationId: $conversationId) {
      id
      text
    }
  }
`

const allMessages = gql`
  query allMessages($conversationId: ID!){
    allMessages(
      filter: {
        conversation: {
          id: $conversationId
        }
      }
    ) {
      id
      text
    }
  }
`

class Chat extends Component {

  state = {
    message: 'hi',
  }

  render() {
    if (this.props.allMessagesQuery.loading) { 
      return <div>loading</div> 
    }

    const messages = this.allMessagesQuery.allMessages

    return (
      <Dropzone
        className='dropzone relative'
        onDrop={this._onFileDrop}
        accept='image/*'
        multiple={false}
        disableClick={true}
      >
        <div className='message-body chat-container'>
          <ChatMessages
            messages={messages}
            userSpeechBubbleColor={this.props.mainColor}
            profileImageURL={this.props.profileImageURL}
          />
          {this.state.isUploadingImage && <div className='upload-image-indicator'>Uploading image ...</div>}
          <ChatInput
            message={this.state.message}
            onTextInput={message => this.setState({message})}
            onResetText={() => this.setState({message: 'hi'})}
            onSend={this._onSend}
            onDrop={this._onFileDrop}
          />
        </div>
      </Dropzone>
    )
  }

  _onSend = () => {
    this.props.createMessageMutation({
      variables: {
        text: 'Hello',
        conversationId: this.props.conversationId,
      }
    }).then(
      console.log('hello')
    )
  }

  _onFileDrop = (acceptedFiles, rejectedFiles) => {

  }

}

export default compose(
  graphql(allMessages, { name: 'allMessagesQuery' }),
  graphql(createMessage, { name: 'createMessageMutation' })
)(Chat)
