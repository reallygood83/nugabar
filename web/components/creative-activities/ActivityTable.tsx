'use client';

import { useState } from 'react';

interface Activity {
  id: string;
  date: string;
  category: 'autonomous' | 'club' | 'career' | 'volunteer';
  subject: string;
  content: string;
  selected: boolean;
}

interface ActivityTableProps {
  activities: Activity[];
  onSelectionChange: (selectedActivities: Activity[]) => void;
}

// 카테고리 한글 이름 및 색상
const categoryInfo = {
  autonomous: { name: '자율활동', color: 'blue', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-700' },
  club: { name: '동아리활동', color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-700' },
  career: { name: '진로활동', color: 'purple', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-700' },
  volunteer: { name: '봉사활동', color: 'orange', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-700' }
};

export default function ActivityTable({ activities, onSelectionChange }: ActivityTableProps) {
  const [localActivities, setLocalActivities] = useState<Activity[]>(activities);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 카테고리별 활동 개수
  const categoryCounts = {
    all: activities.length,
    autonomous: activities.filter(a => a.category === 'autonomous').length,
    club: activities.filter(a => a.category === 'club').length,
    career: activities.filter(a => a.category === 'career').length,
    volunteer: activities.filter(a => a.category === 'volunteer').length
  };

  // 필터링된 활동 목록
  const filteredActivities = selectedCategory === 'all'
    ? localActivities
    : localActivities.filter(a => a.category === selectedCategory);

  // 개별 체크박스 토글
  const handleToggle = (id: string) => {
    const updated = localActivities.map(activity =>
      activity.id === id ? { ...activity, selected: !activity.selected } : activity
    );
    setLocalActivities(updated);
    onSelectionChange(updated.filter(a => a.selected));
  };

  // 전체 선택/해제
  const handleSelectAll = () => {
    const allSelected = filteredActivities.every(a => a.selected);
    const updated = localActivities.map(activity => {
      if (selectedCategory === 'all' || activity.category === selectedCategory) {
        return { ...activity, selected: !allSelected };
      }
      return activity;
    });
    setLocalActivities(updated);
    onSelectionChange(updated.filter(a => a.selected));
  };

  // 선택된 활동 개수
  const selectedCount = localActivities.filter(a => a.selected).length;

  return (
    <div className="space-y-4">
      {/* 통계 및 필터 바 */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* 선택 통계 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">선택된 활동:</span>
            <span className="text-lg font-bold text-blue-600">{selectedCount}</span>
            <span className="text-sm text-gray-500">/ {activities.length}개</span>
          </div>

          {/* 카테고리 필터 버튼 */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              전체 ({categoryCounts.all})
            </button>
            {Object.entries(categoryInfo).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  selectedCategory === key
                    ? `${info.bgColor} ${info.textColor} border ${info.borderColor}`
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {info.name} ({categoryCounts[key as keyof typeof categoryCounts]})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 전체 선택 버튼 */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleSelectAll}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <input
            type="checkbox"
            checked={filteredActivities.length > 0 && filteredActivities.every(a => a.selected)}
            onChange={() => {}}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            {filteredActivities.every(a => a.selected) ? '전체 해제' : '전체 선택'}
          </span>
        </button>
      </div>

      {/* 활동 테이블 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left w-12">
                  <span className="sr-only">선택</span>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-28">
                  날짜
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-32">
                  분류
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  주제
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  활동 내용
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    해당 카테고리에 활동이 없습니다
                  </td>
                </tr>
              ) : (
                filteredActivities.map((activity) => {
                  const info = categoryInfo[activity.category];
                  return (
                    <tr
                      key={activity.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        activity.selected ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={activity.selected}
                          onChange={() => handleToggle(activity.id)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {activity.date}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${info.bgColor} ${info.textColor}`}>
                          {info.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="font-medium">{activity.subject}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <div className="line-clamp-2">{activity.content}</div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 선택 요약 */}
      {selectedCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-blue-900">
              {selectedCount}개의 활동이 선택되었습니다. 아래에서 생성할 누가기록 개수를 설정하고 생성 버튼을 클릭하세요.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
