export interface CustomHttpResponse {
    error: {
        responseStatusCode: number;
        responseHttpStatus: number;
        responseReasonMessage: string;
        responseDescription: string;
    }
}
