import { APIGatewayProxyEvent } from "aws-lambda";
import { input, output, z, SafeParseError, SafeParseSuccess } from "zod";
import { fromZodError } from "zod-validation-error";

export const validateRequest = <
    B extends z.ZodTypeAny,
    Q extends z.ZodTypeAny,
    P extends z.ZodTypeAny,
    H extends z.ZodTypeAny,
>(
    event: APIGatewayProxyEvent,
    { body, query, params, headers }: { body?: B; query?: Q; params?: P; headers?: H },
) => {
    if (body instanceof z.ZodObject) {
        body = body.strict() as unknown as B;
    }
    if (query instanceof z.ZodObject) {
        query = query.strict() as unknown as Q;
    }
    if (params instanceof z.ZodObject) {
        params = params.strict() as unknown as P;
    }
    console.log(event.body);
    return {
        body: body?.parse(JSON.parse(event.body)) as output<B>,
        query: query?.parse(event.queryStringParameters) as output<Q>,
        params: params?.parse(event.pathParameters) as output<P>,
        headers: headers?.parse(event.headers) as output<H>,
    };
}

export const getResponse = <D extends z.ZodTypeAny>(dataSchema: D, data: input<D>) => {
    const parsed: SafeParseSuccess<D> | SafeParseError<D> = dataSchema.safeParse(data);
    if (!parsed.success) {
        const parseError = parsed as SafeParseError<D>;
        throw new Error(`Invalid response data ${fromZodError(parseError.error)}`);
    }
    return {
        data: parsed.success ? parsed.data : data,
        status: 200,
    }
};