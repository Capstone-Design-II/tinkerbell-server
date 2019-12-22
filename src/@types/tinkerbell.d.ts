declare namespace Tinkerbell {
  export interface InvokeTranscribeParameter {
    uuid: string
    s3Uri: string
  }

  export interface GenerateNoteParameter {
    uuid: string
    bucket: string
    key: string
  }

  export interface TranscriptResult {
    jobName:   string
    accountID: string
    results:   Results
    status:    string
  }

  export interface Results {
    transcripts:    Transcript[]
    speaker_labels: SpeakerLabels
    items:          Item[]
  }

  export interface Item {
    start_time?:   string
    end_time?:     string
    alternatives:  Alternative[]
    type:          Type
  }

  export interface Alternative {
    confidence: string
    content:    string
  }

  export enum Type {
    Pronunciation = "pronunciation",
    Punctuation = "punctuation",
  }

  export interface SpeakerLabels {
    speakers: number
    segments: Segment[]
  }

  export interface Segment {
    start_time:    string
    speaker_label: string
    end_time:      string
    items?:        Segment[]
  }

  export interface Transcript {
    transcript: string
  }
}

declare module 'tinkerbell' {
  export = Tinkerbell
}
