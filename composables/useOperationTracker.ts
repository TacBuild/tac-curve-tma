import {
  Network,
  OperationTracker,
  type TransactionLinker,
} from 'tac-sdk'

const POOL_MS = 5000
const MAX_RETRIES = 12
export const useOperationTracker = (transactionLinker: TransactionLinker | undefined) => {
  let interval: ReturnType<typeof setInterval>
  const tracker = new OperationTracker(Network.Testnet)
  const operationId = ref('')
  const status = ref('')
  const error = ref('')
  let remainingRetries = MAX_RETRIES

  const destroy = () => {
    clearInterval(interval)
  }

  const pool = async () => {
    remainingRetries--
    if (remainingRetries < 0) {
      error.value = 'Transaction took more time than expected, check execution on TAC Explorer'
      clearInterval(interval)
      return
    }

    if (!operationId.value) {
      operationId.value = await tracker.getOperationId(transactionLinker!).catch(() => '')
    }

    if (operationId.value) {
      const res = await tracker.getOperationStatus(operationId.value)

      if (status.value !== res.status) {
        remainingRetries = MAX_RETRIES
      }

      status.value = res.status
      // error.value = res.errorMessage || '' FIXME: setting error breaks pooling now
    }

    if (status.value === 'TVMMerkleMessageExecuted') {
      clearInterval(interval)
    }
  }

  if (!transactionLinker) {
    console.warn('tx linker not found. tracking is not available')
  }
  else {
    interval = setInterval(pool, POOL_MS)
    pool()
  }

  return {
    operationId,
    status,
    error,
    destroy,
  }
}
