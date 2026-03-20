/**
*Author: 	DIEGO CASALLAS
*Date:		01/01/2026  
*Description:	Index file for the API - NODEJS
**/
import app from './app/app.js';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || process.env.SERVER_PORT || 3001; // Allow dynamic port configuration

process.on('unhandledRejection', (reason) => {
  console.error('[unhandledRejection]', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[uncaughtException]', error);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
