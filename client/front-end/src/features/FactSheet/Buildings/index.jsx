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

const Buildings = ({ factList }) => {
  if (!factList?.data) {
    return <p>Laster data...</p>;
  }
  const colorMap = {
    "Bolig": "#995F20", // kmd
    "Fritidsbolig - hytte": "#D68723", //kmd
    "Industri og lagerbygning": "#995F20", //kmd
    "Kontor- og forretningsbygning": "#995F20", //kmd
    "Samferdsels- og kommunikasjonsbygning": "#995F20", //kmd
    "Hotell og restaurantbygning": "#995F20", //kmd
    "Skole-, kultur-, idrett-, forskningsbygning": "#995F20", //kmd
    "Helse- og omsorgsbygning" : "#995F20", //kmd
    "Fengsel, beredskapsbygning, mv.": "#995F20" //finner ingen tegneregel på denne    
  };
  const piechart = {
    
    labels: factList.data.map((item) => item.category),
    datasets: [
      {
        label: "Antall ",
        data: factList.data.map((item) => item.count),        
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
        display: false,
      },
    },
  };  
  return (
    <div className={styles.buildings}>
        <div className={styles.area}>
        <h4>Fordeling av boligtyper</h4>
        <TableContainer>
            <Table sx={{ minWidth: 350 }} size="small" aria-label="oversikt boligtyper">
                <TableHead>
                    <TableRow>
                        <TableCell><strong>Boligtype</strong></TableCell>
                        <TableCell align="right"><strong>Antall</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {factList.data.slice().sort((a, b) => b.area - a.area).map((item, index) => (
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