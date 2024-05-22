// Import functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// Web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAiVjkZYl0f-GOSS6jFT6u60soSZGfHKw4",
    authDomain: "smart-fish-tank-f5a11.firebaseapp.com",
    databaseURL: "https://smart-fish-tank-f5a11-default-rtdb.firebaseio.com",
    projectId: "smart-fish-tank-f5a11",
    storageBucket: "smart-fish-tank-f5a11.appspot.com",
    messagingSenderId: "107077589324",
    appId: "1:107077589324:web:504d671f935df33ee357e9"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Firebase Realtime Database
const database = getDatabase();

// Reference to your JSON data in the database
const dataRef = ref(database, 'data');

// Function to get turbidity status
function getTurbidityStatus(turbidity) {
    if (turbidity < 20) {
        return "Clear";
    } else if (turbidity >= 20 && turbidity < 50) {
        return "Cloudy";
    } else {
        return "Dirty";
    }
}

// Update circle values to show the latest data
function updateCircleValues(data) {
    document.querySelector('.circle.temperature').innerText = parseFloat(data.Temperature).toFixed(2);
    document.querySelector('.circle.water-level').innerText = parseFloat(data.WaterLevel).toFixed(2);
    document.querySelector('.circle.light').innerText = parseFloat(data.PhotoResistor).toFixed(2);
    document.querySelector('.circle.flow').innerText = parseFloat(data.FlowControl).toFixed(2);
    
    // Update turbidity status
    const turbidityStatus = getTurbidityStatus(data.Turbidity);
    document.querySelector('.circle.turbidity').innerText = turbidityStatus;
}

function fetchData() {
    // Listen for changes in the database and update the UI
    onValue(dataRef, (snapshot) => {
        const snapshotData = snapshot.val();

        if (snapshotData) {
            // Initialize arrays to store data for plotting
            const temperatureData = [];
            const phData = [];
            const waterLevelData = [];
            const photoResistorData = [];
            const flowControlData = [];
            const turbidityData = [];

            // Iterate over each child data point
            for (const key in snapshotData) {
                if (snapshotData.hasOwnProperty(key)) {
                    const data = snapshotData[key];
                    const timestamp = data.Timestamp; // Get the timestamp

                    // Push data points to respective arrays
                    temperatureData.push({
                        x: new Date(timestamp),
                        y: parseFloat(data.Temperature).toFixed(2)
                    });
                    phData.push({
                        x: new Date(timestamp),
                        y: parseFloat(data.Ph).toFixed(2)
                    });
                    waterLevelData.push({
                        x: new Date(timestamp),
                        y: parseFloat(data.WaterLevel).toFixed(2)
                    });
                    photoResistorData.push({
                        x: new Date(timestamp),
                        y: parseFloat(data.PhotoResistor).toFixed(2)
                    });
                    flowControlData.push({
                        x: new Date(timestamp),
                        y: parseFloat(data.FlowControl).toFixed(2)
                    });
                    turbidityData.push({
                        x: new Date(timestamp),
                        y: parseFloat(data.Turbidity).toFixed(2)
                    });
                }
            }

            // Plot data on respective graphs
            plotTemperatureData(temperatureData);
            plotWaterLevelData(waterLevelData);
            plotPhotoResistorData(photoResistorData);
            plotFlowControlData(flowControlData);
            plotTurbidityData(turbidityData);
            plotPhData(phData);

            // Get the latest data point and update circle values
            const latestKey = Object.keys(snapshotData).pop();
            console.log(snapshotData[latestKey]);
            // Update circle values to show the latest data
            updateCircleValues(snapshotData[latestKey]);
        }
    });
}

// Function to plot temperature data on graph
function plotTemperatureData(data) {
    const layout = {
        title: 'Temperature (°C)',
        xaxis: {
            title: 'Time',
            type: 'date'
        },
        yaxis: {
            title: 'Temperature (°C)'
        }
    };

    Plotly.newPlot('temperature-chart', [{
        x: data.map(item => item.x),
        y: data.map(item => item.y),
        mode: 'lines',
        type: 'scatter'
    }], layout);
}

// Function to plot water level data on graph
function plotWaterLevelData(data) {
    const layout = {
        title: 'Water Level (cm)',
        xaxis: {
            title: 'Time',
            type: 'date'
        },
        yaxis: {
            title: 'Water Level (cm)'
        }
    };

    Plotly.newPlot('water-level-chart', [{
        x: data.map(item => item.x),
        y: data.map(item => item.y),
        mode: 'lines',
        type: 'scatter'
    }], layout);
}

// Function to plot photo resistor data on graph
function plotPhotoResistorData(data) {
    const layout = {
        title: 'Photo Resistor (lx)',
        xaxis: {
            title: 'Time',
            type: 'date'
        },
        yaxis: {
            title: 'Photo Resistor Value (lx)'
        }
    };

    Plotly.newPlot('photo-resistor-chart', [{
        x: data.map(item => item.x),
        y: data.map(item => item.y),
        mode: 'lines',
        type: 'scatter'
    }], layout);
}

// Function to plot flow control data on graph
function plotFlowControlData(data) {
    const layout = {
        title: 'Flow Control (L/min)',
        xaxis: {
            title: 'Time',
            type: 'date'
        },
        yaxis: {
            title: 'Flow Control Value (L/min)'
        }
    };

    Plotly.newPlot('flow-control-chart', [{
        x: data.map(item => item.x),
        y: data.map(item => item.y),
        mode: 'lines',
        type: 'scatter'
    }], layout);
}

// Function to plot turbidity data on graph
function plotTurbidityData(data) {
    const layout = {
        title: 'Turbidity (NTU)',
        xaxis: {
            title: 'Time',
            type: 'date'
        },
        yaxis: {
            title: 'Turbidity Value (NTU)'
        }
    };

    Plotly.newPlot('turbidity-chart', [{
        x: data.map(item => item.x),
        y: data.map(item => item.y),
        mode: 'lines',
        type: 'scatter'
    }], layout);
}

// Function to plot pH data on graph
function plotPhData(data) {
    const layout = {
        title: 'pH',
        xaxis: {
            title: 'Time',
            type: 'date'
        },
        yaxis: {
            title: 'pH'
        }
    };

    Plotly.newPlot('ph-chart', [{
        x: data.map(item => item.x),
        y: data.map(item => item.y),
        mode: 'lines',
        type: 'scatter'
    }], layout);
}

// Add an event listener to the "Feed Fish" button
document.querySelector('.feed-fish-button').addEventListener('click', function() {
    // Get a reference to the 'Servo' field in the database
    const servoRef = ref(database, 'Servo');

    // Update the value of the 'Servo' field to true
    set(servoRef, true)
        .then(() => {
            console.log("Servo turned on.");
        })
        .catch((error) => {
            console.error("Error turning on servo:", error);
        });
});

// Fetch data initially
fetchData();

// Refresh data every 5 seconds
setInterval(fetchData, 5000);
