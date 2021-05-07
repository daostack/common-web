import React, { useEffect, useState, PropsWithChildren } from 'react';

export const ClientOnly: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};