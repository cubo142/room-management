import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import notesRoutes from "./routes/notes";
import roomRoutes from "./routes/roomRoute";
import paycheckRoutes from "./routes/paycheckRoute";
import peopleRoutes from "./routes/peopleRoute";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
// import people from "./models/people";

const app = express();

app.use(morgan("dev"));

app.use(express.json()); //express.json() analyze JSON help server accept JSON body - put this before any route

//***************ROUTES******************/
app.use("/api/notes", notesRoutes);
app.use("/api/rooms",roomRoutes);
app.use("/api/paychecks",paycheckRoutes);
app.use("/api/peoples",peopleRoutes);
//***************************************/

//***************ERROR HANDLER***************** */
//Middleware to handle error endpoint, need to place after route's middleware
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

//Middleware check if error is really the type of Error instead of anything else
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown Error occured";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});
//******************************************** */


export default app;
