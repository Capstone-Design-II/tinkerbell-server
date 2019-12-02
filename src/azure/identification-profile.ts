import axios from 'axios'
import { AxiosInstance } from 'axios'

export class AzureIdentificationProfile {
  private _cognitiveService: AxiosInstance
  private _locale: string

  constructor() {
    const {
      AZURE_COGNITIVE_SERVICE_KEY,
      AZURE_COGNITIVE_SERVICE_ENDPOINT,
    } = process.env

    this._locale = 'en-us'
    this._cognitiveService = axios.create({
      baseURL: AZURE_COGNITIVE_SERVICE_ENDPOINT,
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_COGNITIVE_SERVICE_KEY,
      },
    })
  }

  public async create(): Promise<string> {
    const locale = this._locale
    const response = await this._cognitiveService.post('/identificationProfiles', { locale })
    const { data } = response
    return data.identificationProfileId
  }

  // TODO: implement this
  public async enroll(): Promise<void> {
  }
}
