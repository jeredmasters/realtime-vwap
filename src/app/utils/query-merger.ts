export type Func<T = any> = () => Promise<T>;
export type ResolveFunc<T = any> = (t: T) => void;

export interface Query<T = any> {
  key: string;
  promise: Promise<T>;
  resolveQueue: Array<ResolveFunc>;
  rejectQueue: Array<ResolveFunc>;
  result: T | null;
  resultTs: number | null;
  cacheTimeoutMs: number | null;
}
export interface PromiseMergerConfig {
  cacheTimeoutMs: number;
}
export class PromiseMerger {
  queries: { [key: string]: Query } = {};
  config: PromiseMergerConfig;
  constructor(config: PromiseMergerConfig) {
    this.config = config;
  }
  query<T = any>(key: string, func: Func<T>, cacheTimeoutMs?: number) {
    return new Promise<T>((resolve, reject) => {
      if (this.queries[key] !== undefined) {
        const q = this.queries[key];
        if (q.resultTs !== null) {
          if (q.cacheTimeoutMs && Date.now() - q.resultTs < q.cacheTimeoutMs) {
            return resolve(q.result);
          } else {
            delete this.queries[key];
          }
        }
      }
      if (this.queries[key] !== undefined) {
        this.queries[key].resolveQueue.push(resolve);
        this.queries[key].rejectQueue.push(reject);
      } else {
        this.queries[key] = {
          key,
          resolveQueue: [resolve],
          rejectQueue: [reject],
          result: null,
          resultTs: null,
          promise: func().then(
            (t: T) => this.resolve(key, t),
            (r: any) => this.reject(key, r)
          ),
          cacheTimeoutMs: cacheTimeoutMs || this.config.cacheTimeoutMs,
        };
      }
    });
  }
  resolve<T = any>(key: string, t: T) {
    if (this.queries[key] == undefined) {
      console.error("PromiseMerger key not found: " + key);
    }
    this.queries[key].result = t;
    this.queries[key].resultTs = Date.now();
    this.queries[key].resolveQueue.map((res) => res(t));
    this.queries[key].resolveQueue = [];
    this.queries[key].rejectQueue = [];
  }
  reject<T = any>(key: string, t: T) {
    if (this.queries[key] == undefined) {
      console.error("PromiseMerger key not found: " + key);
    }
    this.queries[key].rejectQueue.map((res) => res(t));
  }
}
