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
  
  // Реєстрація всіх необхідних елементів
  ChartJS.register(
    CategoryScale, // Для використання шкали категорії (наприклад, для місяців)
    LinearScale,   // Для числових шкал (наприклад, для суми доходів/витрат)
    PointElement,  // Для точок на графіку
    LineElement,   // Для ліній на графіку
    Title,         // Для заголовку графіка
    Tooltip,       // Для тултіпів
    Legend         // Для легенди
  );