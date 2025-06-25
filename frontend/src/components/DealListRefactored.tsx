import React from 'react';
import { DealsContainer } from './DealList/DealsContainer';

interface DealListProps {
  initialCategory?: string;
  initialStore?: string;
}

const DealList: React.FC<DealListProps> = ({ initialCategory, initialStore }) => {
  const showHeroSection = !initialCategory && !initialStore;

  return (
    <DealsContainer
      initialCategory={initialCategory}
      initialStore={initialStore}
      showHeroSection={showHeroSection}
    />
  );
};

export default DealList;
