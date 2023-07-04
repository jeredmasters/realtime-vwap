import { EventEmitter } from "events";
import { PUBSUB_EVENTS } from "./const";

interface Substructure<T = any> {
  context?: string;
  data: T;
}

export class PubSub {
  eventEmitter = new EventEmitter();

  subscribe<T = any>(
    event: PUBSUB_EVENTS,
    context: string | undefined,
    callback: (t: T) => void
  ) {
    if (context === undefined) {
      this.eventEmitter.addListener(event, callback);
    } else {
      this.eventEmitter.addListener(event, (d: Substructure<T>) => {
        if (d.context === context) {
          callback(d.data);
        }
      });
    }
  }
  publish<T = any>(event: PUBSUB_EVENTS, context: string | undefined, data: T) {
    this.eventEmitter.emit(event, { context, data });
  }
}
