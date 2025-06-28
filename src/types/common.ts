// src/types/common.ts - Actualizado
import React from 'react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface TableColumn<T = any> {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  width?: string;
  className?: string;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterOption {
  key: string;
  label: string;
  type: 'select' | 'text' | 'date' | 'number';
  options?: SelectOption[];
  placeholder?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface FormState<T = any> extends LoadingState {
  data?: T;
  isDirty?: boolean;
  isValid?: boolean;
}