 import { FaCar, FaBox, FaWarehouse, FaHome, FaCogs } from "react-icons/fa";

export const optionsServices = [
  { label: "Vehicle", value: "vehicle", icon: <FaCar /> },
  { label: "Equipment", value: "equipment", icon: <FaCogs /> },
  { label: "Warehousing", value: "warehousing", icon: <FaWarehouse /> },
  { label: "Household", value: "household", icon: <FaHome /> },
  { label: "Package", value: "package", icon: <FaBox /> },
];



export const transportOptions = [
  { label: "Express: Door-to-door private transport.", value: "express" },
  { label: "Depot-to-Depot: Drop off at one depot and pick up at another.", value: "depot" },
  { label: "Hybrid: A mix of door and depot options.", value: "hybrid" },
];