import { SQSEvent, Handler, Context } from 'aws-lambda'
import { TranscriptResult, GenerateNoteParameter } from 'tinkerbell'
import { S3 } from 'aws-sdk'
import { HistoryGateway } from '../entity-gateway/history-gateway'

const getTranscriptResult: Function = async (
  bucket: string,
  key: string,
): Promise<TranscriptResult> => {
  const s3 = new S3()
  const getObjectParam = {
    Bucket: bucket,
    Key: key,
  }

  const s3Response = await s3.getObject(
    getObjectParam as S3.Types.GetObjectRequest
  ).promise()

  const { Body: transcriptResultBuffer } = s3Response
  const transcriptResult = transcriptResultBuffer!.toString()

  return JSON.parse(transcriptResult)
}

const constructNote: Function = (
  transcriptResult: TranscriptResult
): string => {
  const { jobName } = transcriptResult
  let note = `note ${jobName}\n`

  const { results } = transcriptResult
  const { speaker_labels: speakerLabels, items } = results
  const { segments } = speakerLabels

  segments.forEach(segment => {
    const {
      speaker_label: speaker,
      start_time: startTime,
      end_time: endTime,
    } = segment
    const startIndex = items.findIndex(item => item['start_time'] === startTime)
    const endIndex = items.findIndex(item => item['end_time'] === endTime)
    const segmentItems = items.slice(startIndex, endIndex + 1)
    const segmentWords = segmentItems.map(item => {
      const word = item.alternatives[0].content
      if (item.type === 'pronunciation')
        return ` ${word}`
      return word
    })

    const segmentSentence = segmentWords.join('')
    const lastWord = items[endIndex + 1].alternatives[0].content
    note += `${speaker}:${segmentSentence}${lastWord}\n`
  })

  return note
}

const updateNote: Function = async (
  uuid: string,
  note: string,
): Promise<void> => {
  const historyTable = new HistoryGateway()
  await historyTable.updateNote(uuid, note)
}

const generateNote: Function = async (
  param: GenerateNoteParameter,
): Promise<void> => {
  try {
    const { bucket, key, uuid } = param
    const transcriptResult = await getTranscriptResult(bucket, key)
    const note = constructNote(transcriptResult)
    await updateNote(uuid, note)
    console.log(note)
  } catch (err) {
    console.error(err)
  }
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
