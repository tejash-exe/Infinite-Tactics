import connectToDb from './db/db.js';
import { httpServer } from './app.js';
import 'dotenv/config';

connectToDb()
.then( () => {
  httpServer.listen(process.env.PORT || 3000, () => {
    console.log(`Server is listening on port ${process.env.PORT}`)
  });
})
.catch((error) => {
  console.log(error);
});