"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Edit, Eye, Trash2, MoreVertical } from "lucide-react";
import { Category } from "@/types";
import { Can } from "@/components/auth";
import Button from "@/components/ui/button/Button";
import { Dropdown } from "@/components/ui/dropdown/Dropdown";
import { DropdownItem } from "@/components/ui/dropdown/DropdownItem";

interface CategoryTreeProps {
  categories: Category[];
  expandAll: boolean;
  onEdit: (category: Category) => void;
  onView: (category: Category) => void;
  onDelete: (category: Category) => void;
}

interface TreeNode extends Category {
  children?: TreeNode[];
}

const buildTree = (categories: Category[]): TreeNode[] => {
  const map: { [key: number]: TreeNode } = {};
  const roots: TreeNode[] = [];

  // First pass: create all nodes
  categories.forEach((cat) => {
    map[cat.id] = { ...cat, children: [] };
  });

  // Second pass: build tree structure
  categories.forEach((cat) => {
    if (cat.parentId) {
      if (map[cat.parentId]) {
        map[cat.parentId].children?.push(map[cat.id]);
      }
    } else {
      roots.push(map[cat.id]);
    }
  });

  return roots;
};

const TreeNode: React.FC<{
  node: TreeNode;
  level: number;
  expandedIds: Set<number>;
  toggleExpand: (id: number) => void;
  onEdit: (category: Category) => void;
  onView: (category: Category) => void;
  onDelete: (category: Category) => void;
  openDropdownId: number | null;
  setOpenDropdownId: (id: number | null) => void;
}> = ({
  node,
  level,
  expandedIds,
  toggleExpand,
  onEdit,
  onView,
  onDelete,
  openDropdownId,
  setOpenDropdownId,
}) => {
  const isExpanded = expandedIds.has(node.id);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <>
      <div
        className="group flex items-center gap-2 py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
        style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
      >
        {/* Expand/Collapse Toggle */}
        <button
          onClick={() => hasChildren && toggleExpand(node.id)}
          className="flex-shrink-0 rounded p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title={hasChildren ? (isExpanded ? "Thu gọn" : "Mở rộng") : ""}
          disabled={!hasChildren}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            )
          ) : (
            <div className="w-4 h-4" />
          )}
        </button>

        {/* Category Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {node.categoryName}
              </p>
              {node.categoryCode && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {node.categoryCode}
                </p>
              )}
            </div>
            {node.status && (
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  node.status === "active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                }`}
              >
                {node.status === "active" ? "Hoạt động" : "Không hoạt động"}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Quick View Link */}
          <Link
            href={`/categories/${node.id}`}
            className="rounded p-1.5 text-gray-600 hover:bg-blue-100 hover:text-blue-600 dark:text-gray-400 dark:hover:bg-blue-900/20 transition-colors"
            title="Xem chi tiết"
          >
            <Eye className="h-4 w-4" />
          </Link>

          {/* Dropdown Menu */}
          <div className="relative">
            <Button
              onClick={() =>
                setOpenDropdownId(
                  openDropdownId === node.id ? null : node.id
                )
              }
              variant="normal"
              size="normal"
              className="rounded p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              title="Thêm thao tác"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            <Dropdown
              isOpen={openDropdownId === node.id}
              onClose={() => setOpenDropdownId(null)}
              className="w-56"
            >
              {/* Chỉnh sửa */}
              <Can permission="update_product">
                <DropdownItem
                  onClick={() => {
                    onEdit(node);
                    setOpenDropdownId(null);
                  }}
                  className="text-blue-600! hover:bg-blue-50! dark:text-blue-400! dark:hover:bg-blue-900/20!"
                >
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    <span>Chỉnh sửa</span>
                  </div>
                </DropdownItem>
              </Can>

              {/* Xóa */}
              <Can permission="delete_product">
                <DropdownItem
                  onClick={() => {
                    onDelete(node);
                    setOpenDropdownId(null);
                  }}
                  className="text-red-600! hover:bg-red-50! dark:text-red-400! dark:hover:bg-red-900/20!"
                >
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    <span>Xóa</span>
                  </div>
                </DropdownItem>
              </Can>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <>
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expandedIds={expandedIds}
              toggleExpand={toggleExpand}
              onEdit={onEdit}
              onView={onView}
              onDelete={onDelete}
              openDropdownId={openDropdownId}
              setOpenDropdownId={setOpenDropdownId}
            />
          ))}
        </>
      )}
    </>
  );
};

export const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  expandAll,
  onEdit,
  onView,
  onDelete,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => {
    if (expandAll) {
      return new Set(categories.map((c) => c.id));
    }
    return new Set();
  });

  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  // Update expanded state when expandAll prop changes
  React.useEffect(() => {
    if (expandAll) {
      setExpandedIds(new Set(categories.map((c) => c.id)));
    } else {
      setExpandedIds(new Set());
    }
  }, [expandAll, categories]);

  const toggleExpand = useCallback((id: number) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const treeData = useMemo(() => buildTree(categories), [categories]);

  if (categories.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-gray-500">
        <p>Không có danh mục nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {treeData.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          level={0}
          expandedIds={expandedIds}
          toggleExpand={toggleExpand}
          onEdit={onEdit}
          onView={onView}
          onDelete={onDelete}
          openDropdownId={openDropdownId}
          setOpenDropdownId={setOpenDropdownId}
        />
      ))}
    </div>
  );
};
