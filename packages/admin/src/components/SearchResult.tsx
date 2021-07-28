import React from 'react';
import { Card, Text, useTheme } from '@geist-ui/react';
import { useRouter } from 'next/router';
import { Home, User, Compass } from '@geist-ui/react-icons';

export interface SearchResultProps {
  selected?: boolean;
  type: 'user' | 'common' | 'proposal';

  onNavigate?: () => void;

  data: {
    id: string;

    title: string;
    subtitle?: string;
  };
}

export const SearchResult: React.FC<SearchResultProps> = ({ selected, type, onNavigate, data }) => {
  const router = useRouter();
  const theme = useTheme();

  const resultRef = React.useRef(null);


  React.useEffect(() => {
    const handleKeyboardEvent = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (selected) {
          onNavigateTo()
            .then(() => {
              console.log('Navigated from search');
            });
        }

        event.preventDefault();
      }
    };

    if (selected) {
      resultRef?.current?.scrollIntoViewIfNeeded(true);
    }

    window.addEventListener('keydown', handleKeyboardEvent);

    return () => {
      window.removeEventListener('keydown', handleKeyboardEvent);
    };
  }, [selected]);

  const onNavigateTo = async () => {
    await router.push(`/${type}s/details/${data.id}`);

    onNavigate();
  };

  return (
    <div
      ref={resultRef}
      style={{
        margin: '1rem 0'
      }}
    >

      <Card
        style={{
          cursor: 'pointer',
          display: 'flex',

          ...(selected && ({
            borderColor: theme.palette.success
          }))
        }}
        onClick={onNavigateTo}
      >
        {type === 'common' && (
          <Home
            strokeWidth={2}
          />
        )}

        {type === 'user' && (
          <User
            strokeWidth={2}
          />
        )}

        {type === 'proposal' && (
          <Compass
            strokeWidth={2}
          />
        )}

        <div style={{ maxWidth: '70%' }}>
          <Text h3 style={{ margin: 0 }}>
            {data.title}
          </Text>

          <Text p style={{ margin: 0 }}>
            {data.subtitle}
          </Text>
        </div>
      </Card>
    </div>

  );
};