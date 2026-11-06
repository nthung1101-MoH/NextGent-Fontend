import React, { useState } from 'react';
import { ProductSpecGroup } from '../../types/product';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ProductSpecsTableProps {
  specGroups: ProductSpecGroup[];
}

export const ProductSpecsTable: React.FC<ProductSpecsTableProps> = ({ specGroups }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Hiển thị 2 nhóm đầu tiên nếu thu gọn
  const displayedGroups = isExpanded ? specGroups : specGroups.slice(0, 2);

  return (
    <div className="bg-canvas border border-hairline-soft rounded-lg p-6">
      <h3 className="text-xl font-medium text-ink-deep mb-4 pb-2 border-b border-hairline-soft flex items-center justify-between">
        <span>Thông số kỹ thuật chi tiết</span>
        <span className="text-xs text-steel font-normal">Chính xác từ nhà sản xuất</span>
      </h3>

      <div className="space-y-4">
        {displayedGroups.map((group, gIdx) => (
          <div key={gIdx} className="border border-hairline-soft rounded-lg overflow-hidden">
            <div className="bg-surface-soft px-4 py-2.5 font-bold text-xs text-ink uppercase tracking-wide border-b border-hairline-soft">
              {group.groupName}
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-hairline-soft">
                {group.items.map((item, iIdx) => (
                  <tr key={iIdx} className={iIdx % 2 === 0 ? 'bg-canvas' : 'bg-surface-soft/40'}>
                    <td className="py-3 px-4 text-ink font-bold w-1/3 text-sm">{item.name}</td>
                    <td className="py-3 px-4 text-charcoal text-sm">{item.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {specGroups.length > 2 && (
        <div className="mt-5 text-center">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-ink-deep text-ink-deep rounded-full text-sm font-bold hover:bg-surface-soft transition-colors"
          >
            <span>{isExpanded ? 'Thu gọn thông số' : 'Xem cấu hình chi tiết đầy đủ'}</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      )}
    </div>
  );
};
