import React from 'react';

export const metadata = {
  title: 'Keystatic Admin',
};

export default function KeystaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    React.createElement('html', { lang: 'sk' },
      React.createElement('body', { style: { background: '#ffffff', color: '#000000', margin: 0 } },
        children
      )
    )
  );
}