
export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
}

export interface FilterOption {
  key: string
  label: string
  type: 'select' | 'text' | 'date' | 'number'
  options?: SelectOption[]
  placeholder?: string
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage?: number
  totalItems?: number
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export interface LoadingState {
  isLoading: boolean
  error?: string | null
}

export interface FormState<T = any> extends LoadingState {
  data?: T
  isDirty?: boolean
  isValid?: boolean
}