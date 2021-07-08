<template>
  <div id="app">
    <p>ID: {{ id }}</p>
    <form>
      <table>
        <tr>
          <td>Room</td>
          <td>:</td>
          <td><input type="text" v-model="room" /></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td><input type="submit" @click.prevent="joinRoom" /></td>
        </tr>
        <br />
        <tr>
          <td>Name</td>
          <td>:</td>
          <td><input type="text" v-model="name" /></td>
        </tr>
        <tr>
          <td>Message</td>
          <td>:</td>
          <td><input type="text" v-model="message" /></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td><input type="submit" @click.prevent="postMessage" /></td>
        </tr>
      </table>
    </form>
    {{isTyping}}
    <p v-if="isTyping">Ohter user is typing</p>
    <ul>
      <li v-for="(msg, i) in messages" :key="i">
        {{ msg.from }}: {{ msg.message }}
      </li>
    </ul>
  </div>
</template>

<script>
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");

export default {
  name: "App",
  data() {
    return {
      id: "",
      name: "",
      message: "",
      room: "",
      isTyping: false,
      messages: [],
    };
  },
  watch: {
      message (newVal) {
          if (newVal.length > 0 && this.isTyping == false) {
              console.log('masuk')
              socket.emit('changeIsTyping', true, this.room)
          } else if (newVal.length == 0) {
              socket.emit('changeIsTyping', false, this.room)
          }
      }
  },
  methods: {
    postMessage () {
      this.messages.push({
        from: this.name,
        message: this.message,
      });
      socket.emit("chat", {
        from: this.name,
        message: this.message,
      }, this.room);
    },
    joinRoom () {
        // emit untuk join room
        socket.emit('joinRoom', this.room)
    }
  },
  mounted() {
      // listen di client dari server
    socket.on("connect", () => {
      console.log("id user", socket.id);
      this.id = socket.id;
    });
    socket.on("clientChat", (payload) => {
        // console.log(payload);
      this.messages.push(payload);
    });
    socket.on('sendIsTyping', (payload) => {
        this.isTyping = payload
    })
  },
};
</script>
