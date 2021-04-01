module.exports = {
    name: "ping",
    category: "Information",
    description: "Returns latency and API ping",
    run: async (client, message, args) => {
       message.channel.send(`Pong - ${client.ws.ping}ms`)
    }
}