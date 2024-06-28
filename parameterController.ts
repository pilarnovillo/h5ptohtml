// Import necessary modules
import { Router, Request, Response } from 'express';
import parameterService from './parameterService';

// Initialize Express Router
const router = Router();

// Endpoint to handle POST requests to '/api/sendParameter'
router.post('/sendParameter', async (req: Request, res: Response) => {
  const { parameter, parameter2 } = req.body; // Assuming parameter is sent in the request body
  console.log("parameter: "+parameter);
  console.log(parameter2);
  // Call a service method to process the parameter
  const result = await parameterService.processParameter(parameter, parameter2);

  // Send back a response
  res.send(result);
  // res.json({ message: 'Parameter received and processed successfully', result });
});

// Export the router to be used in server.ts
export default router;
