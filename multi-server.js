const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const data = require('./db');
const { stat } = require('fs');

const app = express();
const port = 3001;

// Configurar el servidor HTTP
const server = http.createServer(app);

// Configurar el servidor WebSocket
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(cors({origin: '*'}));

app.get('/user', (req, res) => {
    console.log('Petición de usuario');
    res.json(data.user);
});

app.get('/agents', (req, res) => {
    // console.log('Petición de agentes', data);
    console.log('Petición de agentes');

    const { status } = req.query;

    let filteredAgents = data.agents;

    if (status) {
        console.log('Filtrando por estado', status);
        filteredAgents = data.agents.filter(agent => agent.status === status);
    }

    res.json(filteredAgents);
});

app.get('/customers', (req, res) => {
    // console.log('Petición de clientes', req);
    const { category, time, status } = req.query;

    let filteredCustomers = data.customers;

    if (category) {
        console.log('Filtrando por categoría', category);
        filteredCustomers = filteredCustomers.filter(customer => customer.category === category);
    }

    if (status && status !== 'inactive') {
        console.log('Filtrando por estado', status);
        filteredCustomers = filteredCustomers.filter(customer => customer.status === status);
    }

    const now = Date.now(); // Tiempo actual en milisegundos

    if (time) {
        console.log('Filtrando por última actualización', time);

        const referenceTime = time * 60 * 1000; // Convertir minutos a milisegundos

        filteredCustomers = filteredCustomers.filter(customer => {
        const elapsedMinutes = (now - customer.lastUpdate)
        // console.log('Minutos transcurridos', elapsedMinutes, referenceTime);
        return(time < 121 ? elapsedMinutes <= referenceTime : elapsedMinutes > referenceTime);
    });
}

    res.json(filteredCustomers);
});

wss.on('connection', (ws) => {
    console.log('Nuevo cliente conectado');

    ws.on('message', (message) => {
        const newData = JSON.parse(message);
        if(newData.type === 'agent') {
            console.log('Agente en espera', newData);
            const agentIndex = data.agents.findIndex(agent => agent.id === newData.id);
            if (agentIndex !== -1) {
                console.log('Agente encontrado', agentIndex);
                data.agents[agentIndex].status = newData.status;
                data.agents[agentIndex].lastUpdate = Date.now();
            }
    
            // Broadcast the updated data to all clients
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data.agents[agentIndex]));
                }
            });
        }else if(newData.type === 'customer') {
            console.log('Cliente en espera', newData);
            const customerIndex = data.customers.findIndex(customer => customer.id === newData.id);
            if (customerIndex !== -1) {
                console.log('Cliente encontrado', customerIndex);
                data.customers[customerIndex].status = newData.status;
                data.customers[customerIndex].lastUpdate = Date.now();
            }
    
            // Broadcast the updated data to all clients
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data.customers[customerIndex]));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(port, () => {
    console.log(`Servidor HTTP en puerto ${port}`);
});
