import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { Resource } from '@opentelemetry/resources'
import { SimpleSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base'
import { trace, context, Tracer, Span } from '@opentelemetry/api'
import { TracingOptions, TRACING_OPTIONS } from './tracing.constant';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { InstrumentationOption } from '@opentelemetry/instrumentation';


@Injectable()
export class TracingService implements OnModuleInit {
  constructor(@Inject(TRACING_OPTIONS) private tracingOptions: TracingOptions) {}

  async onModuleInit() {
    const instrumentations: InstrumentationOption[] = [
      new ExpressInstrumentation(),
      new HttpInstrumentation(),
    ]

    if (this.tracingOptions.serviceName !== 'api-gateway') {
      instrumentations.push(new GraphQLInstrumentation())
    }

    const openTelemetrySDK = new NodeSDK({
      spanProcessor: new SimpleSpanProcessor(new ConsoleSpanExporter()),
      contextManager: new AsyncLocalStorageContextManager(),
      instrumentations,
      resource: Resource.default().merge(new Resource({
        "service.name": this.tracingOptions.serviceName
      }))
    })

    await openTelemetrySDK.start()
  }

  get tracer(): Tracer {
    return trace.getTracer(this.tracingOptions.serviceName)
  }

  get currentSpan(): Span {
    return trace.getSpan(context.active())
  }

  startSpan(name: string, parentSpan?: Span): Span {
    const ctx = parentSpan ? trace.setSpan(context.active(), parentSpan) : (this.currentSpan ? trace.setSpan(context.active(), this.currentSpan) : undefined)
    return this.tracer.startSpan(name, undefined, ctx)
  }
}
