'use client';

import { Fragment, useState } from 'react';
import UrlInputForm from '@/app/components/UrlInputForm';
import FileInputForm from '@/app/components/FileInputForm';

export default function Home() {
  const [selectedTabIdx, setSelectedTabIdx] = useState<number>(0);
  const tabs = [
    { label: 'File', content: FileInputForm },
    { label: 'Url', content: UrlInputForm },
  ];
  const SelectedComponent = tabs[selectedTabIdx].content;

  const isSelected = (idx: number) => selectedTabIdx === idx;

  return (
    <div className="flex min-h-screen px-4 py-12 justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full h-full max-w-3xl flex-col items-center justify-between bg-white dark:bg-black sm:items-start">
        <div className="w-full tabs tabs-border">
          {tabs.map((tab, idx) => (
            <Fragment key={`tab-${idx}`}>
              <input
                type="radio"
                name="my_tabs_2"
                className="tab"
                aria-label={tab.label}
                checked={isSelected(idx)}
                onChange={() => setSelectedTabIdx(idx)}
              />
              <div className="tab-content border-base-300 bg-base-100 p-10">
                <SelectedComponent />
              </div>
            </Fragment>
          ))}
        </div>
      </main>
    </div>
  );
}
