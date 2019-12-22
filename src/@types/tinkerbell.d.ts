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
}

declare module 'tinkerbell' {
  export = Tinkerbell
}
