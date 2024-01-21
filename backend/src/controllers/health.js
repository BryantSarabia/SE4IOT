export class HealthController {
  constructor ({ healthModel }) {
    this.healthModel = healthModel
  }

  get = async (req, res, next) => {
    const result = await this.healthModel.getHealth()
    return res.status(200).json(result)
  }
}
