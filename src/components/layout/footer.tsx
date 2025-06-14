// @/components/layout/footer.tsx
import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background py-6">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} Musefolio. All rights reserved.</p>
        <p className="mt-1">
          Designed with <span role="img" aria-label="heart">❤️</span> by an AI-powered assistant.
        </p>
      </div>
    </footer>
  );
}
