import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { NodeTracerProvider } from '@opentelemetry/node';
import { Resource } from '@opentelemetry/resources'
import { SimpleSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/tracing'
import { trace, Tracer } from '@opentelemetry/api'
import { TracingOptions, TRACING_OPTIONS } from './tracing.constant';


@Injectable()
export class TracingService implements OnModuleInit {
  constructor(@Inject(TRACING_OPTIONS) private tracingOptions: TracingOptions) {}

  onModuleInit() {
    registerInstrumentations({
      instrumentations: [
        new HttpInstrumentation(),
        new ExpressInstrumentation(),
        new GraphQLInstrumentation()
      ]
    })

    const provider = new NodeTracerProvider({
      resource: Resource.default().merge(new Resource({
        "service.name": this.tracingOptions.serviceName
      }))
    })

    const consoleExporter = new ConsoleSpanExporter()
    provider.addSpanProcessor(
      new SimpleSpanProcessor(consoleExporter)
    )

    provider.register()
    trace.setGlobalTracerProvider(provider)
  }

  get tracer(): Tracer {
    return trace.getTracer(this.tracingOptions.serviceName)
  }
}
