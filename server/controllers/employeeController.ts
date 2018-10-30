import { Request, Response } from 'express';
import EmployeeSchema from '../models/employee';

class EmployeeController {

  constructor() { }

  async list(req: Request, res: Response) {

    try {

      let employeeList = await EmployeeSchema.find();

      return res.send({
        data: employeeList
      });

    } catch (err) {
      res.send({
        error: {
          msn: 'Erro ao listar funcionário',
          errors: err
        }
      });
    }
  }

  async create(req: Request, res: Response) {

    try {
      const { name, surName, participation } = req.body;

      let msm: string[] = [];

      if (name == null || name == '')
        msm.push("campo nome vazio")

      if (surName == null || surName == '')
        msm.push("campo sobrenome vazio")

      if (participation == null || participation == '')
        msm.push("campo partipação vazio")

      if (msm.length > 0) {

        return res.status(400)
          .send({
            error: {
              msn: 'Erro ao criar funcionário:',
              errors: msm
            }
          });
      }

      let employee = await EmployeeSchema.create(req.body);

      return res.send({
        data: employee
      });

    } catch (err) {
      return res.status(400)
        .send({
          error: {
            msn: 'Erro ao criar funcionário:',
            errors: err
          }
        });
    }
  }
}

export default new EmployeeController();