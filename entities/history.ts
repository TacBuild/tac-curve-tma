export type HistoryTransactionStatus = 'complete' | 'failed' | 'progress'

export interface HistoryTransactionRecord {
  timestamp: number
  status: HistoryTransactionStatus
  hash: string
}
