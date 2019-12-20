import axios from 'axios'
import { AxiosInstance } from 'axios'
import FormData from 'form-data'

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

  public async enroll(id: string, voice: any): Promise<void> {
    const endpoint = `identificationProfiles/${id}/enroll?shortAudio=true`
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    const form = new FormData()
    form.append('audio', voice)
    const response = await this._cognitiveService.post(endpoint, form, config)
    console.log(response)
  }
}
