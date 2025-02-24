// import { LineChart } from "@mui/x-charts";
// import React from "react";
// import { arrayUntil } from "../lib/utils";
// import { useTelemetryStore } from "../store";

// interface ChartsProps {
//   isVelocityGraphicsActive: boolean;
//   isCurrentGraphicsActive: boolean;
//   isElevationGraphicsActive: boolean;
//   isVoltageGraphicsActive: boolean;
// }

// const Charts = ({
//   isVelocityGraphicsActive,
//   isCurrentGraphicsActive,
//   isElevationGraphicsActive,
//   isVoltageGraphicsActive,
// }: ChartsProps) => {
//   const { elevation, velocity, current, voltage } = useTelemetryStore();

//   return (
//     <div>
//       {isElevationGraphicsActive && (
//         <LineChart
//           xAxis={[{ data: arrayUntil(10) }]}
//           series={[
//             {
//               data: elevation,
//               area: true,
//               label: "Elevation",
//             },
//           ]}
//           width={700}
//           height={300}
//         />
//       )}
//       {isVelocityGraphicsActive && (
//         <LineChart
//           xAxis={[{ data: arrayUntil(10) }]}
//           series={[
//             {
//               data: velocity,
//               area: true,
//               label: "Velocity",
//             },
//           ]}
//           width={700}
//           height={300}
//         />
//       )}
//       {/* Voltage */}
//       {isVoltageGraphicsActive && (
//         <LineChart
//           xAxis={[{ data: arrayUntil(10) }]}
//           yAxis={[
//             {
//               colorMap: {
//                 type: "piecewise",
//                 thresholds: [200, 300],
//                 colors: ["#22BB22", "#ffd700", "#EC1F27"],
//               },
//             },
//           ]}
//           series={[
//             {
//               curve: "step",
//               data: voltage,
//               area: true,
//               label: "Voltage",
//               color: "grey",
//             },
//           ]}
//           width={700}
//           height={300}
//         />
//       )}
//       {/* Current */}
//       {isCurrentGraphicsActive && (
//         <LineChart
//           xAxis={[{ data: arrayUntil(10) }]}
//           yAxis={[
//             {
//               colorMap: {
//                 type: "piecewise",
//                 thresholds: [50, 80],
//                 colors: ["#22BB22", "#ffd700", "#EC1F27"],
//               },
//             },
//           ]}
//           series={[
//             {
//               curve: "step",
//               data: current,
//               label: "Current",
//               color: "#cacaca",
//             },
//           ]}
//           width={700}
//           height={300}
//           sx={{
//             "& .MuiLineElement-root": {
//               strokeWidth: 8,
//             },
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default Charts;
