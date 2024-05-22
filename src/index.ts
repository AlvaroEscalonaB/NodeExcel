import express, { Request, Response } from 'express';
import { excelGeneration } from './excel_generation'

const app = express();
app.use(express.json())
const PORT = 3000;

app.get('/f29_excel_generation', async (req: Request, res: Response) => {
  // const body: any[] = Object.keys(req.body).length === 0 ? req.body : []
  // console.log(body);
  
  console.time()
  const buffer = await excelGeneration([])
  console.timeEnd('Time to generate file')
  
  res.setHeader('Content-Disposition', 'attachment; filename="data.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buffer)
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});