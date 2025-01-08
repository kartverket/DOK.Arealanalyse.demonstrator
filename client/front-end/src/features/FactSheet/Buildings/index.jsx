import React from "react";
import { Pie } from "react-chartjs-2";
import styles from "./Buildings.module.scss";
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

<<<<<<< HEAD
const Buildings = ({ factList }) => {
=======
const Buildings = ({ factList }) => {  
>>>>>>> origin/Factsheet
  if (!factList?.data) {
    return <p>Laster data...</p>;
  }
  const colorMap = {
<<<<<<< HEAD
    "Bolig": "#FFFF33", // kmd
    "Fritidsbolig - hytte": "#FFCC66", //kmd
    "Industri og lagerbygning": "#CC66FF", //kmd
    "Kontor- og forretningsbygning": "#CCCCFF", //kmd
    "Samferdsels- og kommunikasjonsbygning": "#CC9966", //kmd
    "Hotell og restaurantbygning": "#CC99FF", //kmd
    "Skole-, kultur-, idrett-, forskningsbygning": "#CC6600", //kmd
    "Helse- og omsorgsbygning" : "#FF9999", //kmd
    "Fengsel, beredskapsbygning, mv.": "#333333" //finner ingen tegneregel på denne    
  };
  const piechart = {
    
    labels: factList.data.map((item) => item.category),
    datasets: [
      {
        label: "Antall ",
        data: factList.data.map((item) => item.count),        
        backgroundColor: factList.data.areaTypes.map(
          (item) => colorMap[item.areaType] || "#E7E9ED"
=======
    "Bolig": "#C48723", // kmd
    "Fritidsbolig - hytte": "#DCAA27", //kmd
    "Industri og lagerbygning": "#74A3D4", //kmd
    "Kontor- og forretningsbygning": "#74A3D4", //kmd
    "Samferdsels- og kommunikasjonsbygning": "#74A3D4", //kmd
    "Hotell og restaurantbygning": "#74A3D4", //kmd
    "Skole-, kultur-, idrett-, forskningsbygning": "#74A3D4", //kmd
    "Helse- og omsorgsbygning" : "#74A3D4", //kmd
    "Fengsel, beredskapsbygning, mv.": "#74A3D4" //finner ingen tegneregel på denne    
  };
  
  const piechart = {    
    labels: factList.data.map((item) => item.category),    
    datasets: [
      {
        label: "Antall ",
        data: factList.data.map((item) => item.count),           
        backgroundColor: factList.data.map(
          (item) => colorMap[item.category] || "#E7E9ED"
>>>>>>> origin/Factsheet
        ),
        hoverOffset: 4,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };  
  return (
    <div className={styles.buildings}>
        <div className={styles.area}>
<<<<<<< HEAD
        <h4>Fordeling av boligtyper</h4>
=======
        <h2>Fordeling av boligtyper</h2>
>>>>>>> origin/Factsheet
        <TableContainer>
            <Table sx={{ minWidth: 350 }} size="small" aria-label="oversikt boligtyper">
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Boligtype</strong></TableCell>
                        <TableCell align="right"><strong>Antall</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
<<<<<<< HEAD
                    {factList.data.slice().sort((a, b) => b.area - a.area).map((item, index) => (
=======
                    {factList.data.filter(item => item.count > 0).slice().sort((a, b) => b.area - a.area).map((item, index) => (
>>>>>>> origin/Factsheet
                        <TableRow key={index}>
                            <TableCell component="th" scope="row">
                                {item.category}
                            </TableCell>
                            <TableCell align="right">{item.count}</TableCell>
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
        {factList.data.filter(item => item.count > 0).slice().sort((a, b) => b.count - a.count).map((item, index) => (
          <li className={styles.colors} key={index}>
            <span
              style={{               
                backgroundColor: piechart.datasets[0].backgroundColor[index],                
              }}
            ></span>
            <div className={styles.label}>{item.category}:</div> {item.count} stk
          </li>
        ))}
      </ul>
      </div> 
    </div>
  );
};

export default Buildings;