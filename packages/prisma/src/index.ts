import * as Taxee from "taxee";

type BasePrismaClient = {
  $transaction: <R>(callback: (tx: unknown) => Promise<R>) => Promise<R>;
};

type Transaction<PrismaClient extends BasePrismaClient> = Parameters<
  Parameters<PrismaClient["$transaction"]>[0]
>[0];

export class TransactionManager<
  PrismaClient extends BasePrismaClient,
> extends Taxee.TransactionManager<PrismaClient, Transaction<PrismaClient>> {
  override async beginTransaction<R>(callback: () => Promise<R>): Promise<R> {
    return this._client.$transaction(async (tx) => {
      return this._transaction.run(tx, callback);
    });
  }
}
