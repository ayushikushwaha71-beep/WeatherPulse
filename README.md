# WeatherPulse — Futuristic Weather Intelligence Dashboard

A modern, high-performance weather dashboard that delivers real-time weather insights, air quality analytics, and historical trends through a clean and intuitive user interface.


## Overview

WeatherPulse is a responsive web application built using React.js and Tailwind CSS. It provides location-based weather data, including current conditions, hourly forecasts, and historical analytics. The application emphasizes performance, scalability, and a refined user experience through a futuristic dark-themed design.


## Features

### Current Weather
- Temperature (current, minimum, maximum)
- Humidity
- Precipitation
- UV Index
- Sunrise and sunset times (IST)
- Wind speed and direction

### Air Quality Metrics
- AQI (Air Quality Index)
- PM10, PM2.5
- CO, CO₂, NO₂, SO₂

### Hourly Forecast
- Temperature, humidity, precipitation
- Visibility
- Wind speed (10m)
- PM10 and PM2.5 trends

### Historical Data (up to 2 years)
- Temperature trends (mean, minimum, maximum)
- Precipitation totals
- Wind speed and dominant direction
- Air quality trends



## Design System

- Background: #1e1e2f  
- Card Style: Glassmorphism (semi-transparent background with blur)  
- Border Radius: 12–16px  
- Shadow: 0 4px 12px rgba(0,0,0,0.3)  

### Accent Colors
- Cyan: #00cfff  
- Pink: #ff7eb9  
- Orange: #ffa500  

### Typography
- Font: Inter  
- Headings: Bold, white  
- Secondary text: #cccccc  



## Tech Stack

- React.js  
- Tailwind CSS  
- Open-Meteo APIs (Weather and Air Quality)  
- Open-Meteo / BigDataCloud Geocoding APIs  



## Architecture

The application follows a modular frontend architecture:

- Component-based UI structure  
- Reusable API service layer  
- Custom React hooks for state and data handling  
- Utility functions for unit conversions and formatting  



## Core Functionality

- Browser-based geolocation for automatic location detection  
- Real-time data fetching from external APIs  
- Hourly and historical data visualization  
- Unit conversion utilities (Celsius ↔ Fahrenheit)  
- Clean separation of concerns across components  


## Project Structure

WeatherPulse/
│
├── components/        # Reusable UI components  
├── hooks/             # Custom React hooks  
├── lib/               # API services and utilities  
├── pages/             # Application pages  
├── styles/            # Tailwind configuration  
├── App.jsx  
└── main.jsx  



## Performance

- Optimized rendering with minimal re-renders  
- Efficient API handling and data processing  
- Fast load times (target <500ms for core UI)  
- Scalable and maintainable codebase  


## Responsiveness

- Mobile-first design approach  
- Adaptive layouts for all screen sizes  
- Dynamic chart resizing  
- Consistent spacing and alignment  



## Data Source

Weather and air quality data are powered by Open-Meteo APIs.



## Getting Started

Clone the repository:

git clone https://github.com/your-username/weatherpulse.git

Navigate to the project directory:

cd weatherpulse

Install dependencies:

npm install

Start the development server:

npm run dev



## Future Enhancements

- Multi-city search functionality  
- Weather alerts and notifications  
- Progressive Web App (PWA) support  
- Advanced analytics and insights  
- Theme customization (dark/light mode)  



## Author

Ayushi Kushwaha  
Frontend Developer  

