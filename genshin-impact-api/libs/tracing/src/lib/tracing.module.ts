import { DynamicModule, Module } from '@nestjs/common';
import { TracingOptions, TRACING_OPTIONS } from '../tracing/tracing.constant';
import { TracingService } from '../tracing/tracing.service';

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class TracingModule {
  static register(options: TracingOptions): DynamicModule {
    return {
      module: TracingModule,
      providers: [
        {
          provide: TRACING_OPTIONS,
          useValue: options
        },
        TracingService
      ],
      exports: [TracingService]
    }
  }
}
