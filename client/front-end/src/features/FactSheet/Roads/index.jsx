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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const colorMap = {
  "Kommunal veg": "rgba(244, 164, 96, 1)",// kartverket
  "Gang og sykkelveg": "rgba(218, 105, 74, 1)",// kartverket
  "Privat veg": "rgba(89, 187, 171, 1)",// kartverket
  "Fylkesveg": "#FF5050", // kartverket
  "Rundkjøring" : "rgba(153, 102, 255, 0.7)", // ?
  "Kanalisert veg": "rgba(255, 159, 64, 0.8)", // ?
  "Fortau": "rgba(89, 187, 171, 0.8)",// kartverket
  "Gangveg": "rgba(218, 105, 74, 1)",// kartverket x 2?
  "Gangfelt": "rgba(255, 159, 64, 1)", //?
};

const RoadsInfo = ({ factList }) => {
    if (!factList.data || factList.data.length === 0) {
        return <p>Ingen veier registrert.</p>;
    }

    const chartData = {
        labels: factList.data.slice().sort((a, b) => b.area - a.area).map((item) => item.roadType),
        datasets: [
          {
            label: "Lengde (meter)",
            data: factList.data.map((item) => item.length),
            backgroundColor: factList.data.map(
              (item) => colorMap[item.roadType] || "rgba(201, 203, 207, 0.6)" 
            ),
            borderColor: factList.data.map(
              (item) => colorMap[item.roadType]?.replace("0.6", "1") || "rgba(201, 203, 207, 1)"
            ), 
            borderWidth: 1,
          },
        ],
      };
    
      const options = {
        responsive: true,
        plugins: {
          legend: {
            display: false,
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
            <h2>Fordeling av veityper</h2>
        <TableContainer>
            <Table sx={{ minWidth: 350 }} size="small" aria-label="oversikt boligtyper">
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Veitype</strong></TableCell>
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