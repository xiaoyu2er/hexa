import type { TreeCollection } from '@react-stately/tree';
import type { Key } from '@react-types/shared';

export class TreeKeyboardDelegate<T> {
  collator: Intl.Collator;
  collection: TreeCollection<T>;
  disabledKeys: Set<Key>;

  constructor(collection: TreeCollection<T>, disabledKeys: Set<Key>) {
    this.collator = new Intl.Collator('en');
    this.collection = collection;
    this.disabledKeys = disabledKeys;
  }

  getKeyAbove(key: Key) {
    const { collection, disabledKeys } = this;
    let keyBefore = collection.getKeyBefore(key);

    while (keyBefore !== null) {
      const item = collection.getItem(keyBefore);

      if (item?.type === 'item' && !disabledKeys.has(item.key)) {
        return keyBefore;
      }

      keyBefore = collection.getKeyBefore(keyBefore);
    }

    return null;
  }

  getKeyBelow(key: Key) {
    const { collection, disabledKeys } = this;
    let keyBelow = collection.getKeyAfter(key);

    while (keyBelow !== null) {
      const item = collection.getItem(keyBelow);

      if (item?.type === 'item' && !disabledKeys.has(item.key)) {
        return keyBelow;
      }

      keyBelow = collection.getKeyAfter(keyBelow);
    }

    return null;
  }

  getFirstKey() {
    const { collection, disabledKeys } = this;
    let key = collection.getFirstKey();

    while (key !== null) {
      const item = collection.getItem(key);

      if (item?.type === 'item' && !disabledKeys.has(item.key)) {
        return key;
      }

      key = collection.getKeyAfter(key);
    }

    return null;
  }

  getLastKey() {
    const { collection, disabledKeys } = this;
    let key = collection.getLastKey();

    while (key !== null) {
      const item = collection.getItem(key);

      if (item?.type === 'item' && !disabledKeys.has(item.key)) {
        return key;
      }

      key = collection.getKeyBefore(key);
    }

    return null;
  }

  getKeyForSearch(search: string, fromKey = this.getFirstKey()) {
    const { collator, collection } = this;
    let key = fromKey;

    while (key !== null) {
      const item = collection.getItem(key);

      if (
        item?.textValue &&
        collator.compare(search, item.textValue.slice(0, search.length)) === 0
      ) {
        return key;
      }

      key = this.getKeyBelow(key);
    }

    return null;
  }
}
