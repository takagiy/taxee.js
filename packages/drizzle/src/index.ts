import * as TeeEx from "tee-ex";

type BaseDrizzleClient = {
  transaction: <R>(
    callback: (tx: {
      rollback: () => Promise<void>;
    }) => Promise<R>,
  ) => Promise<R>;
};

type Transaction<DrizzleClient extends BaseDrizzleClient> = Parameters<
  Parameters<DrizzleClient["transaction"]>[0]
>[0];

export class TransactionManager<
  DrizzleClient extends BaseDrizzleClient,
> extends TeeEx.TransactionManager<DrizzleClient, Transaction<DrizzleClient>> {
  override async beginTransaction<R>(callback: () => Promise<R>): Promise<R> {
    return this._client.transaction(async (tx) => {
      return this._transaction.run(tx, callback);
    });
  }

  async rollback(): Promise<void> {
    const tx = this._transaction.getStore();
    if (!tx) {
      throw new Error("rollback called outside of transaction");
    }
    await tx.rollback();
  }

  async rollbackIfPossible(): Promise<void> {
    const tx = this._transaction.getStore();
    if (tx) {
      await tx.rollback();
    }
  }
}
