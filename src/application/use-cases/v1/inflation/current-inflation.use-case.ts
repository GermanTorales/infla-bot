import { Inject, Injectable, Logger } from "@nestjs/common";

@Injectable()
export class CurrentInflationV1 {
  private logger: Logger = new Logger(CurrentInflationV1.name);

  constructor() {}

  async exec() {}
}
