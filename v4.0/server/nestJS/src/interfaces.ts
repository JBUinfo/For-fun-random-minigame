export interface IResponse {
  data: any;
  error: any;
}

export enum TYPE_ERROR {
  IMAGE_NOT_FOUND = 'IMAGE_NOT_FOUND',
  MISSING_INPUT = 'MISSING_INPUT',
  USER_EXISTS = 'USER_EXISTS',
}
