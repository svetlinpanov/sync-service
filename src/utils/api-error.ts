export class APIError extends Error {
    public status: number;
    public code?: string;
  
    constructor(status: number, message: string) {
      super();
      this.name = "APIError";
      this.status = status;
      this.message = message;
    }
  }