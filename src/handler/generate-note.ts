import { SQSEvent, Handler, Context } from 'aws-lambda'
import { GenerateNoteParameter } from 'tinkerbell'

const generateNote: Function = async (
  param: GenerateNoteParameter,
): Promise<void> => {
  console.log(param)
  // TODO: implement generate note
}

const generateNotes: Function = async (
  params: GenerateNoteParameter[],
): Promise<void> => {
  const jobs = params.map(async param => await generateNote(param))
  await Promise.all(jobs)
}

const generate: Handler = async (event: SQSEvent, _context: Context) => {
  const { Records: records } = event

  const generateNoteParams = records.map(record => {
    const { body } = record
    const requestBody = JSON.parse(body!)
    const { uuid, bucket, key } = requestBody

    return { uuid, bucket, key }
  })

  await generateNotes(generateNoteParams)
}

export { generate }
