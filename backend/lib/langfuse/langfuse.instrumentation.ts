import { NodeSDK } from '@opentelemetry/sdk-node';
import { LangfuseSpanProcessor } from '@langfuse/otel';

const spanProcessor = new LangfuseSpanProcessor();

const sdk = new NodeSDK( { spanProcessors: [ spanProcessor ] } );

sdk.start();

export { spanProcessor };
