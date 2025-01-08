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
  const colorMap = {
    "Bebygd": "rgb(252,219,214)",//tegneregel nibio
    "Skog": "rgb(158,204,115)",//tegneregel nibio
    "Åpen fastmark": "#D9D9D9", //tegneregel nibio
    "Samferdsel": "rgb(179,120,76)",//tegneregel nibio
    "Fulldyrka jord": "#FFD16E", //tegneregel nibio
    "Ferskvann": "#91E7FF", //tegneregel nibio
    "Hav": "#D2FFFF", //tegneregel nibio
    "Ikke kartlagt" : "#CCCCCC",
    "Innmarksbeite": "#FFFA56", //tegneregel nibio
    "Myr": "#73DFE1", //tegneregel nibio
    "Overflatedyrka jord": "#FFCD56", //tegneregel nibio
    "Snøisbre": "#ffffff", //tegneregel nibio  
  };

  const piechart = {
    labels: factList.data.areaTypes.map((item) => item.areaType),
    datasets: [
      {
        label: "Areal (m²)",
        data: factList.data.areaTypes.map((item) => item.area),
        backgroundColor: factList.data.areaTypes.map(
          (item) => colorMap[item.areaType] || "#E7E9ED"
        ),
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
        <h2>Fordeling av Areal på Arealtyper</h2>
        <TableContainer>
            <Table sx={{ minWidth: 350 }} size="small" aria-label="oversikt arealtyper">
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Arealtype</strong></TableCell>
                        <TableCell align="right"><strong>Areal (m²)</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {factList.data.areaTypes.filter(item => item.area > 0).slice().sort((a, b) => b.area - a.area).map((item, index) => (
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
            backgroundColor: colorMap[item.areaType] || "#E7E9ED",
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