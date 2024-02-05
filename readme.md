# Smart Light System for Home

## Introduction

This project is a smart light system for home. It is a simple project that can be used to control the lights in your home. The system is designed to be controlled by dashboard and to be simple and easy to use.

## Features

- Control the lights in your home from the dashboard
- Set the minimum and maximum brightness of the lights
- Turn all the lights off

## Hardware

The sensors and actuators used in this project are simulated using Node.js. The sensors and actuators are the following:

- Light sensor *(simulated)*
- Motion sensor *(simulated)*
- Light Bulb *(simulated)*

## Software

- Node.js
- Express
- Node-RED
- Docker
- Mosquitto
- MongoDB
- Grafana
- InfluxDB
- PostgreSQL

## Architecture

![Architecture diagram](./docs/arch.jpg)

The architecture of the system is the following:

### Sensors and actuators

The sensors and actuators are simulated using Node.js.
The measurement unit of the light sensor is **lux** and the measurement unit of the motion sensor is a **boolean** value.

- **Light Sensor**: The light sensor is used to measure the brightness of the room. It generates a random number between 0 and 100 every 5 seconds. It receives data from simulated actuators to change its value.
- **Motion Sensor**: The motion sensor is used to detect motion in the room. It generates a random number between 0 and 1 every 5 seconds.
- **Light Bulb**: The light bulb is used to control the brightness of the room. It receives commands from the central control system. It has 5 methods:
  - `on`: Turns on the light
  - `off`: Turns off the light
  - `increase`: Increases the brightness of the light
  - `decrease`: Decreases the brightness of the light
  - `updateConsumption`: Updates the current consumption of the light and publishes the value to the MQTT broker.
    - The current consumption is calculated using the following formula: `currentConsumption = currentLux * consumptionPerLux`

### Server (backend)

The server is implemented using Node.js and Express, it is used to get and update the user preferences and to create a new dashboard on grafana for every sensor and actuator added to the system.

The user preferences are stored in a MongoDB database.

**User preferences sent to the backend are valitated using [zod](https://zod.dev/).**

### Grafana

Grafana is used to create the dashboards for the sensors and actuators. The dashboards are created using the Grafana API.

### PostgreSQL

PostgreSQL is used to store the data of grafana.

### Influxdb

Influxdb is used to store the data of the sensors and actuators.

### Node-RED

Node-RED is used to create the flows of the system. The flows are used to listen for sensor and actuators data and to store it in the Influxdb database.

It is also used to create the dashboard for the user to control the lights and to monitor the sensors and actuators.

### Mosquitto

Mosquitto is used to create the MQTT broker for the system. The sensors and actuators use MQTT to communicate with the server and with Node-RED.

### Central control system

The central control system is implemented using Node.js. It is used to register the sensors and actuators in the system and to create the dashboards for them in Grafana. It is also used to get and update the user preferences.

It is responsible for evaluating the sensors data by using the user preferences, to send the commands to the actuators and turning off all the lights when the user disables them.

There is a evaluation rule for every type of sensor. The current evaluation rules are the following:

- **Light rule**:
  - If lights are disabled, do not perform any action.
  - If the lights are off, do not perform any action.
  - If no motion is detected in the room, do not perform any action.
  - Otherwise, if the light sensor value is less than the minimum brightness, increase the brightness. If the light sensor value is greater than the maximum brightness, decrease the brightness.

- **Motion rule**:
  - If lights are disabled, do not perform any action.
  - If there is motion in the room and lights are off, turn on the lights.
  - If there is motion in the room and lights are on, do not perform any action.
  - Otherwise, turn off the lights.

After the central control system generates the action to perform, it sends the action to the actuator using MQTT.
  
## Requirements

- [Docker](https://www.docker.com/get-started/)

## Configuration

- **Influxdb**:
  - Username: `admin`
  - Password: `adminadmin`
  - Url: <http://localhost:8086>
- **Grafana**:
  - Username: `admin`
  - Password: `admin`
  - Url: <http://localhost:3000>
- **PostgreSQL**:
  - Username: `admin`
  - Password: `adminadmin`
- **NodeRED**:
  - Url: <http://localhost:1880>
- **Mosquitto**:
  - Local port: `1882` and `9002`

## Installation

- Clone the repository `git clone <https://github.com/BryantSarabia/SE4IOT.git>`
- Run `docker-compose up`
- Open the web browser and go to <http://localhost:1880/ui>

## Usage

- Open the [nodered dashboard](http://localhost:1880/ui)
- Use the dashboard to set the minimum and maximum brightness of the lights
- Use the dashboard to monitor the light sensor and motion sensor values
- Use the dashboard to monitor the current consumption of the lights
- Use the dashboardto monitor the total energy consumption of the lights in the last 30 days

## Authors

- Bryant Michelle Sarabia Ortega
