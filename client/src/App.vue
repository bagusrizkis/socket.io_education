<template>
  <div id="app">
    <table>
        <tr>
            <td>Name</td>
            <td>:</td>
            <td><input type="text" v-model="name"></td>
        </tr>
        <tr>
            <td>Message</td>
            <td>:</td>
            <td><input type="text" v-model="message"></td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td><button @click="sendMessage">Send</button></td>
        </tr>
    </table>
    <p>{{orangTyping}}</p>
    <ul>
        <li v-for="msg, i in messages" :key='i'>
            From: {{msg.from}} | {{msg.message}}
        </li>
    </ul>
  </div>
</template>

<script>
import { io } from "socket.io-client"
const socket = io('http://localhost:3000')

export default {
  name: 'App',
  data () {
      return  {
          name: "",
          message: "",
          messages: [],
          orangTyping: ""
      }
  },
  methods: {
      sendMessage () {
        //   ngieim ke smua user
        this.messages.push({
            from: this.name,
            message: this.message
        })
        socket.emit("chat", {
            from: this.name,
            message: this.message
        })
      }
  },
  watch: {
      message (newVal) {
          if (newVal) {
              socket.emit('typing', this.name, true)
          } else {
              socket.emit('typing', this.name, false)
          }
      } 
  },
  mounted () {
      socket.on('connect', () => {
        //   console.log('disini')
      })

      // listen yang dari server
      socket.on('clientChat', (payload) => {
          this.messages.push(payload)
      })

    // listen dari server
      socket.on('typingToClient', payload => {
          this.orangTyping = payload
      })
  }
}
</script>
