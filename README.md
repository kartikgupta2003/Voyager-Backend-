# Voyager – AI-Powered Trip Planner

Voyager is a full-stack travel planning web application that generates personalized trip itineraries based on user preferences, budget, and selected destinations. The platform fetches AI APIs to dynamically generate trip plans and provides rich location insights with maps and images, delivering a smooth and intuitive trip-planning experience. The application is deployed on Vercel and fully containerized using Docker and Docker Compose for consistent development and portability.

---

## Live Demo

https://voyager-frontend-one.vercel.app  

---

## Features

- Generate AI-powered travel itineraries by fetching external AI APIs based on user preferences, budget, and destinations  
- Interactive location insights with geocoding and map-based visualization using the MapTiler API  
- Secure authentication using Clerk  
- Persistent trip storage with MongoDB, enabling users to create, view, and retrieve trips across sessions  
- Fully responsive UI built with modern component libraries  

---

## Tech Stack

### Frontend
- React  
- ShadCN UI  

### Backend
- Node.js  
- Express.js  

### Database
- MongoDB  

### Authentication
- Clerk  

### APIs & Services
- AI APIs (Trip Generation)  
- MapTiler (Geocoding & Maps)  

### Architecture
- MERN Stack  
- Docker & Docker Compose (Multi-container setup)

---

## Highlights

- Designed scalable CRUD APIs for trip creation and retrieval  
- Integrated AI APIs to dynamically generate personalized travel itineraries  
- Integrated third-party APIs to enhance real-world usability  
- Implemented production-ready authentication and session handling  
- Containerized the full application using Docker for environment consistency and simplified deployment

---


## Docker Setup

This project is fully containerized using Docker and Docker Compose.

For the complete Docker configuration and setup instructions, refer to:

https://github.com/kartikgupta2003/Voyager-Docker

