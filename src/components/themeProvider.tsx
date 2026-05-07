"use client";

import React from "react";

export function ThemeScript() {
  const script = `
    (function() {
      var stored = localStorage.getItem('sql-trainer-theme');
      var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (stored === 'dark' || (!stored && prefersDark)) {
        document.documentElement.classList.add('dark');
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}