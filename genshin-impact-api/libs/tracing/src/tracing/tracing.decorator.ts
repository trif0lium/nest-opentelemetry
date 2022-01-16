import { Inject } from '@nestjs/common';
import { context, trace } from '@opentelemetry/api';
import { TracingService } from './tracing.service';

export function Span(name?: string) {
  const injectTracingService = Inject(TracingService)
  return (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ) => {
    injectTracingService(target, 'tracingService')
    const tracingService: TracingService = this.tracingService
    const method = propertyDescriptor.value;
    // eslint-disable-next-line no-param-reassign
    propertyDescriptor.value = function PropertyDescriptor(...args: any[]) {
      const currentSpan = trace.getSpan(context.active());
      const tracer = tracingService.tracer

      return context.with(trace.setSpan(context.active(), currentSpan), () => {
        const span = tracer.startSpan(
          name || `${target.constructor.name}.${propertyKey}`,
        );
        if (method.constructor.name === 'AsyncFunction') {
          return method.apply(this, args).finally(() => {
            span.end();
          });
        }
        const result = method.apply(this, args);
        span.end();
        return result;
      });
    };
  };
}
