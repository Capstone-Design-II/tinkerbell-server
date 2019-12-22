module.exports.ENVS = serverless => ({
  SLS_AWS_REGION: '<Place aws region here>',
  SLS_AWS_CRED_PROFILE: '<Place aws credential profile here>',
  DYNAMODB_USER_TABLE_NAME: '<Place dynamoDB table name here>',
  DYNAMODB_HISTORY_TABLE_NAME: '<Place dynamoDB table name here>',
  S3_CUSTOMER_VOICES_BUCKET_NAME: '<Place S3 bucket name here>',
  S3_MEETING_RECORDS_BUCKET_NAME: '<Place S3 bucket name here>',
  S3_TRANSCRIPTS_BUCKET_NAME: '<Place S3 bucket name here>',
  SQS_TRANSCRIPT_QUEUE_NAME: '<Place SQS queue name here>',
  SQS_TRANSCRIPT_RESULT_QUEUE_NAME: '<Place SQS queue name here>',
  AZURE_COGNITIVE_SERVICE_KEY: '<Place azure cognitive service subscription key here>',
  AZURE_COGNITIVE_SERVICE_ENDPOINT: '<Place azure cognitive service endpoint here>',
});
