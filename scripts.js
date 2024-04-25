
// Import functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";


// web app's Firebase configuration
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

//update circle values to show the latest data
function updateCircleValues(data) {
    document.querySelector('.circle.temperature').innerText = data.Temperature;
    document.querySelector('.circle.water-level').innerText = data.WaterLevel;
    document.querySelector('.circle.light').innerText = data.PhotoResistor;
    document.querySelector('.circle.flow').innerText = data.FlowControl;
    document.querySelector('.circle.turbidity').innerText = data.Turbidity;
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
                        y: data.Temperature
                    });
                    phData.push({
                        x: new Date(timestamp),
                        y: data.Ph
                    });
                    waterLevelData.push({
                        x: new Date(timestamp),
                        y: data.WaterLevel
                    });
                    photoResistorData.push({
                        x: new Date(timestamp),
                        y: data.PhotoResistor
                    });
                    flowControlData.push({
                        x: new Date(timestamp),
                        y: data.FlowControl
                    });
                    turbidityData.push({
                        x: new Date(timestamp),
                        y: data.Turbidity
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
            //update circle values to show the latest data
            updateCircleValues(snapshotData[latestKey]);
        }
    });
}


// Function to plot temperature data on graph
function plotTemperatureData(data) {
    const layout = {
        title: 'Temperature',
        xaxis: {
            title: 'Time',
            type: 'date'
        },
        yaxis: {
            title: 'Temperature'
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
        title: 'Water Level',
        xaxis: {
            title: 'Time',
            type: 'date'
        },
        yaxis: {
            title: 'Water Level'
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
        title: 'Photo Resistor',
        xaxis: {
            title: 'Time',
            type: 'date'
        },
        yaxis: {
            title: 'Photo Resistor Value'
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
        title: 'Flow Control',
        xaxis: {
            title: 'Time',
            type: 'date'
        },
        yaxis: {
            title: 'Flow Control Value'
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
        title: 'Turbidity',
        xaxis: {
            title: 'Time',
            type: 'date'
        },
        yaxis: {
            title: 'Turbidity Value'
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