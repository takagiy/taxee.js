import { AsyncLocalStorage } from "node:async_hooks";

export abstract class TransactionManager<Client, TransactionClient> {
  protected readonly _transaction = new AsyncLocalStorage<TransactionClient>();

  constructor(protected readonly _client: Client) {}

  get client(): Client | TransactionClient {
    return this._transaction.getStore() ?? this._client;
  }

  abstract beginTransaction<R>(callback: () => Promise<R>): Promise<R>;
}
