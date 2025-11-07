#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, type = 'info') {
  const color = type === 'success' ? colors.green 
              : type === 'warning' ? colors.yellow 
              : type === 'error' ? colors.red 
              : colors.bright;
  
  console.log(`${color}${message}${colors.reset}`);
}

// Gera um novo componente
function generateComponent(name) {
  const componentDir = path.join('src', 'components');
  const componentPath = path.join(componentDir, `${name}.tsx`);
  
  // Template do componente
  const componentTemplate = `import { HTMLProps } from 'react';

interface ${name}Props extends HTMLProps<HTMLDivElement> {
  // Adicione props específicas aqui
}

export function ${name}({ className, ...props }: ${name}Props) {
  return (
    <div className={className} {...props}>
      {/* Conteúdo do componente */}
    </div>
  );
}
`;

  // Cria o arquivo do componente
  fs.writeFileSync(componentPath, componentTemplate);
  log(`✓ Componente ${name} criado em ${componentPath}`, 'success');
}

// Gera um novo hook customizado
function generateHook(name) {
  const hooksDir = path.join('src', 'hooks');
  const hookPath = path.join(hooksDir, `use${name}.ts`);
  
  // Template do hook
  const hookTemplate = `import { useState, useEffect } from 'react';

export function use${name}() {
  // Implemente seu hook aqui
  return {
    // Retorne os valores e funções do hook
  };
}
`;

  // Cria o arquivo do hook
  fs.writeFileSync(hookPath, hookTemplate);
  log(`✓ Hook use${name} criado em ${hookPath}`, 'success');
}

// Gera uma nova página
function generatePage(name) {
  const pagesDir = path.join('src', 'pages');
  const pagePath = path.join(pagesDir, `${name}Page.tsx`);
  
  // Template da página
  const pageTemplate = `interface ${name}PageProps {
  onNavigate: (path: string) => void;
}

export function ${name}Page({ onNavigate }: ${name}PageProps) {
  return (
    <div className="space-y-8 animate-slide-in">
      <h1 className="text-4xl font-display font-black gradient-text">
        ${name}
      </h1>
      {/* Conteúdo da página */}
    </div>
  );
}
`;

  // Cria o arquivo da página
  fs.writeFileSync(pagePath, pageTemplate);
  log(`✓ Página ${name} criada em ${pagePath}`, 'success');
}

// Função principal
function main() {
  const args = process.argv.slice(2);
  const type = args[0];
  const name = args[1];

  if (!type || !name) {
    log('Uso: node generate.js <type> <name>', 'error');
    log('Types disponíveis: component, hook, page', 'info');
    process.exit(1);
  }

  switch (type) {
    case 'component':
      generateComponent(name);
      break;
    case 'hook':
      generateHook(name);
      break;
    case 'page':
      generatePage(name);
      break;
    default:
      log(`Tipo inválido: ${type}`, 'error');
      log('Types disponíveis: component, hook, page', 'info');
      process.exit(1);
  }
}

main();