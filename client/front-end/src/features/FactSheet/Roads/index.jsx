import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./Roads.module.scss";

// Registrer Chart.js komponenter
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RoadsInfo = ({ factList }) => {
    if (!factList) {
        return <p>Ingen veier registrert.</p>;
    }

    const chartData = {
        labels: factList.data.slice().sort((a, b) => b.area - a.area).map((item) => item.roadType),
        datasets: [
          {
            label: "Lengde (meter)",
            data: factList.data.map((item) => item.length),
            backgroundColor: "rgba(75, 192, 192, 0.6)", // Farge på stolpene
            borderColor: "rgba(75, 192, 192, 1)", // Kantfarge på stolpene
            borderWidth: 1,
          },
        ],
      };
    
      const options = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
          title: {
            display: true,
            text: "Veitype",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Lengde (m)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Veitype",
            },
          },
        },
      };     
    return (
        <div className={styles.roads}>
            <div className={styles.lists}>
            <h4>Fordeling av veityper</h4>
        <TableContainer>
            <Table sx={{ minWidth: 350 }} size="small" aria-label="oversikt boligtyper">
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Veitype</strong></TableCell>
                        <TableCell align="right"><strong>Lengde</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {factList.data.slice().sort((a, b) => b.area - a.area).map((item, index) => (
                        <TableRow key={index}>
                            <TableCell component="th" scope="row">
                                {item.roadType}
                            </TableCell>
                            <TableCell align="right">{item.length}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
            </div>
            <div className={styles.chart}>
                <Bar data={chartData} options={options} />
            </div>
                  

        </div>
    );
};

export default RoadsInfo;