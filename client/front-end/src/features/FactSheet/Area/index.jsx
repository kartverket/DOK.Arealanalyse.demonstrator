import React from "react";
import { Pie } from "react-chartjs-2";
import styles from "./Area.module.scss";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
  } from "chart.js";
  
  ChartJS.register(ArcElement, Tooltip, Legend);

const Area = ({ factList }) => {
  if (!factList?.data?.areaTypes) {
    return <p>Laster data...</p>;
  }

  const piechart = {
    labels: factList.data.areaTypes.map((item) => item.areaType),
    datasets: [
      {
        label: "Areal (m²)",
        data: factList.data.areaTypes.map((item) => item.area),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#E7E9ED",
          "#C9CBCF",
          "#9BD0F5",
          "#FDB45C",
          "#46BFBD",
          "#F7464A",
        ],
        hoverOffset: 4,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: false, // Skjuler legenden
      },
    },
  };
  return (
    <div className={styles.piechart}>
        <div className={styles.area}>
        <h4>Fordeling av Areal på Arealtyper</h4>
        <TableContainer>
            <Table sx={{ minWidth: 350 }} size="small" aria-label="oversikt arealtyper">
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Arealtype</strong></TableCell>
                        <TableCell align="right"><strong>Areal (m²)</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {factList.data.areaTypes.slice().sort((a, b) => b.area - a.area).map((item, index) => (
                        <TableRow key={index}>
                            <TableCell component="th" scope="row">
                                {item.areaType}
                            </TableCell>
                            <TableCell align="right">{item.area}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
           </div>     
           <div className={styles.pieContent}>
           
      <div className={styles.theChart}>
        <Pie data={piechart} options={options} />
      </div>
      <ul className={styles.labels}>
        {factList.data.areaTypes.filter(item => item.area > 0).slice().sort((a, b) => b.area - a.area).map((item, index) => (
          <li className={styles.colors} key={index}>
            <span
              style={{               
                backgroundColor: piechart.datasets[0].backgroundColor[index],                
              }}
            ></span>
            <div className={styles.label}>{item.areaType}:</div> {item.area} m²
          </li>
        ))}
      </ul>
      </div>

      
    
    </div>
  );
};

export default Area;