import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TrafficChart = () => {
  const [trafficData, setTrafficData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Fetch alerts from backend
    const fetchAlerts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/alerts/');
        setAlerts(response.data);
        
        // Generate sample traffic data for visualization
        const currentTime = new Date();
        const sampleData = [];
        
        for (let i = 23; i >= 0; i--) {
          const time = new Date(currentTime.getTime() - i * 60 * 60 * 1000);
          sampleData.push({
            time: time.toLocaleTimeString(),
            normal: Math.floor(Math.random() * 100) + 20,
            attacks: Math.floor(Math.random() * 10) + 1
          });
        }
        
        setTrafficData(sampleData);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Generate sample data even if backend is not available
        const currentTime = new Date();
        const sampleData = [];
        
        for (let i = 23; i >= 0; i--) {
          const time = new Date(currentTime.getTime() - i * 60 * 60 * 1000);
          sampleData.push({
            time: time.toLocaleTimeString(),
            normal: Math.floor(Math.random() * 100) + 20,
            attacks: Math.floor(Math.random() * 10) + 1
          });
        }
        
        setTrafficData(sampleData);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: trafficData.map(data => data.time),
    datasets: [
      {
        label: 'Normal Traffic',
        data: trafficData.map(data => data.normal),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      },
      {
        label: 'Attack Traffic',
        data: trafficData.map(data => data.attacks),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Network Traffic Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Packets/Hour'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2>Network Traffic Analysis</h2>
        <div style={{ height: '400px' }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h3>Recent Security Alerts</h3>
        {alerts.length > 0 ? (
          <div style={{ 
            maxHeight: '200px', 
            overflowY: 'auto', 
            border: '1px solid #ddd', 
            padding: '10px',
            borderRadius: '5px'
          }}>
            {alerts.map((alert, index) => (
              <div key={index} style={{ 
                padding: '10px', 
                margin: '5px 0', 
                backgroundColor: '#ffebee',
                borderLeft: '4px solid #f44336',
                borderRadius: '3px'
              }}>
                <strong>Attack Detected:</strong> Duration: {alert.duration}s, 
                Protocol: {alert.protocol_type === 0 ? 'TCP' : 'UDP'}, 
                Src Bytes: {alert.src_bytes}, Dst Bytes: {alert.dst_bytes}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666' }}>No security alerts at this time.</p>
        )}
      </div>
    </div>
  );
};

export default TrafficChart; 