
import React from 'react';
import { BookOpen } from 'lucide-react';
import { trackSEOInteraction } from '@/lib/analytics';

interface TableOfContentsItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      trackSEOInteraction('TOC_Click', 'Article', id);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-8 border">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        Table of Contents
      </h2>
      <nav className="space-y-2">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(item.id)}
            className={`block text-left w-full hover:text-blue-600 transition-colors ${
              item.level === 1 ? 'font-medium text-gray-900' : 'text-gray-600 ml-4'
            }`}
          >
            {item.title}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TableOfContents;
