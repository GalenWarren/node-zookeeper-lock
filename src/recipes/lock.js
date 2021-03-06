import {
  observeSeekClientNodeState,
  observeRemoveNode,
} from '../util';

/**
* Generates an observable for an exclusive lock on a resource.
* @param {Object} options
* @param {Object} options.client - The node-zookeeper-client instance
* @param {Object} options.path - The path on which to get the lock
* @param {string} options.clientNodePrefix - The client node prefix for this action
*/
export function observeExclusiveLock(options) {
  const { client, path, clientNodePrefix } = options;
  return observeSeekClientNodeState({
    client,
    path,
    clientNodePrefix,
    repeat: (nodes, result, clientIndex) => {
      const waitIndex = Math.max(clientIndex - 1, 0);
      return observeRemoveNode({
        client,
        path: nodes[waitIndex],
      }).map(() => true);
    },
  }).distinctUntilChanged();
}
