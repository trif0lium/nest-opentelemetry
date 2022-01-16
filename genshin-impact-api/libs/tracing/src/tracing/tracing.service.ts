import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InstrumentationOption, registerInstrumentations } from '@opentelemetry/instrumentation'
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { NodeTracerProvider } from '@opentelemetry/node';
import { Resource } from '@opentelemetry/resources'
import { SimpleSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/tracing'
import { trace, context, Tracer, Span } from '@opentelemetry/api'
import { TracingOptions, TRACING_OPTIONS } from './tracing.constant';
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino';


@Injectable()
export class TracingService implements OnModuleInit {
  constructor(@Inject(TRACING_OPTIONS) private tracingOptions: TracingOptions) {}

  onModuleInit() {
    const provider = new NodeTracerProvider({
      resource: Resource.default().merge(new Resource({
        "service.name": this.tracingOptions.serviceName
      }))
    })

    const instrumentations: InstrumentationOption[] = [
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
      new PinoInstrumentation({
        logHook: (_, record) => {
          record['resource.service.name'] = provider.resource.attributes['service.name']
        }
      })
    ]

    if (this.tracingOptions.serviceName != 'api-gateway') {
      instrumentations.push(new GraphQLInstrumentation())
    }

    registerInstrumentations({
      instrumentations
    })

    const consoleExporter = new ConsoleSpanExporter()
    provider.addSpanProcessor(
      new SimpleSpanProcessor(consoleExporter)
    )

    provider.register()
    trace.setGlobalTracerProvider(provider)
  }

  private get tracer(): Tracer {
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
