declare namespace Tinkerbell {
  export interface InvokeTranscribeParameter {
    uuid: string
    s3Uri: string
  }
}

declare module 'tinkerbell' {
  export = Tinkerbell
}
