import { Component } from "react";
import storage from "../helpers/storage";

export default class StorageProvider<P, S> extends Component<P, S> {
  get storageKey(): string {
    throw new Error("storageKey not implemented.");
  }

  async storeState<K extends keyof S>(state: Pick<S, K> | S | null): Promise<void> {
    this.setState(state, async () => {
      await storage.set(this.storageKey, this.state);
    });
  }

  async componentDidMount() {
    const state = await storage.get<S>(this.storageKey);

    if (state !== undefined) {
      this.setState(state);
    }
  }
}
