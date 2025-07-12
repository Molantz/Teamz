import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

interface UseRealtimeOptions {
  table: string
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  filter?: string
  filterValue?: string | number
  onDataChange?: (payload: any) => void
}

interface BaseRecord {
  id: string
}

export function useRealtime<T extends BaseRecord>({
  table,
  event = '*',
  filter,
  filterValue,
  onDataChange
}: UseRealtimeOptions) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        let query = supabase.from(table).select('*')
        
        if (filter && filterValue) {
          query = query.eq(filter, filterValue)
        }
        
        const { data: initialData, error: fetchError } = await query
        
        if (fetchError) {
          setError(fetchError.message)
        } else {
          setData(initialData || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [table, filter, filterValue])

  // Set up real-time subscription
  useEffect(() => {
    let subscription: RealtimeChannel

    const setupSubscription = async () => {
      try {
        let channelQuery = supabase.channel(`${table}-changes`)
        
        if (filter && filterValue) {
          channelQuery = channelQuery
            .on(
              'postgres_changes' as any,
              {
                event,
                schema: 'public',
                table,
                filter: `${filter}=eq.${filterValue}`
              },
              (payload: any) => {
                handleDataChange(payload)
              }
            )
        } else {
          channelQuery = channelQuery
            .on(
              'postgres_changes' as any,
              {
                event,
                schema: 'public',
                table
              },
              (payload: any) => {
                handleDataChange(payload)
              }
            )
        }

        subscription = await channelQuery.subscribe()
        setChannel(subscription)
      } catch (err) {
        console.error('Failed to setup real-time subscription:', err)
        setError('Failed to setup real-time updates')
      }
    }

    setupSubscription()

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
      }
    }
  }, [table, event, filter, filterValue])

  const handleDataChange = (payload: any) => {
    if (onDataChange) {
      onDataChange(payload)
    }

    setData((currentData) => {
      const { eventType, new: newRecord, old: oldRecord } = payload

      switch (eventType) {
        case 'INSERT':
          return [...currentData, newRecord]
        case 'UPDATE':
          return currentData.map(item => 
            item.id === newRecord.id ? newRecord : item
          )
        case 'DELETE':
          return currentData.filter(item => item.id !== oldRecord.id)
        default:
          return currentData
      }
    })
  }

  const refresh = async () => {
    try {
      setLoading(true)
      let query = supabase.from(table).select('*')
      
      if (filter && filterValue) {
        query = query.eq(filter, filterValue)
      }
      
      const { data: freshData, error: fetchError } = await query
      
      if (fetchError) {
        setError(fetchError.message)
      } else {
        setData(freshData || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data')
    } finally {
      setLoading(false)
    }
  }

  return {
    data,
    loading,
    error,
    refresh,
    channel
  }
} 