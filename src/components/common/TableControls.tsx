import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface OrderOption {
  label: string;
  value: string;
}

interface TableControlsProps {
  orderOptions: OrderOption[];
  selectedOrder: string;
  onOrderChange: (value: string) => void;
  
  pageSizeOptions?: number[];
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  
  currentPage: number;
  totalElements: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  totalPages: number;
}

export const TableControls: React.FC<TableControlsProps> = ({
  orderOptions,
  selectedOrder,
  onOrderChange,
  pageSizeOptions = [10, 25, 50, 100],
  pageSize,
  onPageSizeChange,
  currentPage,
  totalElements,
  onPrevPage,
  onNextPage,
  totalPages,
}) => {
  const startItem = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-widest bg-white dark:bg-[#0f172a]/70 backdrop-blur-md px-6 py-3 border border-white/80 dark:border-slate-800/60 rounded-2xl mb-4 shadow-sm w-full">
      {/* Left side: Order By */}
      <div className="flex items-center gap-2">
        <span className="text-slate-400">Order By</span>
        <div className="relative group cursor-pointer">
          <select 
            value={selectedOrder}
            onChange={(e) => onOrderChange(e.target.value)}
            className="appearance-none bg-transparent border-none pr-5 text-slate-700 dark:text-slate-300 outline-none cursor-pointer group-hover:text-primary-500 transition-colors"
          >
            {orderOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-slate-700 bg-white">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-primary-500" />
        </div>
      </div>
    </div>
  );
};
